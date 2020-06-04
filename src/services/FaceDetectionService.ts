import * as facemesh from '@tensorflow-models/facemesh';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Size } from '../models/Size';

export default class FaceDetectionService {
    model?: facemesh.FaceMesh;
    imageSize: Size = { width: 640, height: 500 }

    constructor() {
        tf.setBackend("webgl");
        this.loadModels();
    }

    async loadModels() {
        this.model = await facemesh.load({maxFaces: 1, })
    }

    async getFace(image: HTMLVideoElement): Promise<[number, number, number][] | undefined> {
        if (image.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
            const face = await this.model?.estimateFaces(image, false, true);
            if (face && face.length > 0) {
                const value = face[0].scaledMesh;
                if (value instanceof tf.Tensor) { return }
                return value
            }

        }

        return 
    }
}
