import { IAmADomainEvent } from "../interfaces/iamadomainevent";
export declare class StateReport {
    events: IAmADomainEvent[];
    url: string;
    hash: string;
    constructor(events: IAmADomainEvent[]);
    toString(): string;
}
