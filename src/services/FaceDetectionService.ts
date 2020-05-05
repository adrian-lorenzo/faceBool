import { nets, detectSingleFace, TNetInput, resizeResults, IDimensions } from "face-api.js";

export default class FaceDetectionService {
    constructor() {
        nets.ssdMobilenetv1.loadFromUri('/models');
        nets.faceLandmark68Net.loadFromUri('/models');
    } 

    async getFace(input: TNetInput, dimensions: IDimensions) {
        let detection = await detectSingleFace(input).withFaceLandmarks();

        if (detection) {
            detection = resizeResults(detection, { width: dimensions.width, height: dimensions.height });
            return detection
        }

        return
    }
}
