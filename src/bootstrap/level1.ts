import Level from "../models/Level"
import Stage from "../models/Stage"
import Platform from "../models/Platform"
import { relWidth, relHeight } from "../utils/uiUtils"
import Limit, { Orientation } from "../models/Limit"
import { Vec2 } from "planck-js"

const leftLimit = new Limit(0.2, Orientation.LEFT);
const rightLimit = new Limit(0.8, Orientation.RIGHT);

const level1Builder = () => {
    return new Level([
        // State1
        new Stage([
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
                    relWidth(0.5), 
                    relHeight(0.999)
                ), 
                {
                    width: relWidth(1), 
                    height: relHeight(0.01)
                }
            ),
            new Platform(
                Vec2(
                    relWidth(0.001), 
                    relHeight(0.5)
                ),
                {
                    width: relWidth(0.01), 
                    height: relHeight(1)
                }
            ),
            new Platform(
                Vec2(
                    relWidth(0.5),  
                    relHeight(0.001)
                ),
                {
                    width: relWidth(1),
                    height: relHeight(0.01)
                }
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
        ], leftLimit, rightLimit),
        // State2
        new Stage([
            new Platform(
                Vec2(
                    relWidth(0.5), 
                    relHeight(0.999)
                ), 
                {
                    width: relWidth(1), 
                    height: relHeight(0.01)
                }
            ),
            new Platform(
                Vec2(
                    relWidth(0.725),
                    relHeight(0.6)
                ),
                {
                    width: relWidth(0.5),
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
                    relHeight(0.6)
                ), 
                {
                    width: relWidth(0.4), 
                    height: relHeight(0.05)
                },
                0.5
            )
        ], leftLimit, rightLimit),
        // State3
        new Stage([
            new Platform(
                Vec2(
                    relWidth(0.5), 
                    relHeight(0.999)
                ), 
                {
                    width: relWidth(1), 
                    height: relHeight(0.01)
                }
            ),
            new Platform(
                Vec2(
                    relWidth(0.9),
                    relHeight(0.75)
                ),
                {
                    width: relWidth(0.3),
                    height: relHeight(0.05)
                },
                0.5
            ),
            new Platform(
                Vec2(
                    relWidth(0.55), 
                    relHeight(0.45)
                ), 
                {
                    width: relWidth(0.3), 
                    height: relHeight(0.05)
                },
                -0.5
            )
        ], leftLimit, rightLimit)
        
    ], 60);
}

export default level1Builder;