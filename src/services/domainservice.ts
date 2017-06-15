import {AggregateRoot} from "../objects/aggregateroot";
import {EventStore} from "../services/eventstore";
import {IAmADomainEvent} from "../interfaces/iamadomainevent";

export class DomainService{

    private _aggregateRoots: AggregateRoot[] = [];
    private _eventStore: EventStore;

    constructor(eventStore: EventStore){
        this._eventStore = eventStore;
    }

    getAggregateRoot<T extends AggregateRoot>(c: {new(id?: string): T; }, callback: (aggregateRoot: T) => void, id?: string){
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter((ar) => {
            return ar.ID === id;
        });
        if(similarAggregateRoots.length == 0){
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachEventStore(self._eventStore);
            
            // replay all actions for this Aggregate Root in the action store
            self._eventStore.getEventsForID(id, (actions) => {
                actions.forEach((action) => newAggregateRoot.applyEvent(action)); 
            });
            
            self._aggregateRoots.push(newAggregateRoot);
            callback(<T>newAggregateRoot);
            return;
        }
        callback(<T>similarAggregateRoots[0]);
    }

    applyEventToAllAggregates(event: IAmADomainEvent){
        this._aggregateRoots.forEach((ar) => {
            ar.applyEvent(event);
        })
    }

    clearAggregateRoots(){
        this._aggregateRoots = [];
    }
}