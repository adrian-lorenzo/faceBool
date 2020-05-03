import { BoundingBox } from "./BoundingBox";

export class Vector {
    x:number;
    y:number;
    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }

    add(vector:Vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    static div(vector:Vector,cte:number): Vector{
        return new Vector(vector.x/cte, vector.y/cte);
    }

    mult(cte:number){
        this.x *= cte;
        this.y *= cte;
    }

    subtract(vector:Vector){
        this.x -= vector.x;
        this.y -= vector.y;
    }

    toString(){
        return "[" + this.x + "," + this.y + "]"
    }


}

export class Player implements BoundingBox{
    position:Vector;
    velocity:Vector;
    acceleration:Vector;
    mass:number;
    readonly gravity: Vector = new Vector(0,9.8);
    canJump:boolean;
    pointBox:Vector;
    widthBox:number;
    heightBox:number;
    constructor(posX:number, posY:number, mass:number) {
        this.position     = new Vector(posX,posY);
        this.mass         = mass;
        this.velocity     = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.canJump      = false;
        this.pointBox = new Vector(posX - mass/2,posY-mass/2);
        this.widthBox = mass;
        this.heightBox = mass;
    }

    fall(){
        this.acceleration.add(
            Vector.div(this.gravity,this.mass)
        );
    }

    jump(force:Vector){
        if (!this.canJump) {
            return;
        }
        this.applyForce(force);
        this.velocity.y *= -1;
        //console.log(this.position.y);
        this.canJump = false;
    }

    applyForce(force:Vector){
        //force.subtract(this.gravity);
        this.acceleration.add(
            Vector.div(force,this.mass)
        );
    }

    update(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.pointBox = new Vector(this.position.x - this.mass/2, this.position.y - this.mass/2)
        this.acceleration.mult(0);
    }

    stop(){
        this.velocity.mult(0);
    }

    checkEdges(width:number, height:number){
        if (this.position.x + this.widthBox > width) {
            this.position.x = width - this.mass;
            this.pointBox.x = width;
            this.velocity.x *= -1;
        } else if (this.position.x < 0) {
            this.position.x = 0;
            this.pointBox.x = 0;
            this.velocity.x *= -1;
        }
    
        if (this.position.y + this.heightBox > height) {
            this.position.y = height - this.mass;
            this.pointBox.y = height;
            this.canJump = true;
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.pointBox.y = 0;
            this.velocity.x *= -1;
        }

    }

}