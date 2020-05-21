//import * as canvasz from 'canvas';

import { nets, detectSingleFace, TNetInput, resizeResults, IDimensions, Point } from "face-api.js"; // env, TResolvedNetInput, tf, Box } 

export default class FaceDetectionService {
    constructor() {
        //env.monkeyPatch(canvasz as any);
        nets.ssdMobilenetv1.loadFromUri('/models');
        nets.faceLandmark68Net.loadFromUri('/models');
    } 

    async getFace(input: TNetInput, dimensions: IDimensions) {
        let detection = await detectSingleFace(input).withFaceLandmarks();

        if (detection) {
            const origin = new Point(dimensions.width/2, dimensions.height/2);
            detection = resizeResults(detection, { width: dimensions.width, height: dimensions.height });
            for (let index = 0; index < detection.landmarks.positions.length; index++) {
                detection.landmarks.positions[index] = flipPoint(detection.landmarks.positions[index], origin);
            }
            return detection
        }

        return
    }
}

function flipPoint(vector: Point, origin: Point): Point{
    vector = vector.sub(origin);
    vector = vector.mul({x: -1, y: 1});
    return vector.add(origin);
}
