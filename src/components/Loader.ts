import { HALF_PI, TWO_PI } from "../utils/constants";
import Drawable from "../models/Drawable";
import P5 from "p5";
import { relWidth } from "../utils/uiUtils";
import { Vec2 } from "planck-js";

export class Loader implements Drawable {
    position: Vec2;
    font: P5.Font;

    private t = 0;
    private colors = ['red', 'blue', 'yellow', 'green'];
    private tickDelta = HALF_PI/64;

    constructor(position: Vec2, font: P5.Font) {
        this.position = position;
        this.font = font;
    }

    tick() {
        this.t += this.tickDelta;
        if (this.t >= TWO_PI) {
          this.t = 0;
        }
    }

    draw = (p5: P5, texture?: P5.Image | undefined) => {
        const circleSize = relWidth(0.02);
        const position = { x: this.position.x + circleSize, y: this.position.y + circleSize }
        const padding = (5*circleSize/4);
        let rad = this.t;

        p5.push();
        p5.fill(255, 255, 255);
        p5.rect(this.position.x, this.position.y, relWidth(0.13), relWidth(0.17));
        
        this.colors.forEach(color => {
            p5.fill(color);
            p5.circle(position.x, position.y, circleSize * p5.sin(rad));
            position.x += padding;
            rad += p5.QUARTER_PI;
        });

        p5.fill('black');
        p5.textFont(this.font);
        p5.textSize(relWidth(0.015));
        p5.text("¡Cargando!", this.position.x + 2 * padding, this.position.y + (circleSize * 3));
        this.tick();
        p5.pop();
    }
}