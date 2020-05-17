import { BoundingBox } from "../models/bounding-box.model";
import { Player } from "../models/player.model";

export enum Direction {
    Up,
    Down,
    Left,
    Right,
    None
}

export class CollisionsInformation {
    isCollisions: boolean;
    direction: Direction;
    px: number;
    py: number;
    constructor(isCollisions:boolean, direction:Direction, px:number, py:number){
        this.isCollisions = isCollisions;
        this.direction    = direction;
        this.px           = px;
        this.py           = py;
    }
}

export class CollisionsController {

    private euclideanDistance(cx: number, px: number, cy: number, py: number): number {
        return Math.sqrt(Math.pow(cx - px, 2) + Math.pow(cy - py, 2))
    }

    detectionCirculesAndRectangles(player: Player, object: BoundingBox): CollisionsInformation {
        let typeCollision: Direction = Direction.None;
        let px: number = player.position.x;
        if (px < object.pointBox.x) {
            px = object.pointBox.x;
            typeCollision = Direction.Left;
        }
        if (px > object.pointBox.x + object.widthBox) {
            px = object.pointBox.x + object.widthBox;
            typeCollision = Direction.Right;
        }
        let py: number = player.position.y;
        if (py < object.pointBox.y) {
            py = object.pointBox.y;
            typeCollision = Direction.Up;
        }
        if (py > object.pointBox.y + object.heightBox) {
            py = object.pointBox.y + object.heightBox;
            typeCollision = Direction.Down;
        }
        let dist: number = this.euclideanDistance(player.position.x,px,player.position.y,py);
        if (dist < player.mass/2.) {
            return new CollisionsInformation(true,typeCollision,px,py);
        }
        return new CollisionsInformation(false,typeCollision,-1,-1);
    }
}