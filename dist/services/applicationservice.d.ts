import { IAmACommand } from "../interfaces/iamacommand";
import { IAmACommandHandler } from "../interfaces/iamacommandhandler";
import { View } from "../objects/view";
export declare class ApplicationService {
    private static _instance;
    static readonly Instance: ApplicationService;
    private _commandHandlers;
    private _views;
    private _viewSubscribers;
    private _actionStore;
    private _domainService;
    constructor();
    handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void): void;
    registerCommandHandler<T extends IAmACommandHandler>(commandHandler: {
        new (id?: string): T;
    }): void;
    registerView<T extends View>(view: {
        new (): View;
    }): void;
    subscribe(viewName: string, callback: (view: View) => void): void;
    getView(name: string): View;
}
