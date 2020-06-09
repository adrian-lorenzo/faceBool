import { Vector } from "matter-js";

export enum PlayerAction {
    Jump,
    MoveLeft,
    MoveRight,
    MovePlatform,
    TranslateStage,
    AtLastPlatform
}

export default interface PlayerState {
    position: Vector
    direction: Vector
}
