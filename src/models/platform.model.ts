import { BoundingBox } from "./bounding-box.model";
import { Vector } from "./vector.model";

export class Platform implements BoundingBox {
    pointBox: Vector;
    widthBox: number;
    color: string;
    heightBox: number;

    constructor(posX: number, posY: number, width: number, height:number) {
        this.pointBox  = new Vector(posX, posY);
        this.widthBox  = width;
        this.heightBox = height
        this.color     = "blank";
    }

    changeColor(color: string) {
        this.color = color;
    }

    setPosition(posX: number, posY: number) {
        this.pointBox = new Vector(posX, posY);
    }

}