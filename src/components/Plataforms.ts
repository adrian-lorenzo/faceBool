import { Vector } from "./Player";
import { BoundingBox } from "./BoundingBox";

export class Plataforms implements BoundingBox{
    pointBox : Vector;
    widthBox : number;
    readonly heightBox: number = 5;
    color:string;
    constructor(posX:number, posY:number, dim:number){
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;
        this.color    = "blank";

    }

    changeColor(color:string){
        this.color = color;
    }
    
}