import { Platform } from "./platform.model";

export class Level {
    private plataforms: Array<Platform>;

    constructor() {
        this.plataforms = [];
    }

    add(plataform: Platform) {
        this.plataforms.push(plataform);
    }

    getPlatforms(): Array<Platform> {
        return this.plataforms
    }
}