import { Plataform } from "./Plataform";
export class Level{
    private plataforms:Array<Plataform>;
    constructor(){
        this.plataforms = [];
    }

    add(plataform:Plataform){
        this.plataforms.push(plataform);
    }

    getPlataforms():Array<Plataform>{
        return this.plataforms
    }
}