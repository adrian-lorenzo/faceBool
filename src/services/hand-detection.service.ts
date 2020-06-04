import * as handtrack from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Size } from '../models/Size';

export default class HandDetectionService {
    model?: handtrack.HandPose;
    imageSize: Size = { width: 640, height: 500 }


    constructor() {
        this.loadModels();
    }

    async loadModels() {
        tf.setBackend("webgl");
        this.model = await handtrack.load();
    }

    async getHand(image: HTMLVideoElement) {
        if (image.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
            const hand = await this.model?.estimateHands(image, true);
            if (hand && hand.length > 0) {
                return hand[0].annotations;
            }
        }

        return;
    }
}
