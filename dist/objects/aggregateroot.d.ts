import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { EventStore } from "../services/eventstore";
export declare abstract class AggregateRoot {
    ID: string;
    _eventStore: EventStore;
    constructor(id?: string);
    attachEventStore(eventStore: EventStore): void;
    storeEvent(event: IAmADomainEvent): void;
    abstract applyEvent(event: IAmADomainEvent): any;
}
