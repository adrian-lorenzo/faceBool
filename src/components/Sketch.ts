import { FaceDetection, FaceLandmarks68, WithFaceLandmarks } from "face-api.js";
import P5 from "p5";
import FaceDetectionService from "../services/FaceDetectionService";
import { Engine, Bodies, World, Events, Body } from "matter-js";

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
    let oldPosition: Matter.Vector = { x: 0,  y: 0 };
    let isDetecting = false;
    
    // MARK: - Physics engine constants
    let engine = Engine.create(); 

    // Ball
    let player = Bodies.circle(50, 50, 30, {
        id: 0,
        density: 0.004,
        friction: 0.8,
        frictionStatic: 0,
        frictionAir: 0.02,
        restitution: 0.5,
        
    });

    //Platforms
    let userPlatform = Bodies.rectangle(0, 0, 200, 30, { isStatic: true});
    let platforms = [
        Bodies.rectangle(50, 300, 100, 30, { isStatic: true }),
        Bodies.rectangle(300, 300, 30, 100, { isStatic: true }),
        Bodies.rectangle(500, 300, 100, 30, { isStatic: true }),
        Bodies.rectangle(dimensions.width / 2, (dimensions.height - 40), dimensions.width, 40, { isStatic: true })
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
        if (isDetecting === false) {
            faceDetectionService.getFace(videoCapture.elt, dimensions)
                .then(res => detection = res)
                .finally(() => isDetecting = false )
            isDetecting = true;
        }

        if (detection) {
            const points = detection.landmarks.positions;
            const position = points[28];
            Body.translate(userPlatform, { x: position.x-oldPosition.x, y: position.y-oldPosition.y});
            oldPosition = { x: position.x, y: position.y };

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
                    y: -0.5
                };
            }
            
            if (actions.get(PlayerAction.MoveLeft)) {
                player.torque = -0.5;
            }

            if (actions.get(PlayerAction.MoveRight)) {
                player.torque = 0.5;
            }
        });

        Events.on(engine, "collisionEnd", (event) =>  {
            if (event.pairs[0].bodyA.id === 0 || event.pairs[0].bodyB.id === 0) {
              isOnTheGround = false;
            }

          });

        Events.on(engine, "collisionStart", (event) => {
            if(event.pairs[0].bodyA.id === 0 || event.pairs[0].bodyB.id === 0){
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


    function drawShape(vertices: Matter.Vector[]) {
        p5.beginShape();
        for (const vertex of vertices) {
            p5.vertex(vertex.x, vertex.y);
        }
        p5.endShape();
    }
}

export default Sketch;