import { ClockDate } from "../helpers/clock";
export interface IAmADomainEvent {
    name: string;
    aggregateID: string;
    created?: ClockDate;
}
