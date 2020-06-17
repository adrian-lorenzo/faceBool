import { relWidth, relHeight } from "../utils/uiUtils";
import P5 from "p5";
import Drawable from "../models/Drawable";

export enum GameStates {
    MENU,
    GAME,
    DIE,
    WIN
}

export class MainScreen implements Drawable{
    title:string;
    start:string;
    blink:number;
    font;
    img;
    constructor(font, img) {
        this.title = "FACE BOOL";
        this.start = "Intro to Start";
        this.font  = font;
        this.img   = img
        this.blink = 0;
    }

    draw(p5:P5) {
        p5.textFont(this.font);
        p5.background( 60, 81, 185 );
        p5.image(this.img,relWidth(-0.15),relHeight(-0.1));
        p5.textSize(200);
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.title, relWidth(0),relHeight(-0.3));
        if(this.blink < 80){
            p5.textSize(50);
            p5.text(this.start, relWidth(0),relHeight(0.3));
        }
        this.blink++;
        if (this.blink > 200) {
            this.blink = 0;
        }
        p5.textSize(20);
        p5.text("2020. All Rights Reserved.", relWidth(0),relHeight(0.4));
    }

    
}


export class DieScreen implements Drawable{
    font;
    img;
    mesg:string;
    count:number;
    constructor(font, img) {
        this.img  = img;
        this.font = font;
        this.mesg = "GAME OVER";
        this.count = 0;
    }

    draw(p5:P5) {
        p5.textFont(this.font);
        p5.background(255, 66, 66);
        p5.image(this.img,relWidth(-0.13),relHeight(-0.45));
        p5.textSize(200);
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.mesg, relWidth(0),relHeight(0));
        p5.textSize(100);
        if(this.count < 300){
            this.count++;
            return;
        }
        p5.text("Play Again?", relWidth(0),relHeight(0.1));
        p5.text("YES [Y]", relWidth(-0.3),relHeight(0.3));
        p5.text("NO [N]", relWidth(0.3),relHeight(0.3));
    }

    resetCount(){
        this.count = 0;
    }

    
}

export class WinScreen implements Drawable{
    font;
    img;
    mesg:string;
    back:string;
    blink:number;
    constructor(font, img) {
        this.img  = img;
        this.font = font;
        this.mesg = "YOU WIN";
        this.back = "Intro to Back to Menu"
        this.blink = 0;
    }

    draw(p5:P5) {
        p5.background(157, 236, 241);
        p5.textFont(this.font);
        p5.image(this.img,relWidth(-0.25),relHeight(-0.45));
        p5.textSize(100);
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.mesg, relWidth(0),relHeight(0.3));
        p5.textSize(100);
        if(this.blink < 80){
            p5.textSize(50);
            p5.text(this.back, relWidth(0),relHeight(0.4));
        }
        this.blink++;
        if (this.blink > 200) {
            this.blink = 0;
        }
    }

    
}