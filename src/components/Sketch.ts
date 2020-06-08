import { FaceDetection, FaceLandmarks68, WithFaceLandmarks } from "face-api.js";
import P5 from "p5";
import FaceDetectionService from "../services/FaceDetectionService";
import { relWidth, relHeight } from "../utils/uiUtils";
import { Sound } from "./Sound";
import level1 from "../bootstrap/level1";
import { PlayerAction } from "../models/PlayerAction";

const Sketch = (p5: P5) => {
    // MARK: - Face detection constants
    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let detection: WithFaceLandmarks<{ detection: FaceDetection; }, FaceLandmarks68> | undefined;
    let isDetecting = true;
    let currentFrameRate = 30;
    let loadStatus = 0;
    let leftLimit = 0.2;
    let rightLimit = 0.8;

    // Sound
    let sound:Sound = new Sound();

    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1));
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();

        p5.frameRate(currentFrameRate);
        p5.tint(55, 100);

        faceDetectionService.loadModels();

        setTimeout(() => {
            isDetecting = false;
            p5.tint(255, 255);
            level1.hasStarted = true;
        }, 4000);

        let increaseLoadingBar = setInterval(() => {
            loadStatus += 100;
            if (loadStatus >= 4000) clearInterval(increaseLoadingBar);
        }, 100);
    }

    p5.draw = () => {
        // Environment
        drawBackground();
        if (loadStatus < 4000) drawLoader();
        runDetection();
        level1.run(p5);
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
            sound.playJumpSound();
            level1.actions.set(PlayerAction.Jump, false);
        }
    }

    function drawBackground() {
        p5.background(0);
        p5.push()
        p5.translate(relWidth(1), 0)
        p5.scale(-1.0, 1.0);
        p5.image(videoCapture, 0, 0, relWidth(1), relHeight(1));
        p5.pop();
    }

    function runDetection() {
        if (!isDetecting) {
            isDetecting = true;
            faceDetectionService.getFace(videoCapture.elt, dimensions)
                .then(res => detection = res)
                .finally(() => isDetecting = false);
        }

        if (detection) {
            const points = detection.landmarks.positions;
            const position = points[28];


            let leftEye = points[37].add(points[40]).div({ x: 2, y: 2 });
            let rightEye = points[46].add(points[43]).div({ x: 2, y: 2 });
            let direction = leftEye.sub(rightEye);
        
            level1.playerState = {
                position: position, 
                direction: direction 
            }
            level1.actions.set(PlayerAction.MovePlatform, true);
        }
    }

    function drawLoader(){
        p5.rect(relWidth(0.05), relHeight(0.9), relWidth(0.25), relHeight(0.05));
        p5.fill(0, 255, 0);
        p5.rect(relWidth(0.051), relHeight(0.901), relWidth(loadStatus*0.25/4000), relHeight(0.049))
        p5.fill(0);
        p5.textSize(relWidth(0.025));
        p5.text("Cargando...", relWidth(0.12), relHeight(0.94));
        p5.fill(255);
    }
}

export default Sketch;