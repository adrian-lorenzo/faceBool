import { World, Vec2, Body, Circle } from "planck-js";
import P5 from "p5";
import { getUniqueIdentifier } from "../utils/uiUtils";
import Entity from "./Entity";
import { PPM } from "../utils/constants";
import { pixelsToMetters, mettersToPixels } from "../utils/ppmUtils";

export default class Ball implements Entity {
    id: number = getUniqueIdentifier();
    
    entity: Body;
    torque: number;
    jumpForce: number;
    radius: number;
    initialPosition: Vec2;
    initialAngle: number;

    isOnGround: boolean = true;

    constructor(pos: Vec2, radius: number, world?: World) {
        this.initialPosition = pixelsToMetters(pos);
        this.initialAngle = radius;
        this.radius = radius;
        this.torque = radius * 30;
        this.jumpForce = -radius;

        world = world ? world : new World()
        
        this.entity = world.createDynamicBody({
            position: this.initialPosition,
            linearDamping: 1
        });

        this.entity.createFixture({
            shape: Circle(this.radius/PPM),
            density: 30,
            friction: 2
        });
    }

    init(world: World) {
        this.entity = world.createDynamicBody({
            position: this.initialPosition,
            linearDamping: 1
        });

        this.entity.createFixture({
            shape: Circle(this.radius/PPM),
            density: 30,
            friction: 2
        });
    }

    draw(p5: P5, texture?: P5.Image) {
        p5.push();
        p5.fill(p5.color("black"));
        if (texture) p5.texture(texture);
        const currentPosition = mettersToPixels(this.entity.getPosition())
        p5.circle(
            currentPosition.x,
            currentPosition.y,
            this.radius * 2
        );
        p5.pop();
    }

    moveRight() {
        this.entity.applyTorque(this.torque);
    }

    moveLeft() {
        this.entity.applyTorque(-this.torque);
    }

    translate(position: Vec2) {
        this.entity.setTransform(pixelsToMetters(position), this.entity.getAngle());
    }

    getPosition = () => {
        return mettersToPixels(this.entity.getPosition());
    }

    jump() {
        if (this.isOnGround) {
            const impulse = this.entity.getMass() * this.jumpForce;
            this.entity.applyLinearImpulse(Vec2(0, impulse), this.entity.getWorldCenter());
        }
    }
}