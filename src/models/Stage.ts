import P5 from "p5";
import Platform from "../components/Platform";
import Limit from "./Limit";

export default class Stage {
    platforms: Platform[]
    leftLimit: Limit
    rightLimit: Limit

    constructor(platforms: Platform[], leftLimit: Limit, rightLimit: Limit) {
        this.platforms = platforms
        this.leftLimit = leftLimit;
        this.rightLimit = rightLimit;
    }

    draw(p5: P5, texture?: P5.Image) {
        this.platforms.forEach(platform => {
            platform.draw(p5, texture);
        });

        this.leftLimit.draw(p5);
        this.rightLimit.draw(p5);
    }
}