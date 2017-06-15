import {IAmADomainEvent} from "../interfaces/iamadomainevent";

export class StateReport{
    url: string;
    hash: string;
    constructor(public actions: IAmADomainEvent[]){
        this.url = window.location.href;
        this.hash = window.location.hash;
    }

    toString(){
        return JSON.stringify(this);
    }
}