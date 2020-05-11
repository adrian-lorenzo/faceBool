import { BoundingBox } from "./bounding-box.model";
import { Vector } from "./vector.model";

export class Platform implements BoundingBox {
    pointBox: Vector;
    widthBox: number;
    color: string;
    readonly heightBox: number = 10;

    constructor(posX: number, posY: number, dim: number) {
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;
        this.color = "blank";
    }

    changeColor(color: string) {
        this.color = color;
    }

    setPosition(posX: number, posY: number, dim: number) {
        this.pointBox = new Vector(posX, posY);
        this.widthBox = dim;
    }

}