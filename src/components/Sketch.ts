import P5 from "p5"
import {Player,Vector} from "./User"


enum State{
    jump  = 0,
    left  = 1,
    rigth = 2,
    none  = 3
}

const Sketch = (p5: P5) => {
    let user:Player;
    let state:State;
    p5.setup = () => {
        p5.createCanvas(1000, 700);
        user  = new Player(50,50,30);
        state = State.none;
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

    p5.draw = () => {
        p5.background("black");
        p5.fill("green");
        p5.circle(user.position.x,user.position.y, user.mass);
        user.fall();
        user.update();
        move();
        user.checkEdges(p5.width,p5.height);
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
}

export default Sketch