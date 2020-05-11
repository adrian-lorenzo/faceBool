import { BoundingBox } from "./BoundingBox";
import { Vector } from "./Player";

export class Plataform implements BoundingBox {
    pointBox: Vector;
    widthBox: number;
    readonly heightBox: number = 10;
    color: string;

    constructor(posX: number, posY: number, dim: number) {
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;
        this.color = "blank";
    }

    changeColor(color: string) {
        this.color = color;
    }

    setPos(posX: number, posY: number, dim: number) {
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;
    }

}