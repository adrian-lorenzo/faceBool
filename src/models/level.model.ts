import { Platform } from "./platform.model";

export class Level {
    private plataforms: Array<Platform>;

    constructor() {
        this.plataforms = [];
    }

    add(plataform: Platform) {
        this.plataforms.push(plataform);
    }

    removeLast(){
        this.plataforms.slice(-1,1)
    }

    getPlatforms(): Array<Platform> {
        return this.plataforms
    }
}