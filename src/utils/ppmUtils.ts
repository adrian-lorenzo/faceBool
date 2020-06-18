import { Vec2 } from "planck-js"
import { PPM } from "./constants"

export const pixelsToMetters = (vector: Vec2) => {
    return Vec2(vector.x / PPM, vector.y / PPM);
}

export const mettersToPixels = (vector: Vec2) => {
    return Vec2(vector.x * PPM, vector.y * PPM);
}