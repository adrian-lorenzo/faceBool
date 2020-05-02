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

export class Player {
    position:Vector;
    velocity:Vector;
    acceleration:Vector;
    mass:number;
    readonly gravity: Vector = new Vector(0,9.8);
    canJump:boolean;
    constructor(posX:number, posY:number, mass:number) {
        this.position     = new Vector(posX,posY);
        this.mass         = mass;
        this.velocity     = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.canJump      = false;
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
        this.acceleration.mult(0);
    }

    cleanMove(){
        this.velocity     = new Vector(0,0);
        this.acceleration = new Vector(0,0);
    }

    checkEdges(width:number, height:number){
        if (this.position.x > width) {
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
            this.velocity.x *= -1;
        }

    }

}