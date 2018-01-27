import { Guid } from "../helpers/guid"
import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { EventStore } from "../services/eventstore";

export abstract class AggregateRoot{

    ID: string;
    _eventStore: EventStore;

    constructor(id?: string){
        this.ID = id || Guid.newGuid();
    }

    attachEventStore(eventStore: EventStore){
        this._eventStore = eventStore;
    }

    storeEvent(event: IAmADomainEvent){
        var self = this;
        
        self.applyEvent(event);

        //custom apply methods
        var fixedEventName = event.name.toLowerCase().replace(/ /g,'');

        var keys = [];
        for (var key in self){
            keys.push(key);
        }

        keys.filter((p) => typeof(self[p]) == "function")
            .filter((p) => p.toLowerCase().indexOf("apply") > -1)
            .filter((p) => p.toLowerCase().indexOf(fixedEventName) > -1)
            .forEach((p) => {
                self[p](event);
            });
        self._eventStore.storeEvent(event);
    }

    abstract applyEvent(event: IAmADomainEvent);
}