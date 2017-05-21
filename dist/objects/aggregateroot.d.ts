import { IAmAnAction } from "../interfaces/iamanaction";
import { ActionStore } from "../services/actionstore";
export declare abstract class AggregateRoot {
    ID: string;
    _actionStore: ActionStore;
    constructor(id?: string);
    attachActionStore(actionStore: ActionStore): void;
    storeAction(action: IAmAnAction): void;
    abstract applyAction(action: IAmAnAction): any;
}
