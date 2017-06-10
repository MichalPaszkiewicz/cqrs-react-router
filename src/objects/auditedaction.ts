import {DatedAction} from "./datedaction";
import {Clock, ClockDate} from "../helpers/clock";

export abstract class AuditedAction extends DatedAction{
    abstract name: string;
    abstract aggregateID: string;
    abstract createdBy: string;

    created: ClockDate = Clock.now();
}