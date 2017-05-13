import { IAmAnAction } from "../interfaces/iamanaction";
export declare class ActionStore {
    private _actions;
    private _onActionStoredEvents;
    storeAction(action: IAmAnAction): void;
    onActionStored(callback: (action: IAmAnAction) => void): void;
    clearOnActionStoredEvents(): void;
    getActionsForID(id: string, callback: (actions: IAmAnAction[]) => void): void;
}
