import P5 from "p5";
import Drawable from "../models/Drawable";
import { relHeight, relWidth } from "../utils/uiUtils";

export enum GameStates {
    MENU,
    PAUSE,
    GAME,
    DIE,
    WIN,
    TUTORIAL,
    MICSETUP
}

export class MainScreen implements Drawable {
    title: string;
    listOptions: Array<string>;
    blink: number;
    msg: string;
    indexOption: number;
    font;
    img;
    constructor(font, img) {
        this.title = "FACE BOOL";
        this.listOptions = ["TUTORIAL", "PLAY LEVEL 1", "PLAY LEVEL 2", "PLAY LEVEL 3", "RECALIBRATE MIC", "EXIT"]
        this.msg = "> INTRO TO ";
        this.indexOption = 0;
        this.font = font;
        this.img = img
        this.blink = 0;
    }

    draw(p5: P5) {
        p5.textFont(this.font);
        p5.background(60, 81, 185);
        p5.textSize(relWidth(0.15));
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.title, relWidth(-0.05), relHeight(-0.3));
        p5.image(this.img, relWidth(0.25), relHeight(-0.42));
        p5.textSize(relWidth(0.05));
        let size = -0.1;
        for (let index = 0; index < this.listOptions.length; index++) {
            if (index === this.indexOption) {
                if (this.blink < 80) p5.text(this.msg + this.listOptions[index], relWidth(0), relHeight(size));
            } else {
                p5.text(this.listOptions[index], relWidth(0), relHeight(size));
            }
            size += 0.1;

        }
        this.blink++;
        if (this.blink > 100) {
            this.blink = 0;
        }
        p5.textSize(relWidth(0.025));
        p5.text("2020. All Rights Reserved.", relWidth(0), relHeight(0.45));
    }

    changeOption(position: number) {
        if (this.indexOption + position < 0) {
            this.indexOption = this.listOptions.length - 1;
            this.blink = 0;
            return;
        }
        this.indexOption = (this.indexOption + position) % this.listOptions.length
        this.blink = 0;
    }


}

export class TutorialScreen implements Drawable {
    msg1: string;
    msg2: string;
    msg3: string;
    msg4: string;
    msg5: string;
    title: string;
    back: string;
    blink: number;

    fontTitle;
    font;

    constructor(fonttitle, font) {
        this.font = font;
        this.fontTitle = fonttitle;
        this.msg1 = "1. Stand in front of the camera.";
        this.msg2 = "2. A platform will be created in front of you.";
        this.msg3 = "3. Use the platform and you head to catch the ball or push it.";
        this.msg4 = "4. With the microphone you can make the ball jump by shouting or blowing."
        this.msg5 = "5. With the ESCAPE you can pause the game"
        this.title = "How to Play?"
        this.back = "Intro to back to menu"
        this.blink = 0
    }

    draw(p5: P5) {
        p5.background(60, 81, 185);
        p5.fill(0);
        p5.textAlign(p5.CENTER);

        p5.textFont(this.fontTitle);
        p5.textSize(relWidth(0.05));
        p5.text(this.title, relWidth(0), relHeight(-0.3));

        p5.textFont(this.font);
        p5.textSize(relWidth(0.027));
        p5.text(this.msg1, relWidth(0), relHeight(-0.2));
        p5.text(this.msg2, relWidth(0), relHeight(-0.1));
        p5.text(this.msg3, relWidth(0), relHeight(0));
        p5.text(this.msg4, relWidth(0), relHeight(0.1));
        p5.text(this.msg5, relWidth(0), relHeight(0.2));

        p5.fill(0);
        p5.textFont(this.fontTitle);
        if (this.blink < 80) {
            p5.textSize(relWidth(0.05));
            p5.text(this.back, relWidth(0), relHeight(0.4));
        }
        this.blink++;
        if (this.blink > 200) {
            this.blink = 0;
        }


    }
}


export class DieScreen implements Drawable {
    font;
    img;
    mesg: string;
    count: number;
    constructor(font, img) {
        this.img = img;
        this.font = font;
        this.mesg = "GAME OVER";
        this.count = 0;
    }

    draw(p5: P5) {
        p5.textFont(this.font);
        p5.background(255, 66, 66);
        p5.image(this.img, relWidth(-0.15), relHeight(-0.45));
        p5.textSize(relWidth(0.15));
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.mesg, relWidth(0), relHeight(0));
        p5.textSize(relWidth(0.1));
        if (this.count < 300) {
            this.count++;
            return;
        }
        p5.text("Play Again?", relWidth(0), relHeight(0.1));
        p5.text("YES [Y]", relWidth(-0.3), relHeight(0.3));
        p5.text("NO [N]", relWidth(0.3), relHeight(0.3));
    }

    resetCount() {
        this.count = 0;
    }


}

export class WinScreen implements Drawable {
    font;
    img;
    mesg: string;
    back: string;
    blink: number;
    constructor(font, img) {
        this.img = img;
        this.font = font;
        this.mesg = "YOU WIN";
        this.back = "Intro to Back to Menu";
        this.blink = 0;
    }

    draw(p5: P5) {
        p5.background(157, 236, 241);
        p5.textFont(this.font);
        p5.image(this.img, relWidth(-0.15), relHeight(-0.45));
        p5.textSize(relWidth(0.10));
        p5.textAlign(p5.CENTER);
        p5.fill(0);
        p5.text(this.mesg, relWidth(0), relHeight(0.2));
        p5.textSize(relWidth(0.05));
        if (this.blink < 80) {
            p5.text(this.back, relWidth(0), relHeight(0.4));
        }
        this.blink++;
        if (this.blink > 200) {
            this.blink = 0;
        }
    }


}
export class MicSetupScreen implements Drawable {
    font;
    img;
    mesg: string;
    back: string;
    blink: number;
    time: number = 0;
    recording = false;
    RECORDING_TIME = 3 * 1000;
    onRecordingFinished?: () => void;


    constructor(font, img) {
        this.img = img;
        this.font = font;
        this.mesg = "Mic Calibration";
        this.back = "Press Intro to Start Calibration";
        this.blink = 0;
    }

    draw(p5: P5) {

        if (this.recording) {
            const timeSpent = this.RECORDING_TIME / 1000 - Math.round((Date.now() - this.time) / 1000);
            if (timeSpent <= 0) {
                this.stopRecording();
            }
            p5.background(255);
            p5.textFont(this.font);
            p5.textSize(relWidth(0.5));
            p5.text(`${timeSpent}`, relWidth(0), relHeight(0));
            p5.textSize(relWidth(0.15));
            p5.textAlign(p5.CENTER);
            p5.fill(0);
            p5.text("RECORDING...", relWidth(0), relHeight(0.3));
            p5.textSize(relWidth(0.05));
            p5.text("Make a continuous sound like \"AAAH\"", relWidth(0), relHeight(0.4));
        } else {
            p5.background(255);
            p5.textFont(this.font);
            p5.image(this.img, relWidth(-0.25), relHeight(-0.45), relWidth(0.5), relHeight(0.5));
            p5.textSize(relWidth(0.15));
            p5.textAlign(p5.CENTER);
            p5.fill(0);
            p5.text(this.mesg, relWidth(0), relHeight(0.3));
            p5.textSize(relWidth(0.05));
            p5.text(this.back, relWidth(0), relHeight(0.4));
        }
    }

    startRecording(onRecordingFinished: () => void) {
        this.onRecordingFinished = onRecordingFinished;
        this.time = Date.now();
        this.recording = true;
    }

    stopRecording() {
        this.time = 0;
        this.recording = false;
        if (this.onRecordingFinished) this.onRecordingFinished()
    }


}