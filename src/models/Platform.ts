import { World, Vec2, Body, Box } from "planck-js";
import P5 from "p5";
import { Size } from "./Size";
import { getUniqueIdentifier } from "../utils/uiUtils";
import Entity from "./Entity";
import { PPM } from "../utils/constants";
import { mettersToPixels, pixelsToMetters } from "../utils/ppmUtils";

export default class Platform implements Entity {
    id: number = getUniqueIdentifier();
    entity: Body
    dimensions: Size;
    hidden = false;
    initialPosition: Vec2;
    initialAngle: number;

    texturePoints = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
    ];

    constructor(pos: Vec2, dimensions: Size, angle: number = 0, world?: World) {
        this.initialPosition = pixelsToMetters(pos);
        this.initialAngle = angle;
        this.dimensions = dimensions;
        
        world = world ? world : new World()
        
        this.entity = world.createKinematicBody({
            position: this.initialPosition,
            angle: this.initialAngle
        });

        this.entity.createFixture({
            shape: Box(
                (this.dimensions.width / PPM) / 2., 
                (this.dimensions.height / PPM) / 2.
            ),
            friction: 20
        });
    }

    init(world: World) {
        this.entity = world.createKinematicBody({
            position: this.initialPosition,
            angle: this.initialAngle
        });

        this.entity.createFixture({
            shape: Box(
                (this.dimensions.width / PPM) / 2., 
                (this.dimensions.height / PPM) / 2.
            ),
            friction: 20
        }); 
    }

    draw(p5: P5, texture?: P5.Image) {
        if (this.hidden) return;
        p5.push();
        if (texture) { p5.texture(texture); }

        const position = mettersToPixels(this.entity.getPosition())
        p5.translate(position.x, position.y);
        p5.rotate(this.entity.getAngle());
        p5.rectMode(p5.CENTER);
        p5.rect(0, 0, this.dimensions.width, this.dimensions.height);

        p5.pop();
    }

    getPosition = () => {
        return mettersToPixels(this.entity.getPosition());
    }

    translate(position: Vec2, angle: number) {
        this.entity.setTransform(pixelsToMetters(position), angle);
    }
}