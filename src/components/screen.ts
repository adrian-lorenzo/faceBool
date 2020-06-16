import { relWidth, relHeight } from "../utils/uiUtils";
import P5 from "p5";

export enum GameStates {
    MENU,
    GAME,
    DIE,
    WIN
}


interface Screen {
    drawScreen(p5: P5) 
}


export class MainScreen implements Screen{
    title:string;
    start:string;
    blink:number;
    font;
    img;
    constructor(font, p5:P5) {
        this.title = "FACE BOOL";
        this.start = "Intro to Start";
        this.font  = font;
        this.img   = p5.loadImage('baloncesto.png');
        this.blink = 0;
    }

    drawScreen(p5:P5) {
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


export class DieScreen implements Screen{
    constructor() {
        
    }

    drawScreen(p5:P5) {
        p5.background(255,255);
    }

    
}

export class WinScreen implements Screen{
    constructor() {
        
    }

    drawScreen(p5:P5) {
        p5.background(255,100,100);
    }

    
}