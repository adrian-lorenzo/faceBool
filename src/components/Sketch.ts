import P5 from "p5";
import level1 from "../bootstrap/level1";
import { PlayerAction } from "../models/PlayerAction";
import FaceDetectionService from "../services/FaceDetectionService";
import { relHeight, relWidth } from "../utils/uiUtils";
import { Loader } from "./Loader";
import { GameStates, MainScreen, DieScreen, WinScreen } from "./Screen";
import { Sound } from "./Sound";
import { Vec2 } from "planck-js";


const Sketch = (p5: P5) => {
    // MARK: - Face detection constants

    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let isDetecting = true;
    let hasEverythingLoaded = false;
    let shader;
    let shaderTexture;
    let time = 0;
    const maxTime = 60 * 1000;
    const platformTexture = p5.loadImage('textures/platform_texture.jpg');
    const ballTexture = p5.loadImage('textures/basketball.jpg');
    const font = p5.loadFont('fonts/Roboto-Regular.ttf');
    const fontTitle = p5.loadFont('fonts/Dark_Seed.otf');
    const loader = new Loader(Vec2(relWidth(0), relHeight(0.9)), font);

    let currentFrameRate = 60;
    let sound: Sound;

    p5.preload = () => {
        shader = p5.loadShader('shader.vert', 'shader.frag');
        shaderTexture = p5.createGraphics(relWidth(1), relHeight(1), p5.WEBGL);
        shaderTexture.noStroke();
    }

    let state: GameStates;
    let menu: MainScreen;
    let dieScreen: DieScreen;
    let winScreen: WinScreen;


    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1), p5.WEBGL);

        state = GameStates.MENU;
        menu  = new MainScreen(fontTitle, p5.loadImage('textures/baloncesto.png'));
        dieScreen = new DieScreen(fontTitle, p5.loadImage('textures/death.png'));
        winScreen = new WinScreen(fontTitle, p5.loadImage('textures/win.png'));
        sound = new Sound();

        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        p5.frameRate(currentFrameRate);
        p5.tint(55, 100);

        faceDetectionService.loadModel()
        setTimeout(() => {
            isDetecting = false;
            level1.hasStarted = true;
            hasEverythingLoaded = true;
            time = Date.now();
            p5.tint(255, 255);
        }, 4000);
    }

    p5.draw = () => {
        // Environment
        if(state === GameStates.MENU){
            menu.draw(p5);
        } else if (state === GameStates.GAME){
            p5.translate(-p5.width / 2, -p5.height / 2, 0);
            drawBackground();
            if (!hasEverythingLoaded) loader.draw(p5);
            runDetection();
            level1.run(p5, ballTexture, platformTexture);
            if(level1.checkIfPLayerIsDeath()){
                sound.playLoseSound();
                state = GameStates.DIE;
                level1.reset();
            }
        } else if (state === GameStates.DIE){
            dieScreen.draw(p5);
        } else if (state === GameStates.WIN){
            winScreen.draw(p5);
        }
    }

    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(relWidth(1), relHeight(1));
    }


    p5.keyPressed = () => {
        if (p5.key === 'D' || p5.key === 'd') {
            level1.actions.set(PlayerAction.MoveRight, true);
        }

        if (p5.key === 'A' || p5.key === 'a') {
            level1.actions.set(PlayerAction.MoveLeft, true);
        }

        if (p5.key === 'W' || p5.key === 'w') {
            level1.actions.set(PlayerAction.Jump, true);
        }

        if ( p5.keyCode === p5.ENTER && state === GameStates.MENU) {
            state = GameStates.GAME;
        }

        if ( p5.keyCode === p5.ENTER && state === GameStates.WIN) {
            state = GameStates.MENU;
        }

        if ( (p5.key === 'y' || p5.key === 'Y') && state === GameStates.DIE) {
            state = GameStates.GAME;
            dieScreen.resetCount();
        }

        if ( (p5.key === 'n' || p5.key === 'N') && state === GameStates.DIE) {
            state = GameStates.MENU;
            dieScreen.resetCount();
        }
    }


    p5.keyReleased = () => {
        if (p5.key === 'D' || p5.key === 'd') {
            level1.actions.set(PlayerAction.MoveRight, false);
        }

        if (p5.key === 'A' || p5.key === 'a') {
            level1.actions.set(PlayerAction.MoveLeft, false);
        }

        if (p5.key === 'W' || p5.key === 'w') {
            level1.actions.set(PlayerAction.Jump, false);
        }
    }

    function drawBackground() {
        p5.background(0);
        p5.push()
        p5.translate(relWidth(1), 0)
        p5.scale(-1.0, 1.0);
        if (shader && shaderTexture) {
            shader.setUniform('tex0', videoCapture);
            shader.setUniform('resolution', [relWidth(1), relHeight(1)]);
            shader.setUniform('current_time', Date.now() - time);
            shader.setUniform('max_time', maxTime);
            shaderTexture.shader(shader);
            shaderTexture.rect(0, 0, relWidth(1), relHeight(1));
            p5.image(shaderTexture, 0, 0, relWidth(1), relHeight(1));
        } else {
            p5.image(videoCapture, 0, 0, relWidth(1), relHeight(1));
        }
        p5.pop();
    }

    function runDetection() {
        if (!isDetecting) {
            isDetecting = true;
            faceDetectionService.getFace(videoCapture.elt)
                .then(detection => {
                    if (detection) {
                        const scaleX = dimensions.width / 600.;
                        const scaleY = dimensions.height / 480.;
                        let leftEye = { x: detection[1][0] * scaleX, y: detection[1][1] * scaleY};
                        let rightEye = { x: detection[0][0] * scaleX, y: detection[0][1] * scaleY};
                        let position = Vec2((leftEye.x + rightEye.x) / 2., (leftEye.y + rightEye.y) / 2.);
                        let direction = Vec2(leftEye.x - rightEye.x, leftEye.y - rightEye.y);

                        level1.playerState = {
                            position: position,
                            direction: direction
                        }
                        level1.actions.set(PlayerAction.MovePlatform, true);
                    }
                })
                .finally(() => isDetecting = false)

        }
    }

}

export default Sketch;