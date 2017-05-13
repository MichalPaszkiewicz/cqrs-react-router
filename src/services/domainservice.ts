import {AggregateRoot} from "../objects/aggregateroot";
import {ActionStore} from "../services/actionstore";

export class DomainService{

    private _aggregateRoots: AggregateRoot[] = [];
    private _actionStore: ActionStore;

    constructor(actionStore: ActionStore){
        this._actionStore = actionStore;
    }

    getAggregateRoot<T extends AggregateRoot>(c: {new(id?: string): T; }, callback: (aggregateRoot: T) => void, id?: string){
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter((ar) => {
            ar.ID == id;
        });
        if(similarAggregateRoots.length == 0){
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachActionStore(self._actionStore);
            self._aggregateRoots.push(newAggregateRoot);
            callback(<T>newAggregateRoot);
            return;
        }
        callback(<T>similarAggregateRoots[0]);
    }
}