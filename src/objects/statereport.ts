import {IAmAnAction} from "../interfaces/iamanaction";

export class StateReport{
    url: string;
    hash: string;
    constructor(public actions: IAmAnAction[]){
        this.url = window.location.href;
        this.hash = window.location.hash;
    }

    toString(){
        return JSON.stringify(this);
    }
}