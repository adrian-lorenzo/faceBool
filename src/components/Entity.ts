import P5 from "p5";

export default interface Entity {
    id: number
    entity: Matter.Body

    draw: (p5: P5) => void
}