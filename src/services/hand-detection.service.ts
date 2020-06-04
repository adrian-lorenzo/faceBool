import * as handtrack from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

export default class HandDetectionService {
    model?: handtrack.HandPose;


    constructor() {
        this.loadModels();
    }

    async loadModels() {
        this.model = await handtrack.load();
    }

    async getHand(image: HTMLVideoElement) {
        const hand = await this.model?.estimateHands(image, true);
        if (hand && hand.length > 0) {
            return hand[0].annotations;
        } else {
            return;
        }
    }
}
