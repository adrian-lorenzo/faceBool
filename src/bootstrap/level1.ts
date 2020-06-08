import Level from "../models/Level"
import Stage from "../models/Stage"
import Platform from "../components/Platform"
import { relWidth, relHeight } from "../utils/uiUtils"

const level1 = new Level([
    new Stage([
        new Platform(
            { 
                x: relWidth(0.1), 
                y: relHeight(0.3)
            },
            {
                width: relWidth(0.2), 
                height: relHeight(0.05)
            },
            0.78
        ),
        new Platform(
            {
                x: relWidth(0.25),
                y: relHeight(0.6)
            },
            {
                width: relWidth(0.15), 
                height: relHeight(0.05)
            },
            0.39
        ),
        new Platform(
            {
                x: relWidth(0.5), 
                y: relHeight(0.999)
            }, 
            {
                width: relWidth(1), 
                height: relHeight(0.01)
            }
        ),
        new Platform(
            {
                x: relWidth(0.001), 
                y: relHeight(0.5)
            },
            {
                width: relWidth(0.01), 
                height: relHeight(1)
            }
        ),
        new Platform(
            {
                x: relWidth(0.5),  
                y: relHeight(0.001)
            },
            {
                width: relWidth(1),
                height: relHeight(0.01)
            }
        ),
        new Platform(
            {
                x: relWidth(0.9),
                y: relHeight(0.4)
            },
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            }
        )
    ]),

    new Stage([
        new Platform(
            {
                x: relWidth(0.25),
                y: relHeight(0.6)
            },
            {
                width: relWidth(0.15), 
                height: relHeight(0.05)
            },
            0.39
        ),
        new Platform(
            {
                x: relWidth(0.9),
                y: relHeight(0.4)
            },
            {
                width: relWidth(0.3),
                height: relHeight(0.05)
            }
        ),
        new Platform(
            {
                x: relWidth(0.5), 
                y: relHeight(0.999)
            }, 
            {
                width: relWidth(1), 
                height: relHeight(0.01)
            }
        ),
        new Platform(
            {
                x: relWidth(0.001), 
                y: relHeight(0.5)
            },
            {
                width: relWidth(0.01), 
                height: relHeight(1)
            }
        ),
        new Platform(
            {
                x: relWidth(0.5),  
                y: relHeight(0.001)
            },
            {
                width: relWidth(1),
                height: relHeight(0.01)
            }
        )
    ])
], 30);

export default level1;