import { ClockDate } from "../helpers/clock";
export interface IAmAnAction {
    name: string;
    aggregateID: string;
    created?: ClockDate;
}
