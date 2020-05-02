import { Vector } from "./Player";

export class Plataforms{
    firstPoint:Vector;
    secondPoint:Vector;    
    readonly height:number = 5;
    constructor(posX:number, posY:number, dim:number){
        this.firstPoint  = new Vector(posX, posY);
        this.secondPoint = new Vector(dim, this.height);
    }

    getFirstPoint():Vector{
        return this.firstPoint;
    }

    getSecondPoint():Vector{
        return this.secondPoint;
    }

    
}