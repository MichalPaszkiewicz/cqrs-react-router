import { DatedAction } from "./datedaction";
import { ClockDate } from "../helpers/clock";
export declare abstract class AuditedAction extends DatedAction {
    abstract name: string;
    abstract aggregateID: string;
    abstract createdBy: string;
    created: ClockDate;
}
