import P5 from "p5";
import { relHeight, relWidth } from "../utils/uiUtils";
import { Vec2 } from "planck-js";

export enum Orientation {
    LEFT,
    RIGHT
}

export default class Limit {
    limit: Vec2;
    orientation: Orientation;

    constructor(limit: Vec2, orientation: Orientation) {
        this.limit = limit;
        this.orientation = orientation;
    }

    draw(p5: P5) {
        p5.push();
        p5.strokeWeight(3);
        
        for (let i = relHeight(this.limit.y); i < relHeight(1); i += relHeight(0.05)){
            p5.line(relWidth(this.limit.x), i, relWidth(this.limit.x), i + relHeight(0.02));
        }

        p5.pop();
        p5.push();
        p5.translate(0, 0);
        p5.fill(255, 0, 0, 100);
        p5.noStroke();

        const width = relWidth(this.limit.x);
        const height = relHeight(this.limit.y);
        this.orientation === Orientation.LEFT ?
            p5.rect(0, height, width, relHeight(1)) :
            p5.rect(width, height, relWidth(1) - width, relHeight(1));

        p5.pop();
    }
}