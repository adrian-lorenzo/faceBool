import P5 from "p5";
import Ball from "./Ball";
import { relWidth, relHeight } from "../utils/uiUtils";
import PlayerState, { PlayerAction } from "./PlayerAction";
import { Sound } from "../components/Sound";
import { World, Vec2, Contact } from "planck-js";
import { mettersToPixels } from "../utils/ppmUtils";
import Platform from "./Platform";
import Stage from "./Stage";

export default class Level {
    stages: Stage[];
    frameRate: number;

    sound = new Sound();

    world = World({ gravity: Vec2(0, 14)});
    currentStageIdx = 0;
    hasStarted = false;
    
    platformPosition = Vec2(0, 0);
    userPlatform = new Platform(
        this.platformPosition,
        {
            width: relWidth(0.38),
            height: relHeight(0.048)
        },
        0,
        this.world
    );

    player = new Ball(
        Vec2(relWidth(0.05), relWidth(0.05)), 
        relWidth(0.03),
        this.world
    );

    angle = 0;

    actions: Map<PlayerAction, Boolean> = new Map();
    playerState: PlayerState | undefined;

    constructor(stages: Stage[], frameRate: number, world?: World) {
        this.stages = stages
        this.frameRate = frameRate

        this.stages[this.currentStageIdx].platforms.forEach((platform) => {
            platform.init(this.world);
        });

        this.subscribeActions();
        this.sound.setupMicrophoneListener(this.onAudioPeak);
    }

    run = (p5: P5, ballTexture?: P5.Image, platformTexture?: P5.Image) => {
        if (!this.hasStarted) return;
        this.world.step(1/this.frameRate);
        this.onPhysicsUpdate();
        this.player.draw(p5, ballTexture);
        this.userPlatform.draw(p5, platformTexture);
        this.stages[this.currentStageIdx].draw(p5, platformTexture);
    }

    reset(){
        this.world = new World();
        this.player.init(this.world);
        this.userPlatform.init(this.world);

        this.currentStageIdx = 0;
        this.stages[this.currentStageIdx].platforms.forEach((platform) => {
            platform.init(this.world);
        });
    }

    moveUserPlatform() {
        if (this.playerState) {
            this.userPlatform.translate(
                this.playerState.position, 
                Math.atan2(this.playerState.direction.y, this.playerState.direction.x)
            );
        }
    }

    subscribeActions() {
        this.world.on("begin-contact", this.onCollisionStart);
        this.world.on("end-contact", this.onCollisionEnd);
    }



    onPhysicsUpdate = () => {
        this.checkLimits();
        this.checkActions();
    }

    onCollisionStart = (contact: Contact) => {
        console.log("collisionStart");
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        if (bodyA.getUserData() === this.player.entity.getUserData() 
            || bodyB.getUserData() === this.player.entity.getUserData()) {
            this.sound.playPlatformSound();
            this.player.isOnGround = true;

            const lastIndex = this.stages[this.currentStageIdx].platforms.length - 1;
            const lastPlatform = this.stages[this.currentStageIdx].platforms[lastIndex];

            if (bodyA.getUserData() === lastPlatform.entity.getUserData() 
                || bodyB.getUserData() === lastPlatform.entity.getUserData()) {
                this.actions.set(PlayerAction.AtLastPlatform, true);
            }
        }
    }

    onCollisionEnd = (contact: Contact) => {
        console.log("collisionEnd");
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        const bodyA = fixtureA.getBody();
        const bodyB = fixtureB.getBody();

        if (bodyA.getUserData() === this.player.entity.getUserData() 
            || bodyB.getUserData() === this.player.entity.getUserData()) {
            this.player.isOnGround = false;
        }
    }

    onAudioPeak = () => {
        //this.actions.set(PlayerAction.Jump, true);
    }

    checkLimits = () => {
        const playerPosition = this.player.getPosition();
        if (playerPosition.x <= relWidth(this.stages[this.currentStageIdx].leftLimit.limit) ||
            playerPosition.x >= relWidth(this.stages[this.currentStageIdx].rightLimit.limit)) {
            this.userPlatform.entity.getFixtureList()?.setSensor(true);
        } else if (!this.player.entity.getFixtureList()?.isSensor()) {
            this.userPlatform.entity.getFixtureList()?.setSensor(false);
        }
    }

    checkIfPLayerIsDeath(): boolean {
        //console.log(this.player.getPosition());
        return this.player.getPosition().y > relHeight(1);
    }

    checkActions = () => {
        if (this.actions.get(PlayerAction.Jump)) {
            this.sound.playJumpSound();
            this.player.jump();
            this.actions.set(PlayerAction.Jump, false);
        }

        if (this.actions.get(PlayerAction.MoveLeft)) {
            this.player.moveLeft();
        }

        if (this.actions.get(PlayerAction.MoveRight)) {
            this.player.moveRight();
        }

        if (this.actions.get(PlayerAction.MovePlatform)) {
            this.moveUserPlatform();
            this.actions.set(PlayerAction.MovePlatform, false);
        }

        if (this.actions.get(PlayerAction.AtLastPlatform)) {
            const lastIndex = this.stages[this.currentStageIdx].platforms.length - 1;
            const lastPlatform = this.stages[this.currentStageIdx].platforms[lastIndex];
            if (this.player.getPosition().x >= lastPlatform.getPosition().x) {
                    
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

        if ((lastPlatform.getPosition().x - (lastPlatform.dimensions.width / 2)) <= relWidth(0)) {
            this.actions.set(PlayerAction.TranslateStage, false);
            this.goNextStage();
            this.userPlatform.hidden = false;
            return;
        }

        this.stages[this.currentStageIdx].platforms.forEach((platform) => {
            const entity = platform.entity
            if (entity) {
                const pos = mettersToPixels(entity.getPosition());
                platform.translate(Vec2(pos.x - relWidth(0.03), pos.y), entity.getAngle());
            }
        });
        
        const playerPosition = this.player.getPosition()
        if (playerPosition) {
            this.player.translate(Vec2(playerPosition.x - relWidth(0.03), playerPosition.y));
        }
    }

    goNextStage = () => {
        if (this.currentStageIdx === this.stages.length - 1) return;
        this.currentStageIdx++;
        this.stages[this.currentStageIdx].platforms.forEach((platform) => {
            platform.init(this.world);
        });
        this.stages[this.currentStageIdx].platforms
            .unshift(this.stages[this.currentStageIdx - 1].platforms[this.stages[this.currentStageIdx - 1].platforms.length - 1]);

        this.stages[this.currentStageIdx-1].platforms.forEach((platform, index) => {
            if (index === this.stages[this.currentStageIdx-1].platforms.length - 1) return;
            if (platform.entity) {
                this.world.destroyBody(platform.entity);
            }
        });
    }
}