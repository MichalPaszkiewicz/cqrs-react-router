import { IAmADomainEvent } from "../interfaces/iamadomainevent";
export declare class StateReport {
    actions: IAmADomainEvent[];
    url: string;
    hash: string;
    constructor(actions: IAmADomainEvent[]);
    toString(): string;
}
