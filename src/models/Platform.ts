import { Bodies, Body } from "matter-js";
import P5 from "p5";
import { Size } from "./Size";
import { getUniqueIdentifier } from "../utils/uiUtils";
import Entity from "./Entity";

export default class Platform implements Entity {
    id: number = getUniqueIdentifier();
    entity: Matter.Body
    dimensions: Size;
    hidden = false
    texturePoints = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
    ];

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
    }

    draw(p5: P5, texture?: P5.Image) {
        if (this.hidden) return;
        p5.push();
        if (texture) { p5.texture(texture); }
        p5.beginShape();
        this.entity.vertices.forEach((vertex, i) => {
            p5.vertex(vertex.x, vertex.y, 0, ...this.texturePoints[i]);
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