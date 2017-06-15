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
        this.applyEvent(event);
        this._eventStore.storeEvent(event);
    }

    abstract applyEvent(event: IAmADomainEvent);
}