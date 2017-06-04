import { IAmAnAction } from "../interfaces/iamanaction";
export declare class StateReport {
    actions: IAmAnAction[];
    url: string;
    hash: string;
    constructor(actions: IAmAnAction[]);
    toString(): string;
}
