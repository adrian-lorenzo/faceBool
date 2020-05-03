import P5 from "p5";
import { FaceDetection, WithFaceLandmarks, FaceLandmarks68 } from "face-api.js";
import FaceDetectionService from "../services/FaceDetectionService";
import {Player,Vector} from "./User";
import {Plataforms} from "./Plataforms";

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
    let p: Plataforms;

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
        p = new Plataforms(30, 500,100);
    }

    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(dimensions.width, dimensions.height);
    }


    p5.draw = () => {
        // MARK: - Code for object detection
        /*
        p5.image(videoCapture, 0, 0, dimensions.width, dimensions.height);
        faceDetectionService.getFace(videoCapture.elt, dimensions).then((detection) => {
            if (detection) {
                drawBoundingBox(detection);
            }
        });
        */

       p5.background("black");
       p5.fill("green");
       p5.circle(user.position.x,user.position.y, user.mass);
       p5.fill(p5.color(p.color));
       p5.rect(p.pointBox.x, p.pointBox.y, p.widthBox,p.heightBox);
       p5.noFill();
       p5.stroke(255,0,255);
       p5.rect(user.pointBox.x,user.pointBox.y, user.widthBox,user.heightBox);
       p5.noStroke()
       user.fall();
       user.update();
       move();
       detection();
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
                    user.stop();
                }
                break;
            default:
                break;
        }
    }

    function detection(){
        if (user.pointBox.x > p.pointBox.x + p.widthBox || 
            user.pointBox.x + user.widthBox < p.pointBox.x || 
            user.pointBox.y > p.pointBox.y + p.heightBox  ||
            user.pointBox.y + user.heightBox < p.pointBox.y) {
            p.changeColor("blank");
            user.canJump = false;
            return;
        }
        p.changeColor("red");
        if(user.pointBox.y < p.pointBox.y && 
            (
                (user.pointBox.x > p.pointBox.x && user.pointBox.x < p.pointBox.x + p.widthBox) ||
                (user.pointBox.x + user.widthBox > p.pointBox.x && user.pointBox.x + user.widthBox < p.pointBox.x + p.widthBox)
            )
        ){
            user.canJump = true;
            user.pointBox.y = p.pointBox.y - user.heightBox;
            user.position.y = p.pointBox.y - user.mass/2;
        } else {
            user.velocity.y *= -1;
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