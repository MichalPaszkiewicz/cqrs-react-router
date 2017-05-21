import { IAmACommand } from "../interfaces/iamacommand";
import { IAmAnAction } from "../interfaces/iamanaction";
import { IAmACommandHandler } from "../interfaces/iamacommandhandler";
import { View } from "../objects/view";
import { ClockDate } from "../helpers/clock";
export declare class ApplicationService {
    private static _instance;
    static readonly Instance: ApplicationService;
    private _commandHandlers;
    private _viewTypes;
    private _views;
    private _viewSubscribers;
    private _actionStore;
    private _domainService;
    constructor();
    reset(): void;
    replayActions(finalTime?: ClockDate): void;
    handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void): void;
    registerCommandHandler<T extends IAmACommandHandler>(commandHandler: {
        new (id?: string): T;
    }): void;
    registerView<T extends View>(view: {
        new (): View;
    }): void;
    subscribe(viewName: string, callback: (view: View) => void): void;
    getView(name: string): View;
    storeAction(action: IAmAnAction): void;
}
