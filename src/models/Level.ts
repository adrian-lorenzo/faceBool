import P5 from "p5";
import Platform from "../components/Platform";
import Stage from "./Stage";
import Ball from "../components/Ball";
import { relWidth, relHeight } from "../utils/uiUtils";
import { Engine, Events, World, Composite } from "matter-js";
import PlayerState, { PlayerAction } from "./PlayerAction";
import { Sound } from "../components/Sound";

export default class Level {
    stages: Stage[];
    frameRate: number;

    sound= new Sound();

    engine = Engine.create();
    currentStageIdx = 0;
    hasStarted = false;
    
    player = new Ball(
        {
            x: relWidth(0.05),
            y: relWidth(0.05)
        }, 
        relWidth(0.03)
    )

    platformPosition = { x: 0, y: 0 };
    angle = 0;
    userPlatform = new Platform(
        this.platformPosition,
        {
            width: relWidth(0.38),
            height: relHeight(0.048)
        }
    );

    actions: Map<PlayerAction, Boolean> = new Map();
    playerState: PlayerState | undefined;

    constructor(stages: Stage[], frameRate) {
        this.stages = stages
        this.frameRate = frameRate
        World.add(this.engine.world, this.player.entity);
        World.add(this.engine.world, this.stages[this.currentStageIdx].platforms.map((platform) => platform.entity));
        World.add(this.engine.world, this.userPlatform.entity);
        this.subscribeActions();
    }

    run = (p5: P5) => {
        if (!this.hasStarted) return;
        Engine.update(this.engine, 1000/this.frameRate);

        this.player.draw(p5);
        this.userPlatform.draw(p5);
        this.stages[this.currentStageIdx].draw(p5);
    }

    moveUserPlatform() {
        if (this.playerState) {
            this.userPlatform.translate({ 
                x: this.playerState.position.x - this.platformPosition.x, 
                y: this.playerState.position.y - this.platformPosition.y 
            });
            
            this.platformPosition = this.playerState.position;
            this.userPlatform.setAngle(Math.atan2(this.playerState.direction.y, this.playerState.direction.x));
        }
    }

    subscribeActions() {
        Events.on(this.engine, "beforeUpdate", this.onPhysicsUpdate);
        Events.on(this.engine, "collisionStart", this.onCollisionStart);
        Events.on(this.engine, "collisionEnd", this.onCollisionEnd);
    }

    onPhysicsUpdate = () => {
        this.checkLimits();
        this.checkActions();
    }

    onCollisionStart = (event: Matter.IEventCollision<Engine>) => {
        if (event.pairs[0].bodyA.id === this.player.id || event.pairs[0].bodyB.id === this.player.id) {
            this.sound.playPlatformSound();
            this.player.isOnGround = true;

            const lastIndex = this.stages[this.currentStageIdx].platforms.length - 1;
            const lastPlatform = this.stages[this.currentStageIdx].platforms[lastIndex];
            if (event.pairs[0].bodyA.id === lastPlatform.id || event.pairs[0].bodyB.id === lastPlatform.id) {
                this.actions.set(PlayerAction.AtLastPlatform, true);
            }
        }
    }

    onCollisionEnd = (event: Matter.IEventCollision<Engine>) => {
        if (event.pairs[0].bodyA.id === this.player.id || event.pairs[0].bodyB.id === this.player.id) {
            this.player.isOnGround = false;
        }
    }
 
    checkLimits = () => {
        if ((this.userPlatform.entity.position.x) <= relWidth(this.stages[this.currentStageIdx].leftLimit.limit) ||
            (this.userPlatform.entity.position.x) >= relWidth(this.stages[this.currentStageIdx].rightLimit.limit)) {
            World.remove(this.engine.world, this.userPlatform.entity);
        } else if (Composite.get(this.engine.world, this.userPlatform.entity.id, "body") === null) {
            World.add(this.engine.world, this.userPlatform.entity);
        }
    }

    checkActions = () => {
        if (this.actions.get(PlayerAction.Jump)) {
            this.sound.playJumpSound();
            this.player.jump();
        }

        if (this.actions.get(PlayerAction.MoveLeft)) {
            this.player.moveLeft();
        }

        if (this.actions.get(PlayerAction.MoveRight)) {
            this.player.moveRight();
        }

        if (this.actions.get(PlayerAction.MovePlatform)) {
            this.moveUserPlatform();
            this.actions.set(PlayerAction.MovePlatform, false);
        }

        if (this.actions.get(PlayerAction.AtLastPlatform)) {
            const lastIndex = this.stages[this.currentStageIdx].platforms.length - 1;
            const lastPlatform = this.stages[this.currentStageIdx].platforms[lastIndex];
            if (this.player.getPosition().x >= lastPlatform.entity.position.x) {
                this.startTranslationToNewStage();
                this.actions.set(PlayerAction.AtLastPlatform, false);
            }
        }

        if (this.actions.get(PlayerAction.TranslateStage)) {
            this.sound.playMoveSound();
            this.translateToNewStage();
        }
    }

    startTranslationToNewStage = () => {
        this.actions.set(PlayerAction.TranslateStage, true);
        this.userPlatform.hidden = true;
    }

    translateToNewStage = () => {
        const lastIndex = this.stages[this.currentStageIdx].platforms.length - 1;
        const lastPlatform = this.stages[this.currentStageIdx].platforms[lastIndex];

        if ((lastPlatform.entity.position.x - (lastPlatform.dimensions.width / 2)) <= relWidth(0)) {
            this.actions.set(PlayerAction.TranslateStage, false);
            this.goNextStage();
            this.userPlatform.hidden = false;
            return;
        }

        this.stages[this.currentStageIdx].platforms.forEach((platform) => {
            platform.translate({ x: relWidth(-0.03), y: 0});
        });
        
        this.player.translate({ x: relWidth(-0.03), y: 0});
    }

    goNextStage = () => {
        if (this.currentStageIdx === this.stages.length - 1) return;
        this.currentStageIdx++;
        World.add(this.engine.world, this.stages[this.currentStageIdx].platforms.map((platform) => platform.entity));
        this.stages[this.currentStageIdx].platforms
            .unshift(this.stages[this.currentStageIdx-1].platforms[this.stages[this.currentStageIdx-1].platforms.length - 1]);

        this.stages[this.currentStageIdx-1].platforms.forEach((platform, index) => {
            if (index === this.stages[this.currentStageIdx-1].platforms.length - 1) return;
            World.remove(this.engine.world, platform.entity);
        });
    } 
}