// eslint-disable-next-line
import { detectSingleFace, env, IDimensions, nets, Point, resizeResults, TNetInput } from "face-api.js";


export default class FaceDetectionService {
    constructor() {
        env.monkeyPatch({
            Canvas: HTMLCanvasElement,
            Image: HTMLImageElement,
            ImageData: ImageData,
            Video: HTMLVideoElement,
            createCanvasElement: () => document.createElement('canvas'),
            createImageElement: () => document.createElement('img')
        })
        nets.ssdMobilenetv1.loadFromUri('/models');
        nets.faceLandmark68Net.loadFromUri('/models');
    }

    async getFace(input: TNetInput, dimensions: IDimensions): Promise<any | any> {
        let detection = await detectSingleFace(input).withFaceLandmarks().run();
        if (detection) {
            const origin = new Point(dimensions.width / 2, dimensions.height / 2);
            detection = resizeResults(detection, { width: dimensions.width, height: dimensions.height });
            for (let index = 0; index < detection.landmarks.positions.length; index++) {
                detection.landmarks.positions[index] = flipPoint(detection.landmarks.positions[index], origin);
            }
            return detection
        }

        return
    }
}

function flipPoint(vector: Point, origin: Point): Point {
    vector = vector.sub(origin);
    vector = vector.mul({ x: -1, y: 1 });
    return vector.add(origin);
}
