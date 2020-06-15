import P5 from "p5";
import Drawable from "./Drawable";

export default interface Entity extends Drawable {
    id: number
    entity: Matter.Body
}