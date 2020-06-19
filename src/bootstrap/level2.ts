import { Vec2 } from "planck-js"
import Level from "../models/Level"
import Limit, { Orientation } from "../models/Limit"
import Platform from "../models/Platform"
import Stage from "../models/Stage"
import { relHeight, relWidth } from "../utils/uiUtils"

const bigLeftLimit = new Limit(Vec2(0.4, 0), Orientation.LEFT);
const hugeLeftLimit = new Limit(Vec2(0.8, 0), Orientation.LEFT)
const rightLimit = new Limit(Vec2(0.8, 0), Orientation.RIGHT);

const level2Builder = () => {
    const stage1 = new Stage([
        new Platform(
            Vec2(relWidth(0.10), relHeight(0.3)),
            {
                width: relWidth(0.32),
                height: relHeight(0.05)
            },
            0.3
        ),
        new Platform(
            Vec2(
                relWidth(1),
                relHeight(0.4)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0.10
        )
    ], bigLeftLimit, rightLimit);

    const stage2 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.4),
                relHeight(0.95)
            ),
            {
                width: relWidth(0.15),
                height: relHeight(0.05)
            },
            0.05
        ),

        new Platform(
            Vec2(
                relWidth(0.9),
                relHeight(0.2)
            ),
            {
                width: relWidth(0.15),
                height: relHeight(0.05)
            },
            0.05
        )
    ], bigLeftLimit, rightLimit)

    const stage3 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.2),
                relHeight(0.2)
            ),
            {
                width: relWidth(0.1),
                height: relHeight(0.05)
            },
            0.25
        ),

        new Platform(
            Vec2(
                relWidth(0.4),
                relHeight(0.3)
            ),
            {
                width: relWidth(0.1),
                height: relHeight(0.05)
            },
            0.25
        ),

        new Platform(
            Vec2(
                relWidth(0.6),
                relHeight(0.4)
            ),
            {
                width: relWidth(0.1),
                height: relHeight(0.05)
            },
            0.25
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
    ], hugeLeftLimit, rightLimit)

    return new Level(
        "Nivel 2",
        60 * 1000,
        relWidth(0.34),
        [
            stage1,
            stage2,
            stage3
        ], 60);
}

export default level2Builder;