import { FaceDetection, FaceLandmarks68, WithFaceLandmarks } from "face-api.js";
import { Composite, Engine, Events, World } from "matter-js";
import P5 from "p5";
import { horizontalScroll } from "../events/HorizontalScrollEvent";
import FaceDetectionService from "../services/FaceDetectionService";
import { relHeight, relWidth } from "../utils/uiUtils";
import Ball from "./Ball";
import Platform from "./Platform";
import { Sound } from "./Sound";

enum PlayerAction {
    Jump,
    MoveLeft,
    MoveRight
}

const Sketch = (p5: P5) => {
    // MARK: - Face detection constants
    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let detection: WithFaceLandmarks<{ detection: FaceDetection; }, FaceLandmarks68> | undefined;
    let oldPosition: Matter.Vector = { x: 0, y: 0 };
    let isDetecting = true;
    const platformImage = p5.loadImage('platform_texture.jpg');
    const ballImage = p5.loadImage('basketball.jpg');


    let currentFrameRate = 30;
    let loadStatus = 0;
    let leftLimit = 0.2;
    let rightLimit = 0.8;

    // MARK: - Physics engine constants
    let engine = Engine.create();

    // Ball
    let player = new Ball(
        {
            x: relWidth(0.05),
            y: relWidth(0.05)
        },
        relWidth(0.03),
        ballImage
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
            p5.QUARTER_PI,
            platformImage
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
            p5.QUARTER_PI / 2,
            platformImage
        ),

        new Platform(
            {
                x: relWidth(0.9),
                y: relHeight(0.4)
            },
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0,
            platformImage
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
            },
            0,
            platformImage
        ),
        new Platform(
            {
                x: relWidth(0.001),
                y: relHeight(0.5)
            },
            {
                width: relWidth(0.01),
                height: relHeight(1)
            },
            0,
            platformImage
        ),
        new Platform(
            {
                x: relWidth(0.5),
                y: relHeight(0.001)
            },
            {
                width: relWidth(1),
                height: relHeight(0.01)
            },
            0,
            platformImage
        ),
        new Platform(
            {
                x: relWidth(0.9),
                y: relHeight(0.9)
            },
            {
                width: relWidth(1),
                height: relHeight(0.1)
            }
        )
    ];

    // App state
    let actions: Map<PlayerAction, Boolean> = new Map();

    // Sound
    let sound: Sound = new Sound();



    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1), "webgl");
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        // Physics setup
        World.add(engine.world, platforms.map((platform) => platform.entity));
        subscribeActions();
        p5.frameRate(currentFrameRate);
        p5.tint(55, 100);

        faceDetectionService.loadModels();

        setTimeout(() => {
            Engine.run(engine);
            World.add(engine.world, player.entity);
            isDetecting = false;
            p5.tint(255, 255);
        }, 4000);

        let increaseLoadingBar = setInterval(() => {
            loadStatus += 100;
            if (loadStatus >= 4000) clearInterval(increaseLoadingBar);
        }, 100);
    }

    p5.draw = () => {
        // Environment
        p5.translate(-p5.width / 2, -p5.height / 2, 0);
        Engine.update(engine, 1000 / currentFrameRate);
        drawBackground();
        drawPlatforms();
        drawLimits();
        checkLimits();
        player.draw(p5);
        if (loadStatus < 4000) drawLoader();
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
            sound.playJumpSound();
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
        Events.on(engine, "beforeUpdate", (_) => {
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
                horizontalScroll(userPlatform, platforms, player, sound);
            }
        });
    }

    function runDetection() {
        if (!isDetecting) {
            isDetecting = true;
            faceDetectionService.getFace(videoCapture.elt, dimensions)
                .then(res => detection = res)
                .finally(() => isDetecting = false);
        }

        if (detection) {
            const points = detection.landmarks.positions;
            const position = points[28];

            userPlatform.translate({ x: position.x - oldPosition.x, y: position.y - oldPosition.y });
            oldPosition = { x: position.x, y: position.y };

            let leftEye = points[37].add(points[40]).div({ x: 2, y: 2 });
            let rightEye = points[46].add(points[43]).div({ x: 2, y: 2 });
            let direction = leftEye.sub(rightEye)
            userPlatform.setAngle(Math.atan2(direction.y, direction.x))
        }
    }

    function drawLoader() {
        p5.rect(relWidth(0.05), relHeight(0.9), relWidth(0.25), relHeight(0.05));
        p5.fill(0, 255, 0);
        p5.rect(relWidth(0.051), relHeight(0.901), relWidth(loadStatus * 0.25 / 4000), relHeight(0.049))
        p5.fill(0);
        p5.textSize(relWidth(0.025));
        p5.text("Cargando...", relWidth(0.12), relHeight(0.94));
        p5.fill(255);
    }

    function checkLimits() {
        if ((player.getPosition().x) < relWidth(leftLimit) ||
            (player.getPosition().x) > relWidth(rightLimit)) {
            World.remove(engine.world, userPlatform.entity);
        } else if (Composite.get(engine.world, userPlatform.entity.id, "body") === null) {
            World.add(engine.world, userPlatform.entity);
        }
    }


    function drawLimits() {
        p5.strokeWeight(3);
        for (let i = relHeight(0); i < relHeight(1); i += relHeight(0.05)) {
            p5.line(relWidth(leftLimit), i, relWidth(leftLimit), i + relHeight(0.02));
            p5.line(relWidth(rightLimit), i, relWidth(rightLimit), i + relHeight(0.02));
        }
        p5.push();
        p5.translate(0, 0);
        p5.fill(255, 0, 0, 100);
        p5.noStroke();
        p5.rect(0, 0, relWidth(leftLimit), relHeight(1));
        p5.rect(relWidth(rightLimit), 0, relWidth(1), relHeight(1));
        p5.pop();
    }

    function drawPlatforms() {
        for (const platform of platforms) {
            platform.draw(p5);
        }

        userPlatform.draw(p5);
    }
}

export default Sketch;