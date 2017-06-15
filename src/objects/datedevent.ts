import {IAmADomainEvent} from "../interfaces/iamadomainevent";
import {Clock, ClockDate} from "../helpers/clock";

export abstract class DatedEvent implements IAmADomainEvent{
    abstract name: string;
    abstract aggregateID: string;

    created: ClockDate = Clock.now();
}