import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { ClockDate } from "../helpers/clock";
export declare abstract class DatedEvent implements IAmADomainEvent {
    abstract name: string;
    abstract aggregateID: string;
    created: ClockDate;
}
