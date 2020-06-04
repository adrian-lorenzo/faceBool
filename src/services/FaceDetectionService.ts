import * as facemesh from '@tensorflow-models/facemesh';

export default class FaceDetectionService {
    model?: facemesh.FaceMesh;

    constructor() {
        this.loadModels();
    }

    async loadModels() {
        this.model = await facemesh.load();
    }

    async getFace(image: HTMLVideoElement) {
        return await this.model?.estimateFaces(image, false, true);
    }
}
