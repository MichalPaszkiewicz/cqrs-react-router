import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { ClockDate } from "../helpers/clock";
export declare class EventStore {
    private _events;
    private _onEventStoredEvents;
    storeEvent(event: IAmADomainEvent): void;
    replayEvents(finalTime?: ClockDate): void;
    onEventStored(callback: (event: IAmADomainEvent) => void): void;
    clearOnEventStoredEvents(): void;
    getEventsForID(id: string, callback: (events: IAmADomainEvent[]) => void): void;
    getAllEvents(): IAmADomainEvent[];
}
