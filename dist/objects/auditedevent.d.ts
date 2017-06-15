import { DatedEvent } from "./datedevent";
import { ClockDate } from "../helpers/clock";
export declare abstract class AuditedEvent extends DatedEvent {
    abstract name: string;
    abstract aggregateID: string;
    abstract createdBy: string;
    created: ClockDate;
}
