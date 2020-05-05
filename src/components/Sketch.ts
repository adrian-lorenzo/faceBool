import P5 from "p5";
import { FaceDetection, WithFaceLandmarks, FaceLandmarks68 } from "face-api.js";
import FaceDetectionService from "../services/FaceDetectionService";

const Sketch = (p5: P5) => {
    const faceDetectionService = new FaceDetectionService();
    let videoCapture: P5.Element;
    let dimensions = { width: window.innerWidth, height: window.innerHeight };

    p5.setup = () => {
        p5.createCanvas(dimensions.width, dimensions.height);
        p5.background("black");
        videoCapture = p5.createCapture(p5.VIDEO);
        videoCapture.hide();
    }

    p5.draw = () => {
        p5.image(videoCapture, 0, 0, dimensions.width, dimensions.height);
        faceDetectionService.getFace(videoCapture.elt, dimensions).then((detection) => {
            if (detection) {
                drawBoundingBox(detection);
            }
        });
    }

    p5.windowResized = () => {
        dimensions = { width: window.innerWidth, height: window.innerHeight };
        p5.resizeCanvas(dimensions.width, dimensions.height);
    }

    const drawBoundingBox = (detection: WithFaceLandmarks<{detection: FaceDetection;}, FaceLandmarks68>) => {
        let points = detection.landmarks.positions;
        
        for (let i = 0; i < points.length; i++) {
            p5.stroke(255, 0, 0);
            p5.strokeWeight(10);
            p5.point(points[i].x, points[i].y);
        }

        let box = detection.alignedRect.box;

        p5.noFill();
        p5.rect(box.x, box.y, box.width, box.height);
    }
}

export default Sketch;