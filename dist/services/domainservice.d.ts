import { AggregateRoot } from "../objects/aggregateroot";
import { ActionStore } from "../services/actionstore";
import { IAmAnAction } from "../interfaces/iamanaction";
export declare class DomainService {
    private _aggregateRoots;
    private _actionStore;
    constructor(actionStore: ActionStore);
    getAggregateRoot<T extends AggregateRoot>(c: {
        new (id?: string): T;
    }, callback: (aggregateRoot: T) => void, id?: string): void;
    applyActionToAllAggregates(action: IAmAnAction): void;
    clearAggregateRoots(): void;
}
