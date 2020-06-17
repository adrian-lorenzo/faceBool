import P5 from "p5";
import level1 from "../bootstrap/level1";
import { PlayerAction } from "../models/PlayerAction";
import FaceDetectionService from "../services/FaceDetectionService";
import { relHeight, relWidth } from "../utils/uiUtils";
import { Loader } from "./Loader";


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
    const platformTexture = p5.loadImage('platform_texture.jpg');
    const ballTexture = p5.loadImage('basketball.jpg');
    const font = p5.loadFont('Roboto-Regular.ttf')
    const loader = new Loader({ x: relWidth(0), y: relHeight(0.9) }, font);

    let currentFrameRate = 60;

    p5.preload = () => {
        shader = p5.loadShader('shader.vert', 'shader.frag');
        shaderTexture = p5.createGraphics(relWidth(1), relHeight(1), p5.WEBGL);
        shaderTexture.noStroke();
    }

    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1), p5.WEBGL);
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
        p5.translate(-p5.width / 2, -p5.height / 2, 0);
        drawBackground();
        if (!hasEverythingLoaded) loader.draw(p5);
        runDetection();
        level1.run(p5, ballTexture, platformTexture);
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
                        let leftEye = { x: detection[1][0] * scaleX, y: detection[1][1] * scaleY };
                        let rightEye = { x: detection[0][0] * scaleX, y: detection[0][1] * scaleY };
                        let position = { x: (leftEye.x + rightEye.x) / 2., y: (leftEye.y + rightEye.y) / 2. }
                        let direction = { x: leftEye.x - rightEye.x, y: leftEye.y - rightEye.y };

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