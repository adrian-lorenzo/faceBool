export class KeyController {
    keys: Map<string, boolean>;
    constructor() {
        this.keys = new Map<string, boolean>();
    }

    addKey(key: string, activated: boolean) {
        this.keys.set(key, activated);
    }

    getKeysActivated(): Array<string> {
        let result: Array<string> = [];
        this.keys.forEach(function (value: boolean, key: string) {
            if (value) {
                result.push(key);
            }
        })
        return result;
    }


}