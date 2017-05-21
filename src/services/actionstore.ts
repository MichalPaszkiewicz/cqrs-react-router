import {IAmAnAction} from "../interfaces/iamanaction";
import {ClockDate} from "../helpers/clock";

export class ActionStore{

    private _actions: IAmAnAction[] = [];
    private _onActionStoredEvents: ((action: IAmAnAction) => void)[] = [];

    storeAction(action: IAmAnAction){
        this._actions.push(action);
        this._onActionStoredEvents.forEach((callback) => {
            callback(action);
        })
    }

    replayActions(finalTime?: ClockDate){
        var self = this;
        self._actions.filter((action) => {
            return finalTime == null 
                || action.created == null   
                || action.created.isBefore(finalTime);
        }).forEach((action) => {
            self._onActionStoredEvents.forEach((callback) => {
                callback(action);
            });
        }); 
    }

    onActionStored(callback: (action: IAmAnAction) => void){
        this._onActionStoredEvents.push(callback);
    }

    clearOnActionStoredEvents(){
        this._onActionStoredEvents = [];
    }

    getActionsForID(id: string, callback: (actions: IAmAnAction[]) => void){
        callback(this._actions.filter(a => a.id == id));
    }
}