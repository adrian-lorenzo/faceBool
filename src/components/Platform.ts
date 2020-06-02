import Entity from "./Entity";
import { Bodies, Body } from "matter-js";
import P5 from "p5";
import { getUniqueIdentifier } from "../utils/uiUtils";
import { Size } from "../models/Size";

export default class Platform implements Entity {
    id: number = getUniqueIdentifier();
    entity: Matter.Body
    dimensions: Size

    constructor(pos: Matter.Vector, dimensions: Size, angle: number = 0) {
        this.entity = Bodies.rectangle(pos.x, pos.y, dimensions.width, dimensions.height, {
            isStatic: true,
            angle: angle
        });

        this.dimensions = dimensions;
    }

    draw(p5: P5) {
        p5.push();
        p5.beginShape();
        for (const vertex of this.entity.vertices) {
            p5.vertex(vertex.x, vertex.y);
        }
        p5.endShape();
        p5.pop();
    }

    translate(position: Matter.Vector) {
        Body.translate(this.entity, position);
    }

    setAngle(radians: number) {
        Body.setAngle(this.entity, radians);
    }
}