// Colisiones mediante rectángulos
import { Vector } from "./vector.model";

export interface BoundingBox {
    pointBox: Vector;
    widthBox: number;
    heightBox: number;
}