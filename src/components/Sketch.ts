import { Engine, Events, World } from "matter-js";
import P5 from "p5";
import { horizontalScroll } from "../events/HorizontalScrollEvent";
import FaceDetectionService from "../services/FaceDetectionService";
import HandDetectionService from "../services/hand-detection.service";
import { relHeight, relWidth } from "../utils/uiUtils";
import Ball from "./Ball";
import Platform from "./Platform";


enum PlayerAction {
    Jump,
    MoveLeft,
    MoveRight
}

const Sketch = (p5: P5) => {
    // MARK: - Face detection constants
    const faceDetectionService = new FaceDetectionService();
    const handDetectionService = new HandDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let handDetection: { [key: string]: [number, number, number][] };
    let oldPosition: Matter.Vector = { x: 0, y: 0 };
    let isDetecting = true;

    // MARK: - Physics engine constants
    let engine = Engine.create();

    // Ball
    let player = new Ball(
        {
            x: relWidth(0.05),
            y: relWidth(0.05)
        },
        relWidth(0.03)
    )

    //Platforms
    let userPlatform = new Platform(
        {
            x: 0,
            y: 0
        },
        {
            width: relWidth(0.38),
            height: relHeight(0.048)
        }
    );

    let platforms = [
        new Platform(
            {
                x: relWidth(0.1),
                y: relHeight(0.3)
            },
            {
                width: relWidth(0.2),
                height: relHeight(0.05)
            },
            p5.QUARTER_PI
        ),

        new Platform(
            {
                x: relWidth(0.25),
                y: relHeight(0.6)
            },
            {
                width: relWidth(0.15),
                height: relHeight(0.05)
            },
            p5.QUARTER_PI / 2
        ),

        new Platform(
            {
                x: relWidth(0.9),
                y: relHeight(0.4)
            },
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            }
        ),

        //floor, walls and ceiling
        new Platform(
            {
                x: relWidth(0.5),
                y: relHeight(0.999)
            },
            {
                width: relWidth(1),
                height: relHeight(0.01)
            }
        ),
        new Platform(
            {
                x: relWidth(0.001),
                y: relHeight(0.5)
            },
            {
                width: relWidth(0.01),
                height: relHeight(1)
            }
        ),
        new Platform(
            {
                x: relWidth(0.5),
                y: relHeight(0.001)
            },
            {
                width: relWidth(1),
                height: relHeight(0.01)
            }
        )
    ];

    // App state
    let actions: Map<PlayerAction, Boolean> = new Map();


    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1));
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        // Physics setup
        World.add(engine.world, player.entity);
        World.add(engine.world, platforms.map((platform) => platform.entity));
        World.add(engine.world, userPlatform.entity);
        subscribeActions();

        faceDetectionService.loadModels();

        setTimeout(() => {
            Engine.run(engine);
            isDetecting = false;
        }, 4000)
    }

    p5.draw = () => {
        // Environment
        drawBackground();
        drawPlatforms();
        player.draw(p5);
    }


    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(relWidth(1), relHeight(1));
    }


    p5.keyPressed = () => {
        if (p5.key === 'D' || p5.key === 'd') {
            actions.set(PlayerAction.MoveRight, true);
        }

        if (p5.key === 'A' || p5.key === 'a') {
            actions.set(PlayerAction.MoveLeft, true);
        }

        if (p5.key === 'W' || p5.key === 'w') {
            actions.set(PlayerAction.Jump, true);
        }
    }


    p5.keyReleased = () => {
        if (p5.key === 'D' || p5.key === 'd') {
            actions.set(PlayerAction.MoveRight, false);
        }

        if (p5.key === 'A' || p5.key === 'a') {
            actions.set(PlayerAction.MoveLeft, false);
        }

        if (p5.key === 'W' || p5.key === 'w') {
            actions.set(PlayerAction.Jump, false);
        }
    }

    function drawBackground() {
        p5.background(0);
        p5.push()
        p5.translate(relWidth(1), 0)
        p5.scale(-1.0, 1.0);
        p5.image(videoCapture, 0, 0, relWidth(1), relHeight(1));
        p5.pop();
    }

    function subscribeActions() {
        Events.on(engine, "beforeTick", (_) => {
            runDetection();

            if (actions.get(PlayerAction.Jump)) {
                player.jump();
            }

            if (actions.get(PlayerAction.MoveLeft)) {
                player.moveLeft();
            }

            if (actions.get(PlayerAction.MoveRight)) {
                player.moveRight();
            }
        });

        Events.on(engine, "collisionEnd", (event) => {
            if (event.pairs[0].bodyA.id === player.id || event.pairs[0].bodyB.id === player.id) {
                player.isOnGround = false;
            }

        });

        Events.on(engine, "collisionStart", (event) => {
            if (event.pairs[0].bodyA.id === player.id || event.pairs[0].bodyB.id === player.id) {
                player.isOnGround = true;
            }
            if ((event.pairs[0].bodyA.id === player.id || event.pairs[0].bodyB.id === player.id) &&
                player.getPosition().x > relWidth(0.9)) {
                horizontalScroll(userPlatform, platforms, player);
            }
        });
    }

    function runDetection() {
        if (!isDetecting) {
            isDetecting = true;
            handDetectionService.getHand(videoCapture.elt)
                .then(res => {
                    if (res) {
                        handDetection = res;
                    }
                })
                .finally(() => isDetecting = false);
        }

        if (handDetection) {
            // const points = Array(50).fill({ x: 20, y: 30 })
            // const position = points[28];
            handDetection.indexFinger.forEach(([x, y, _], i) => {
                p5.push();
                p5.text(`i-${i}`, x, y)
                p5.point(x, y);
                p5.pop();
            })
            handDetection.thumb.forEach(([x, y, _], i) => {
                p5.push();
                p5.text(`t-${i}`, x, y)
                p5.point(x, y);
                p5.pop();
            })
            // userPlatform.translate({ x: position.x - oldPosition.x, y: position.y - oldPosition.y });
            // oldPosition = { x: position.x, y: position.y };

            // let leftEye = points[37].add(points[40]).div({ x: 2, y: 2 });
            // let rightEye = points[46].add(points[43]).div({ x: 2, y: 2 });
            // let direction = leftEye.sub(rightEye)
            // userPlatform.setAngle(Math.atan2(direction.y, direction.x))
        }
    }

    function drawPlatforms() {
        for (const platform of platforms) {
            platform.draw(p5);
        }

        userPlatform.draw(p5);
    }
}

export default Sketch;