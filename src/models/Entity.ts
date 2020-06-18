import { Body, World } from "planck-js";
import Drawable from "./Drawable";

export default interface Entity extends Drawable {
    id: number
    entity: Body

    init: (world: World) => void
}