import P5 from "p5"
import {Player,Vector} from "./Player"
import {Plataform} from "./Plataform"
import { Level } from "./Level";
import { CollisionsController } from "./CollisionsController";
import { KeyController } from "./KeyController";


const Sketch = (p5: P5) => {
    let user:Player;
    let level:Level;
    let dect:CollisionsController;
    let keyController:KeyController;
    let speed:number;
    p5.setup = () => {
        p5.createCanvas(1000, 700);
        user  = new Player(50,50,30);
        level = new Level();
        dect  = new CollisionsController();
        /*for (let index = 0; index < 20; index++) {
            level.add(new Plataform(p5.random(0,p5.width), p5.random(0,p5.height), p5.random(100,200)))
        }*/
        level.add(new Plataform(50,500,100))
        level.add(new Plataform(500,500,100))
        level.add(new Plataform(5,100,50))
        keyController = new KeyController();
        speed = 5;
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

    p5.keyPressed = () => {
        if (p5.key === 'D' || p5.key === 'd' ||
            p5.key === 'A' || p5.key === 'a') {
            if(user.canJump)user.stop()
            keyController.putKey(p5.key.toLowerCase(),true);

        }
        if (p5.key === 'W' || p5.key === 'w') {
            keyController.putKey(p5.key.toLowerCase(),true);
        }
    }

    p5.keyReleased = () => {
        if (p5.key === 'D' || p5.key === 'd' || 
            p5.key === 'A' || p5.key === 'a') {
            keyController.putKey(p5.key.toLowerCase(),false);
        }
        if(p5.key === 'W' || p5.key === 'w'){
            keyController.putKey(p5.key.toLowerCase(),false);
            user.jump(new Vector(0,0.1));
        }
        console.log(keyController.keys);
    }

    function move() {
        let keysActivated:Array<string> = keyController.getKeysActivated();
        if (keysActivated.includes('a') && user.canJump) {
            user.applyForce(new Vector(-speed,0));
            return;
        }
        if (keysActivated.includes('d') && user.canJump) {
            user.applyForce(new Vector( speed,0));
            return;
        }
        if (keysActivated.includes('w') && user.canJump) {
            return;
        }
        if(user.canJump){
            user.stop();
        }
    }
}

export default Sketch