import P5 from "p5";

export default interface Drawable {
    draw: (p5: P5, texture?: P5.Image) => void
}