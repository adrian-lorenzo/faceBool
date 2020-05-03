import { Vector } from "./Player";
import { Box } from "./Box";

export class Plataforms implements Box{
    pointBox : Vector;
    widthBox : number;
    readonly heightBox: number = 5;
    constructor(posX:number, posY:number, dim:number){
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;

    }
    
}