import Drawable from "../models/Drawable";
import P5 from "p5";
import { relWidth, relHeight } from "../utils/uiUtils";
import { Vec2 } from "planck-js";

export class PauseMenu implements Drawable {
    position: Vec2;
    font: P5.Font;

    menuTitle = "PAUSE"
    restartText = "[R] - Restart level";
    quitText = "[Q] - Quit game";
    resumeText = "[ESCAPE] - Resume game"

    constructor(position: Vec2, font: P5.Font) {
        this.position = position;
        this.font = font;
    }

    draw = (p5: P5, texture?: P5.Image | undefined) => {
        p5.push();
        
        p5.rectMode(p5.CENTER);
        p5.fill( 60, 81, 185 );
        p5.rect(this.position.x, this.position.y, relWidth(0.5), relHeight(0.4));

        p5.textSize(relWidth(0.055));
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        let y = this.position.y - relHeight(0.15);
        p5.text(this.menuTitle, this.position.x, y);

        p5.textSize(relWidth(0.030));
        y += relHeight(0.1);
        p5.text(this.resumeText, this.position.x, relHeight(0.45));
        y += relHeight(0.1);
        p5.text(this.restartText, this.position.x, relHeight(0.55));
        y += relHeight(0.1);
        p5.text(this.quitText, this.position.x, relHeight(0.65));

        p5.pop();
    }
}