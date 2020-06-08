import { Bodies, Body } from "matter-js";
import P5 from "p5";
import { Size } from "../models/Size";
import { getUniqueIdentifier } from "../utils/uiUtils";
import Entity from "./Entity";

export default class Platform implements Entity {
    id: number = getUniqueIdentifier();
    entity: Matter.Body
    dimensions: Size;
    hidden = false

    constructor(pos: Matter.Vector, dimensions: Size, angle: number = 0) {
        this.entity = Bodies.rectangle(pos.x, pos.y, dimensions.width, dimensions.height, {
            id: this.id,
            isStatic: true,
            angle: angle,
            // render: {
            //     sprite: {
            //         texture: 'platform_texture.png',
            //         xScale: 2,
            //         yScale: 2
            //     }
            // }
        });
        this.dimensions = dimensions;
        /**this.texturePoints = [
            [0, 0],
            [dimensions.width, 0],
            [dimensions.width, dimensions.height],
            [0, dimensions.height]
        ]*/
    }

    draw(p5: P5, texture?: P5.Image) {
        if (this.hidden) return;
        p5.push();
        p5.beginShape();
        if (texture) { p5.texture(texture); }
        this.entity.vertices.forEach((vertex, i) => {
            p5.vertex(vertex.x, vertex.y)//, 0, ...this.texturePoints[i]);
        })
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