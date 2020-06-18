import Level from "../models/Level"
import Stage from "../models/Stage"
import Platform from "../models/Platform"
import { relWidth, relHeight } from "../utils/uiUtils"
import Limit, { Orientation } from "../models/Limit"
import { Vec2 } from "planck-js"

const leftLimit = new Limit(Vec2(0.2, 0), Orientation.LEFT);
const rightLimit = new Limit(Vec2(0.8, 0), Orientation.RIGHT);

const level1Builder = () => {
    const stage1 = new Stage([
        new Platform(
            Vec2(relWidth(0.075), relHeight(0.3)),
            {
                width: relWidth(0.25), 
                height: relHeight(0.05)
            },
            0.75
        ),
        new Platform(
            Vec2(
                relWidth(0.9),
                relHeight(0.4)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0.30
        )
    ], leftLimit, rightLimit);

    const stage2 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.725),
                relHeight(0.7)
            ),
            {
                width: relWidth(0.8),
                height: relHeight(0.05)
            },
            1.57
        ),

        new Platform(
            Vec2(
                relWidth(0.725),
                relHeight(0.05)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            1.57
        ),
        
        new Platform(
            Vec2(
                relWidth(0.9), 
                relHeight(0.5)
            ), 
            {
                width: relWidth(0.4), 
                height: relHeight(0.05)
            },
            0.2
        )
    ], leftLimit, rightLimit)

    const stage3 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.5), 
                relHeight(0.40)
            ), 
            {
                width: relWidth(1), 
                height: relHeight(0.05)
            },
        ),
        new Platform(
            Vec2(
                relWidth(0.9),
                relHeight(0.65)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0.5
        )
    ], leftLimit, rightLimit)

    return new Level(
        relWidth(0.36),
        [
            stage1,
            stage2,
            stage3
        ], 60);
}

export default level1Builder;