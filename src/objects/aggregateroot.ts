import { Guid } from "../helpers/guid"
import { IAmAnAction } from "../interfaces/iamanaction";
import { ActionStore } from "../services/actionstore";

export abstract class AggregateRoot{

    ID: string;
    _actionStore: ActionStore;

    constructor(id?: string){
        this.ID = id || Guid.newGuid();
    }

    attachActionStore(actionStore: ActionStore){
        this._actionStore = actionStore;
    }

    abstract applyAction(action: IAmAnAction);
}