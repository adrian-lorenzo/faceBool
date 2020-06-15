import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

export default class FaceDetectionService {
    model?: blazeface.BlazeFaceModel

    async loadModel() {
        tf.setBackend("webgl");
        this.model = await blazeface.load({
            maxFaces: 1
        })
    }


    async getFace(image: HTMLVideoElement): Promise<number[][] | undefined> {
        if (image.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
            const face = await this.model?.estimateFaces(image, false, true);
            if (face && face.length > 0) {
                const value = face[0].landmarks;
                if (!value || value instanceof tf.Tensor) { return }
                return value as number[][]
            }

        }

        return 
    }
}