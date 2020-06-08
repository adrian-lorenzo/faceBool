import Entity from "./Entity";
import { Bodies, Body } from "matter-js";
import P5 from "p5";
import { getUniqueIdentifier } from "../utils/uiUtils";

export default class Ball implements Entity {
    id: number = getUniqueIdentifier();
    entity: Matter.Body
    torque: number
    jumpForce: number
    isOnGround: boolean = true

    constructor(pos: Matter.Vector, radius: number) {
        this.entity = Bodies.circle(pos.x, pos.y, radius, {
            id: this.id,
            density: radius * 0.08,
            friction: 0.1,
            frictionStatic: 0,
            frictionAir: 0.02,
            restitution: 0.8
        });
        this.torque = radius * 30;
        this.jumpForce = -radius * 8;
    }

    draw(p5: P5) {
        const radius = this.entity.circleRadius ? this.entity.circleRadius : 0
        
        p5.push();
        p5.fill(p5.color("red"));
        p5.circle(
            this.entity.position.x, 
            this.entity.position.y,
            radius * 2
        );
        p5.pop();
    }

    moveRight() {
        this.entity.torque = this.torque
    }

    moveLeft() {
        this.entity.torque = -this.torque
    }

    translate(position: Matter.Vector) {
        Body.translate(this.entity, position);
    }

    getPosition(){
        return this.entity.position;
    }

    jump() {
        if (this.isOnGround) {
            this.entity.force = {
                x: 0,
                y: this.jumpForce
            }
        }
    }
}