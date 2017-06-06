import {IAmAnAction} from "../interfaces/iamanaction";
import {Clock, ClockDate} from "../helpers/clock";

export abstract class DatedAction implements IAmAnAction{
    abstract name: string;
    abstract aggregateID: string;

    created: ClockDate = Clock.now();
}