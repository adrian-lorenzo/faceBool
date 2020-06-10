import { FaceDetection, FaceLandmarks68, WithFaceLandmarks } from "face-api.js";
import P5 from "p5";
import FaceDetectionService from "../services/FaceDetectionService";
import { relWidth, relHeight } from "../utils/uiUtils";
import level1 from "../bootstrap/level1";
import { PlayerAction } from "../models/PlayerAction";
import { Sound } from "./Sound";


const Sketch = (p5: P5) => {
    // MARK: - Face detection constants
    
    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let detection: WithFaceLandmarks<{ detection: FaceDetection; }, FaceLandmarks68> | undefined;
    let isDetecting = true;
    const platformTexture = p5.loadImage('platform_texture.jpg');
    const ballTexture = p5.loadImage('basketball.jpg');


    let currentFrameRate = 30;
    let loadStatus = 0;
    let nav = <any>navigator;
    nav.getUserMedia  = nav.getUserMedia || nav.webkitGetUserMedia
         || nav.mozGetUserMedia || nav.msGetUserMedia;

    p5.setup = () => {
        // Canvas setup
        p5.createCanvas(relWidth(1), relHeight(1), p5.WEBGL);
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
        
        faceDetectionService.loadModels();
    }

    p5.draw = () => {
        // Environment
        p5.translate(-p5.width / 2, -p5.height / 2, 0);
        drawBackground();
        if (loadStatus < 4000) drawLoader();
        //getVolumenMicro();
        runDetection();
        level1.run(p5, ballTexture, platformTexture);
    }

    function getVolumenMicro() {
        if (nav.getUserMedia) {
            nav.getUserMedia({
                audio: true
                },
                function(stream) {
                    let audioContext = new AudioContext();
                    let analyser = audioContext.createAnalyser();
                    let microphone = audioContext.createMediaStreamSource(stream);
                    let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                    analyser.smoothingTimeConstant = 0.8;
                    analyser.fftSize = 1024;

                    microphone.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);


                    javascriptNode.onaudioprocess = function() {
                        var array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        var values = 0;

                        var length = array.length;
                        for (var i = 0; i < length; i++) {
                            values += (array[i]);
                        }

                        var average = values / length;

                        console.log(Math.round(average - 40));

                    } // end fn stream
                },
                function(err) {
                    console.log("The following error occured: " + err.name)
                });
        } else {
            console.log("getUserMedia not supported");
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

    function drawLoader() {
        p5.rect(relWidth(0.05), relHeight(0.9), relWidth(0.25), relHeight(0.05));;
        p5.fill(0, 255, 0);
        p5.rect(relWidth(0.051), relHeight(0.901), relWidth(loadStatus * 0.25 / 4000), relHeight(0.049));
        p5.fill(0);
        p5.textSize(relWidth(0.025));
        p5.text("Cargando...", relWidth(0.12), relHeight(0.94));
        p5.fill(255);
    }

}

export default Sketch;