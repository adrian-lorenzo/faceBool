import { IpcRenderer, Remote } from "electron";
import P5 from "p5";
import { Vec2 } from "planck-js";
import level1Builder from "../bootstrap/level1";
import level2Builder from "../bootstrap/level2";
import level3Builder from "../bootstrap/level3";
import { PlayerAction } from "../models/PlayerAction";
import FaceDetectionService from "../services/FaceDetectionService";
import { relHeight, relWidth } from "../utils/uiUtils";
import { Loader } from "./Loader";
import { PauseMenu } from "./PauseMenu";
import { DieScreen, GameStates, MainScreen, TutorialScreen, WinScreen } from "./Screen";
import { Sound } from "./Sound";

declare global {
    interface Window {
        require: (module: 'electron') => {
            ipcRenderer: IpcRenderer
            remote: Remote
        };
    }
}

const { ipcRenderer, remote } = window.require('electron');

const Sketch = (p5: P5) => {
    // MARK: - Face detection constants

    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let isDetecting = false;
    let hasEverythingLoaded = false;
    let shader;
    let shaderTexture;
    let time = 0;
    let timePaused = 0;

    const maxTime = 60 * 1000;
    const platformTexture = p5.loadImage('textures/platform_texture.jpg');
    const ballTexture = p5.loadImage('textures/basketball.jpg');
    const font = p5.loadFont('fonts/Roboto-Regular.ttf');
    const fontTitle = p5.loadFont('fonts/Dark_Seed.otf');
    const loader = new Loader(Vec2(relWidth(0), relHeight(0.9)), font);
    const pauseMenu = new PauseMenu(Vec2(relWidth(0.5), relHeight(0.5)), fontTitle);

    let levelBuildersIdx = 0;
    let levelBuilders = [level1Builder, level2Builder, level3Builder];
    let currentLevel = levelBuilders[levelBuildersIdx]();

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
    let tutorial: TutorialScreen;


    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1), p5.WEBGL);

        state = GameStates.MENU;
        menu = new MainScreen(fontTitle, p5.loadImage('textures/baloncesto.png'));
        dieScreen = new DieScreen(fontTitle, p5.loadImage('textures/death.png'));
        winScreen = new WinScreen(fontTitle, p5.loadImage('textures/win.png'));
        tutorial = new TutorialScreen(fontTitle, font);
        sound = new Sound();

        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        p5.frameRate(currentFrameRate);
        p5.tint(55, 100);

        faceDetectionService.loadModel();
        setTimeout(() => {
            currentLevel.hasStarted = true;
            hasEverythingLoaded = true;
            // time = Date.now();
            p5.tint(255, 255);
        }, 4000);
    }

    p5.draw = () => {
        // Environment
        if (state === GameStates.MENU) {
            sound.playMenuMusic();
            menu.draw(p5);
        } else if (state === GameStates.GAME) {
            p5.translate(-p5.width / 2, -p5.height / 2, 0);
            drawBackground();

            if (!hasEverythingLoaded) loader.draw(p5);
            runDetection();
            currentLevel.run(p5, ballTexture, platformTexture);
            sound.playGameMusic();
            drawTime();

            if (currentLevel.checkIfPLayerIsDead() || (Date.now() - time) > maxTime) {
                sound.stopGameMusic();
                sound.playLoseSound();
                state = GameStates.DIE;
                restartLevel();
            }
        } else if (state === GameStates.DIE) {
            dieScreen.draw(p5);
        } else if (state === GameStates.PAUSE) {
            p5.translate(-p5.width / 2, -p5.height / 2, 0);
            drawBackground();
            currentLevel.run(p5, ballTexture, platformTexture);
            pauseMenu.draw(p5);
        } else if (state === GameStates.WIN) {
            winScreen.draw(p5);
        } else if (state === GameStates.TUTORIAL) {
            tutorial.draw(p5);
        }
    }

    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(relWidth(1), relHeight(1));
    }


    p5.keyPressed = () => {
        if (state === GameStates.GAME) {
            if (p5.key === 'D' || p5.key === 'd') {
                currentLevel.actions.set(PlayerAction.MoveRight, true);
            }

            if (p5.key === 'A' || p5.key === 'a') {
                currentLevel.actions.set(PlayerAction.MoveLeft, true);
            }

            if (p5.key === 'W' || p5.key === 'w') {
                currentLevel.actions.set(PlayerAction.Jump, true);
            }

            if (p5.key === " ") {
                state = GameStates.PAUSE;
                sound.stopGameMusic();
                p5.tint(55, 100);
                timePaused = Date.now();
                currentLevel.isPaused = true;
            }
        }

        if (state === GameStates.PAUSE) {
            if (p5.key === 'Q' || p5.key === 'q') {
                restartLevel();
                state = GameStates.MENU;
            }

            if (p5.key === 'R' || p5.key === 'r') {
                restartLevel();
                state = GameStates.GAME;
                p5.tint(255, 255);
                timePaused = 0;
                currentLevel.isPaused = false;
            }

            if (p5.keyCode === p5.ESCAPE) {
                state = GameStates.GAME;
                p5.tint(255, 255);
                time += Date.now() - timePaused;
                timePaused = 0;
                currentLevel.isPaused = false;
            }
        }

        if (p5.keyCode === p5.ENTER) {
            if (state === GameStates.MENU) {
                if (menu.indexOption === 0) {
                    state = GameStates.TUTORIAL;
                } else {
                    levelBuildersIdx = menu.indexOption - 1;
                    currentLevel = levelBuilders[levelBuildersIdx]();
                    currentLevel.hasStarted = true;
                    time = Date.now();
                    state = GameStates.GAME;
                    sound.stopMenuMusic();
                }
            } else if (state === GameStates.TUTORIAL) {
                state = GameStates.MENU;
            }
        }

        if (p5.keyCode === p5.UP_ARROW && state === GameStates.MENU) {
            menu.changeOption(-1);
        }

        if (p5.keyCode === p5.DOWN_ARROW && state === GameStates.MENU) {
            menu.changeOption(1);
        }

        if (p5.keyCode === p5.ENTER && state === GameStates.WIN) {
            state = GameStates.MENU;
        }

        if ((p5.key === 'y' || p5.key === 'Y') && state === GameStates.DIE) {
            state = GameStates.GAME;
            dieScreen.resetCount();
            sound.stopLoseMusic();
        }

        if ((p5.key === 'n' || p5.key === 'N') && state === GameStates.DIE) {
            state = GameStates.MENU;
            dieScreen.resetCount();
            sound.stopLoseMusic();
        }

        if ((p5.key === 'p' || p5.key === 'P') && state === GameStates.GAME) {
            sound.pauseGameMusic();
        }
    }


    p5.keyReleased = () => {
        if (p5.key === 'D' || p5.key === 'd') {
            currentLevel.actions.set(PlayerAction.MoveRight, false);
        }

        if (p5.key === 'A' || p5.key === 'a') {
            currentLevel.actions.set(PlayerAction.MoveLeft, false);
        }

        if (p5.key === 'W' || p5.key === 'w') {
            currentLevel.actions.set(PlayerAction.Jump, false);
        }
    }

    function drawTime() {
        p5.push();
        p5.fill(255);
        p5.textSize(32);
        p5.text(`${((maxTime - (Date.now() - time)) / 1000).toFixed(0)}`, relWidth(1) - 100, 50, 50, 50);
        p5.pop();

    }

    function restartLevel() {
        currentLevel = levelBuilders[levelBuildersIdx]();
        currentLevel.hasStarted = true;
        time = Date.now();
    }

    function drawBackground() {
        p5.background(0);
        p5.push()
        p5.translate(relWidth(1), 0)
        p5.scale(-1.0, 1.0);
        if (shader && shaderTexture) {
            shader.setUniform('tex0', videoCapture);
            shader.setUniform('resolution', [relWidth(1), relHeight(1)]);
            shader.setUniform('current_time', timePaused > 0 ? 0 : Date.now() - time);
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
        if ((!isDetecting) && hasEverythingLoaded) {
            isDetecting = true;
            faceDetectionService.getFace(videoCapture.elt)
                .then(detection => {
                    if (detection) {
                        const scaleX = dimensions.width / faceDetectionService.imageDimension.width;
                        const scaleY = dimensions.height / faceDetectionService.imageDimension.height;
                        let leftEye = { x: detection[1][0] * scaleX, y: detection[1][1] * scaleY };
                        let rightEye = { x: detection[0][0] * scaleX, y: detection[0][1] * scaleY };
                        let position = Vec2((leftEye.x + rightEye.x) / 2., (leftEye.y + rightEye.y) / 2.);
                        let direction = Vec2(leftEye.x - rightEye.x, leftEye.y - rightEye.y);

                        currentLevel.playerState = {
                            position: position,
                            direction: direction
                        }
                        currentLevel.actions.set(PlayerAction.MovePlatform, true);
                    }
                })
                .finally(() => isDetecting = false)

        }
    }

}

export default Sketch;