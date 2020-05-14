import { BoundingBox } from "../models/bounding-box.model";


// TODO: creo que el detect de un controller no deberia de modificar el estado de nada
// solo deberia de devolver true o false
export class CollisionsController {
    detectionByRectangles(one: BoundingBox, two: BoundingBox) {
        let collisionX:Boolean = one.pointBox.x + one.widthBox >= two.pointBox.x &&
        two.pointBox.x + two.widthBox >= one.pointBox.x;
        let collisionY:Boolean = one.pointBox.y + one.heightBox >= two.pointBox.y &&
        two.pointBox.y + two.heightBox >= one.pointBox.y;

        return collisionX && collisionY;
    }
}