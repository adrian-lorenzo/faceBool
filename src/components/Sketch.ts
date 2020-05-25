import { FaceDetection, FaceLandmarks68, WithFaceLandmarks } from "face-api.js";
import { Bodies, Body, Engine, Events, World } from "matter-js";
import P5 from "p5";
import FaceDetectionService from "../services/FaceDetectionService";

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

    // MARK: - Physics engine constants
    let engine = Engine.create();

    // Ball
    let player = Bodies.circle(0.05 * dimensions.width, 0.05 * dimensions.width, 0.02 * dimensions.width, {
        id: 0,
        density: 0.0001,
        friction: 0.5,
        frictionStatic: 0,
        frictionAir: 0.05,
        restitution: 0.5
    });

    //Platforms
    let userPlatform = Bodies.rectangle(0, 0, 0.4 * dimensions.width, 0.05 * dimensions.height, { isStatic: true });
    let platforms = [
        Bodies.rectangle(0.05 * dimensions.width, 0.3 * dimensions.height, 0.1 * dimensions.width, 0.05 * dimensions.height, { isStatic: true }),
        Bodies.rectangle(0.2 * dimensions.width, 0.4 * dimensions.height, 0.1 * dimensions.width, 0.05 * dimensions.height, { isStatic: true }),
        Bodies.rectangle(0.9 * dimensions.width, 0.3 * dimensions.height, 0.3 * dimensions.width, 0.05 * dimensions.height, { isStatic: true }),


        Bodies.rectangle(0.5 * dimensions.width, 0.999 * dimensions.height, dimensions.width, 0.01 * dimensions.height, { isStatic: true }),    //floor, walls and ceiling
        Bodies.rectangle(0.001 * dimensions.width, 0.5 * dimensions.height, 0.01 * dimensions.width, dimensions.height, { isStatic: true }),
        Bodies.rectangle(0.999 * dimensions.width, 0.5 * dimensions.height, 0.01 * dimensions.width, dimensions.height, { isStatic: true }),
        Bodies.rectangle(0.5 * dimensions.width, 0.001 * dimensions.height, dimensions.width, 0.01 * dimensions.height, { isStatic: true })
    ];

    // App state
    let actions: Map<PlayerAction, Boolean> = new Map();
    let isOnTheGround = true;


    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(dimensions.width, dimensions.height);
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        // Physics setup
        World.add(engine.world, player);
        World.add(engine.world, platforms);
        World.add(engine.world, userPlatform);

        subscribeActions();

        Engine.run(engine)

        setTimeout(() => { isDetecting = false }, 7000)
    }

    p5.draw = () => {
        // Background
        p5.background(0);
        p5.push()
        p5.translate(dimensions.width, 0)
        p5.scale(-1.0, 1.0);
        p5.image(videoCapture, 0, 0, dimensions.width, dimensions.height);
        p5.pop();

        // Detection runtime
        // console.log(isDetecting);

        // if (detectionCounter === maxDetectionCounter) detectionCounter = 1;
        //console.log("bucle")

        /**if (!isDetecting && detectionCounter === 1) {
            isDetecting = true
            Promise.race([
                faceDetectionService.getFace(videoCapture.elt, dimensions)
                    .then(res => detection = res),
                setTimeout(() => { }, 1000)
            ]).finally(() => isDetecting = false)
        }*/

        if (!isDetecting) {
            isDetecting = true
            faceDetectionService.getFace(videoCapture.elt, dimensions)
                .then(res => detection = res)
                .finally(() => isDetecting = false)
        }

        if (detection) {
            const points = detection.landmarks.positions;
            const position = points[28];

            Body.translate(userPlatform, { x: position.x - oldPosition.x, y: position.y - oldPosition.y });
            oldPosition = { x: position.x, y: position.y };

            let leftEye = points[37].add(points[40]).div({ x: 2, y: 2 })
            let rightEye = points[46].add(points[43]).div({ x: 2, y: 2 })
            let direction = leftEye.sub(rightEye)
            Body.setAngle(userPlatform, Math.atan2(direction.y, direction.x))

            for (let i = 0; i < points.length; i++) {
                p5.stroke(255, 0, 0);
                p5.strokeWeight(10);
                p5.point(points[i].x, points[i].y);
            }
            //let box = detection.alignedRect.box;
            //p5.noFill();
            //p5.rect(box.x, box.y, box.width, box.height);
        }

        // Environment
        drawPlatforms();
        drawPlayer();
    }


    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(dimensions.width, dimensions.height);
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

    function subscribeActions() {
        Events.on(engine, "beforeTick", (_) => {
            if (actions.get(PlayerAction.Jump) && isOnTheGround) {
                player.force = {
                    x: 0,
                    y: -2
                };
            }

            if (actions.get(PlayerAction.MoveLeft)) {
                player.torque = -2;
            }

            if (actions.get(PlayerAction.MoveRight)) {
                player.torque = 2;
            }
        });

        Events.on(engine, "collisionEnd", (event) => {
            if (event.pairs[0].bodyA.id === 0 || event.pairs[0].bodyB.id === 0) {
                isOnTheGround = false;
            }

        });

        Events.on(engine, "collisionStart", (event) => {
            if (event.pairs[0].bodyA.id === 0 || event.pairs[0].bodyB.id === 0) {
                isOnTheGround = true;
            }
        });
    }

    function drawPlatforms() {
        p5.fill(p5.color("white"));
        for (const platform of platforms) {
            drawShape(platform.vertices);
        }
        drawShape(userPlatform.vertices);
    }


    function drawPlayer() {
        p5.fill(p5.color("red"));
        drawShape(player.vertices);
    }


    function drawShape(vertices: Matter.Vector[]) {
        p5.beginShape();
        for (const vertex of vertices) {
            p5.vertex(vertex.x, vertex.y);
        }
        p5.endShape();
    }
}

export default Sketch;