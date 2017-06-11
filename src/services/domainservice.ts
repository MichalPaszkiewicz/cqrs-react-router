import {AggregateRoot} from "../objects/aggregateroot";
import {ActionStore} from "../services/actionstore";
import {IAmAnAction} from "../interfaces/iamanaction";

export class DomainService{

    private _aggregateRoots: AggregateRoot[] = [];
    private _actionStore: ActionStore;

    constructor(actionStore: ActionStore){
        this._actionStore = actionStore;
    }

    getAggregateRoot<T extends AggregateRoot>(c: {new(id?: string): T; }, callback: (aggregateRoot: T) => void, id?: string){
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter((ar) => {
            return ar.ID === id;
        });
        if(similarAggregateRoots.length == 0){
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachActionStore(self._actionStore);
            
            // replay all actions for this Aggregate Root in the action store
            self._actionStore.getActionsForID(id, (actions) => {
                actions.forEach((action) => newAggregateRoot.applyAction(action)); 
            });
            
            self._aggregateRoots.push(newAggregateRoot);
            callback(<T>newAggregateRoot);
            return;
        }
        callback(<T>similarAggregateRoots[0]);
    }

    applyActionToAllAggregates(action: IAmAnAction){
        this._aggregateRoots.forEach((ar) => {
            ar.applyAction(action);
        })
    }

    clearAggregateRoots(){
        this._aggregateRoots = [];
    }
}