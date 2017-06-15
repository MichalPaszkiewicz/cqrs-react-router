import { AggregateRoot } from "../objects/aggregateroot";
import { EventStore } from "../services/eventstore";
import { IAmADomainEvent } from "../interfaces/iamadomainevent";
export declare class DomainService {
    private _aggregateRoots;
    private _eventStore;
    constructor(eventStore: EventStore);
    getAggregateRoot<T extends AggregateRoot>(c: {
        new (id?: string): T;
    }, callback: (aggregateRoot: T) => void, id?: string): void;
    applyEventToAllAggregates(event: IAmADomainEvent): void;
    clearAggregateRoots(): void;
}
