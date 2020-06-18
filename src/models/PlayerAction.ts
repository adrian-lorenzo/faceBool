import { Vec2 } from "planck-js";

export enum PlayerAction {
    Jump,
    MoveLeft,
    MoveRight,
    MovePlatform,
    TranslateStage,
    AtLastPlatform
}

export default interface PlayerState {
    position: Vec2,
    direction: Vec2
}
