import P5 from "p5";
import Platform from "../components/Platform";
import Stage from "./Stage";
import Ball from "../components/Ball";
import { relWidth, relHeight } from "../utils/uiUtils";
import { Engine, Events, World, Vector } from "matter-js";
import { PlayerAction } from "./PlayerAction";
import { horizontalScroll } from "../events/HorizontalScrollEvent";

export default class Level {
    stages: Stage[];
    frameRate: number;

    engine = Engine.create();
    currentStageIdx = 0;
    
    player = new Ball(
        {
            x: relWidth(0.05),
            y: relWidth(0.05)
        }, 
        relWidth(0.03)
    )

    platformPosition = { x: 0, y: 0 };

    userPlatform = new Platform(
        this.platformPosition,
        {
            width: relWidth(0.38),
            height: relHeight(0.048)
        }
    );

    actions: Map<PlayerAction, Boolean> = new Map();

    constructor(stages: Stage[], frameRate) {
        this.stages = stages
        this.frameRate = frameRate
        World.add(this.engine.world, this.player.entity);
        World.add(this.engine.world, this.stages[this.currentStageIdx].platforms.map((platform) => platform.entity));
        World.add(this.engine.world, this.userPlatform.entity);
        this.subscribeActions();
    }

    run(p5: P5) {
        Engine.update(this.engine, 1000/this.frameRate)

        this.stages.forEach(stage => {
            stage.draw(p5)
        });

        this.player.draw(p5);
        this.userPlatform.draw(p5);
    }

    moveUserPlatform(newPosition: Vector, direction: Vector) {
        this.userPlatform.translate({ x: newPosition.x - this.platformPosition.x, y: newPosition.y - this.platformPosition.y });
        this.platformPosition = newPosition;
        this.userPlatform.setAngle(Math.atan2(direction.y, direction.x));
    }

    subscribeActions() {
        Events.on(this.engine, "beforeTick", (_) => {

            if (this.actions.get(PlayerAction.Jump)) {
                this.player.jump();
            }

            if (this.actions.get(PlayerAction.MoveLeft)) {
                this.player.moveLeft();
            }

            if (this.actions.get(PlayerAction.MoveRight)) {
                this.player.moveRight();
            }
        });

        Events.on(this.engine, "collisionEnd", (event) => {
            if (event.pairs[0].bodyA.id === this.player.id || event.pairs[0].bodyB.id === this.player.id) {
                this.player.isOnGround = false;
            }

        });

        Events.on(this.engine, "collisionStart", (event) => {
            if (event.pairs[0].bodyA.id === this.player.id || event.pairs[0].bodyB.id === this.player.id) {
                this.player.isOnGround = true;
            }
            if ((event.pairs[0].bodyA.id === this.player.id || event.pairs[0].bodyB.id === this.player.id) &&
                this.player.getPosition().x > relWidth(0.9)) {
                    horizontalScroll(this.userPlatform, this.stages[this.currentStageIdx].platforms, this.player);
                }
        });
    }
    
}