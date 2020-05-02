import P5 from "p5";
import { FaceDetection, WithFaceLandmarks, FaceLandmarks68 } from "face-api.js";
import FaceDetectionService from "../services/FaceDetectionService";
import {Player,Vector} from "./User"

enum State{
    jump  = 0,
    left  = 1,
    rigth = 2,
    none  = 3
}

const Sketch = (p5: P5) => {
    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let user: Player;
    let state: State;

    p5.setup = () => {
        // MARK: - Code for object detection
        /*
        p5.createCanvas(dimensions.width, dimensions.height);
        p5.background("black");
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();
        user  = new Player(50,50,30);
        state = State.none;
        */

        p5.background("black");
        p5.fill("green");
        p5.circle(user.position.x,user.position.y, user.mass);
        user.fall();
        user.update();
        move();
        user.checkEdges(p5.width,p5.height);
    }

    function move() {
        switch (state) {
            case State.left:
                if(user.canJump){
                    user.applyForce(new Vector(-5,0));
                }
                break;
            case State.rigth:
                if(user.canJump){
                    user.applyForce(new Vector(5,0));
                }
                break;
            case State.none:
                if(user.canJump){
                    user.cleanMove();
                }
                break;
            default:
                break;
        }
    }

    p5.keyPressed = () => {
        if (p5.key === 'W' || p5.key === 'w') {
            //user.jump(new Vector(0,0.1));
            state = State.jump;

        }
        if (p5.key === 'D' || p5.key === 'd') {
            //user.applyForce(new Vector(10,0));
            state = State.rigth;
        }
        if (p5.key === 'A' || p5.key === 'a') {
            //user.applyForce(new Vector(-10,0));
            state = State.left;
        }
    }

    p5.keyReleased = () => {
        if (p5.key === 'D' || p5.key === 'd' || 
            p5.key === 'A' || p5.key === 'a') {
            state = State.none;
            //user.cleanMove()
        }
        if(p5.key === 'W' || p5.key === 'w'){
            state = State.none;
            user.jump(new Vector(0,0.1));
        }
    }


    p5.draw = () => {
        p5.image(videoCapture, 0, 0, dimensions.width, dimensions.height);
        faceDetectionService.getFace(videoCapture.elt, dimensions).then((detection) => {
            if (detection) {
                drawBoundingBox(detection);
            }
        });
    }


    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(dimensions.width, dimensions.height);
    }


    const drawBoundingBox = (detection: WithFaceLandmarks<{detection: FaceDetection;}, FaceLandmarks68>) => {
        let points = detection.landmarks.positions;
        
        for (let i = 0; i < points.length; i++) {
            p5.stroke(255, 0, 0);
            p5.strokeWeight(10);
            p5.point(points[i].x, points[i].y);
        }

        let box = detection.alignedRect.box;

        p5.noFill();
        p5.rect(box.x, box.y, box.width, box.height);
    }
}

export default Sketch;