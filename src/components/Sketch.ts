import P5 from "p5"
import {Player,Vector} from "./Player"
import {Plataform} from "./Plataform"
import { Level } from "./Level";
import { CollisionsController } from "./CollisionsController";


enum State{
    jump  = 0,
    left  = 1,
    rigth = 2,
    none  = 3
}

const Sketch = (p5: P5) => {
    let user:Player;
    let state:State;
    let level:Level;
    let dect:CollisionsController;
    p5.setup = () => {
        p5.createCanvas(1000, 700);
        user  = new Player(50,50,30);
        state = State.none;
        level = new Level();
        dect  = new CollisionsController();
        /*for (let index = 0; index < 20; index++) {
            level.add(new Plataform(p5.random(0,p5.width), p5.random(0,p5.height), p5.random(100,200)))
        }*/
        level.add(new Plataform(50,500,100))
        level.add(new Plataform(500,500,100))
        level.add(new Plataform(5,100,50))
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

    p5.draw = () => {
        p5.background("black");
        p5.fill("green");
        p5.circle(user.position.x,user.position.y, user.mass);
        for (const plat of level.getPlataforms()) {
            p5.fill(p5.color(plat.color));
            p5.rect(plat.pointBox.x, plat.pointBox.y, plat.widthBox,plat.heightBox);
        }
        p5.noFill();
        p5.stroke(255,0,255);
        p5.rect(user.pointBox.x,user.pointBox.y, user.widthBox,user.heightBox);
        p5.noStroke()
        user.fall();
        user.update();
        move();
        dect.detectionByRectangles(user,level);
        user.checkEdges(p5.width,p5.height);
    }

    /*function detection(){
        if (user.pointBox.x > p.pointBox.x   + p.widthBox    || 
            user.pointBox.x + user.widthBox  < p.pointBox.x || 
            user.pointBox.y > p.pointBox.y   + p.heightBox   ||
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

    }*/

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
}

export default Sketch