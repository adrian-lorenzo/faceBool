import P5 from "p5";
import Platform from "../components/Platform";

export default class Stage {
    platforms: Platform[]

    constructor(platforms: Platform[]) {
        this.platforms = platforms
    }

    draw(p5: P5) {
        this.platforms.forEach(platform => {
            platform.draw(p5)
        });
    }
}