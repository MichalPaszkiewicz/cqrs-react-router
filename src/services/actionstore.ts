import {IAmAnAction} from "../interfaces/iamanaction";

export class ActionStore{

    private _actions: IAmAnAction[] = [];
    private _onActionStoredEvents: ((action: IAmAnAction) => void)[] = [];

    storeAction(action: IAmAnAction){
        this._actions.push(action);
        this._onActionStoredEvents.forEach((callback) => {
            callback(action);
        })
    }

    onActionStored(callback: (action: IAmAnAction) => void){
        this._onActionStoredEvents.push(callback);0
    }

    clearOnActionStoredEvents(){
        this._onActionStoredEvents = [];
    }

    getActionsForID(id: string, callback: (actions: IAmAnAction[]) => void){
        callback(this._actions.filter(a => a.id == id));
    }
}