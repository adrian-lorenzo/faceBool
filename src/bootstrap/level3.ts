import { Vec2 } from "planck-js"
import Level from "../models/Level"
import Limit, { Orientation } from "../models/Limit"
import Platform from "../models/Platform"
import Stage from "../models/Stage"
import { relHeight, relWidth } from "../utils/uiUtils"

const bigLeftLimit = new Limit(Vec2(0.4, 0), Orientation.LEFT);
const hugeRightLimit = new Limit(Vec2(0.7, 0), Orientation.RIGHT);
const smallLeftLimit = new Limit(Vec2(0.400, 0.3), Orientation.LEFT);
const rightLimit = new Limit(Vec2(0.8, 0), Orientation.RIGHT);

const endLeftLimit = new Limit(Vec2(0, 0), Orientation.LEFT);
const endRightLimit = new Limit(Vec2(1, 0), Orientation.LEFT);

const level3Builder = () => {
    const stage1 = new Stage([
        new Platform(
            Vec2(relWidth(0.1), relHeight(0.1)),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0.3
        ),
        new Platform(
            Vec2(
                relWidth(0.3),
                relHeight(0.35)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            2.2
        ),

        new Platform(
            Vec2(relWidth(0.9), relHeight(0.1)),
            {
                width: relWidth(0.2),
                height: relHeight(0.05)
            },
            0.075
        ),

    ], bigLeftLimit, rightLimit);

    const stage2 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.460),
                relHeight(0.20)
            ),
            {
                width: relWidth(0.02),
                height: relHeight(0.01)
            },
            0.3
        ),

        new Platform(
            Vec2(
                relWidth(0.465),
                relHeight(0.30)
            ),
            {
                width: relWidth(0.03),
                height: relHeight(0.01)
            },
            0.3
        ),

        new Platform(
            Vec2(
                relWidth(0.460),
                relHeight(0.50)
            ),
            {
                width: relWidth(0.02),
                height: relHeight(0.01)
            },
            0.3
        ),

        new Platform(
            Vec2(
                relWidth(0.465),
                relHeight(0.60)
            ),
            {
                width: relWidth(0.03),
                height: relHeight(0.01)
            },
            0.3
        ),

        new Platform(
            Vec2(
                relWidth(0.575),
                relHeight(0.25)
            ),
            {
                width: relWidth(0.08),
                height: relHeight(0.01)
            },
            -0.07
        ),

        new Platform(
            Vec2(
                relWidth(0.545),
                relHeight(0.35)
            ),
            {
                width: relWidth(0.12),
                height: relHeight(0.01)
            },
            -0.58
        ),

        new Platform(
            Vec2(
                relWidth(0.575),
                relHeight(0.55)
            ),
            {
                width: relWidth(0.08),
                height: relHeight(0.01)
            },
            -0.07
        ),

        new Platform(
            Vec2(
                relWidth(0.550),
                relHeight(0.65)
            ),
            {
                width: relWidth(0.13),
                height: relHeight(0.01)
            },
            -0.7
        ),

        new Platform(
            Vec2(
                relWidth(0.525),
                relHeight(0.80)
            ),
            {
                width: relWidth(0.155),
                height: relHeight(0.01)
            },
            0.07
        ),


        new Platform(
            Vec2(
                relWidth(0.425),
                relHeight(0.22)
            ),
            {
                width: relWidth(0.2),
                height: relHeight(0.05)
            },
            1.57
        ),

        new Platform(
            Vec2(
                relWidth(0.425),
                relHeight(-0.03)
            ),
            {
                width: relWidth(0.15),
                height: relHeight(0.05)
            },
            1.57
        ),


        new Platform(
            Vec2(
                relWidth(0.425),
                relHeight(0.98)
            ),
            {
                width: relWidth(0.4),
                height: relHeight(0.05)
            },
            1.57
        ),

        new Platform(
            Vec2(
                relWidth(0.425),
                relHeight(0.53)
            ),
            {
                width: relWidth(0.2),
                height: relHeight(0.05)
            },
            1.57
        ),

        new Platform(
            Vec2(
                relWidth(0.625),
                relHeight(0.3)
            ),
            {
                width: relWidth(0.8),
                height: relHeight(0.05)
            },
            1.57
        ),

        new Platform(
            Vec2(
                relWidth(0.625),
                relHeight(0.95)
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
                relHeight(0.2)
            ),
            {
                width: relWidth(0.15),
                height: relHeight(0.05)
            },
            0.07
        )
    ], smallLeftLimit, rightLimit)

    const stage3 = new Stage([
        new Platform(
            Vec2(
                relWidth(0.2),
                relHeight(0.6)
            ),
            {
                width: relWidth(0.1),
                height: relHeight(0.05)
            },
        ),

        new Platform(
            Vec2(
                relWidth(0.32),
                relHeight(0.45)
            ),
            {
                width: relWidth(0.1),
                height: relHeight(0.05)
            },
            0.05
        ),


        new Platform(
            Vec2(
                relWidth(0.825),
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
                relWidth(0.825),
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
                relWidth(0.95),
                relHeight(0.65)
            ),
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            },
            0.5
        )
    ], smallLeftLimit, hugeRightLimit)

    return new Level(
        "Nivel 3",
        60 * 1000,
        relWidth(0.20),
        [
            stage1,
            stage2,
            stage3,
            new Stage([], endLeftLimit, endRightLimit)
        ], 60);
}

export default level3Builder;