import {DatedEvent} from "./datedevent";
import {Clock, ClockDate} from "../helpers/clock";

export abstract class AuditedEvent extends DatedEvent{
    abstract name: string;
    abstract aggregateID: string;
    abstract createdBy: string;
    clientID: string;

    created: ClockDate = Clock.now();
}