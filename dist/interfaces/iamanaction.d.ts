import { ClockDate } from "../helpers/clock";
export interface IAmAnAction {
    name: string;
    id: string;
    created?: ClockDate;
}
