import P5 from "p5";
import { relHeight, relWidth } from "../utils/uiUtils";

export enum Orientation {
    LEFT,
    RIGHT
}

export default class Limit {
    limit: number;
    orientation: Orientation;

    constructor(limit: number, orientation: Orientation) {
        this.limit = limit;
        this.orientation = orientation;
    }

    draw(p5: P5) {
        p5.push();
        p5.strokeWeight(3);
        
        for (let i = relHeight(0); i < relHeight(1); i += relHeight(0.05)){
            p5.line(relWidth(this.limit), i, relWidth(this.limit), i + relHeight(0.02));
        }

        p5.pop();
        p5.push();
        p5.translate(0, 0);
        p5.fill(255, 0, 0, 100);
        p5.noStroke();

        const width = relWidth(this.limit)
        this.orientation === Orientation.LEFT ?
            p5.rect(0, 0, width, relHeight(1)) :
            p5.rect(width, 0, relWidth(1) - width, relHeight(1));

        p5.pop();
    }
}