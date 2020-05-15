import { Vector } from "./vector.model";

export class Player {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    mass: number;
    readonly gravity: Vector  = new Vector(0, 9.8);
    readonly maxSpeed: number = 10;
    canJump: boolean;

    constructor(posX: number, posY: number, mass: number) {
        this.position     = new Vector(posX, posY);
        this.mass         = mass;
        this.velocity     = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.canJump      = false;
    }

    fall() {
        this.acceleration.add(
            Vector.div(this.gravity, this.mass)
        );
    }

    jump(force: Vector) {
        if (!this.canJump) {
            return;
        }
        this.applyForce(force);
        this.velocity.y *= -1;
        this.canJump = false;
    }

    applyForce(force: Vector) {
        this.acceleration.add(
            Vector.div(force, this.mass)
        );
    }

    private controllSpeed() {
        if (this.velocity.x > this.maxSpeed) {
            this.velocity.x = this.maxSpeed
        }
        if (this.velocity.x < -this.maxSpeed) {
            this.velocity.x = -this.maxSpeed;
        }
        if (this.velocity.y > this.maxSpeed) {
            this.velocity.y = this.maxSpeed
        }
        if (this.velocity.y < -this.maxSpeed) {
            this.velocity.y = -this.maxSpeed;
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.controllSpeed();
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    stop() {
        this.velocity.mult(0);
    }

    checkEdges(width: number, height: number) {
        if (this.position.x  > width) {
            this.position.x = width;
            this.velocity.x *= -1;
        } else if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x *= -1;
        }

        if (this.position.y > height) {
            this.position.y = height;
            this.canJump = true;
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
        }

    }

}