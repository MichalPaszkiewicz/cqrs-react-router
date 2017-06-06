import { IAmAnAction } from "../interfaces/iamanaction";
import { ClockDate } from "../helpers/clock";
export declare abstract class DatedAction implements IAmAnAction {
    abstract name: string;
    abstract aggregateID: string;
    created: ClockDate;
}
