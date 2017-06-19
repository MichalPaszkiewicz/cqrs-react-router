import { IAmACommand } from "../interfaces/iamacommand";
import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { IAmACommandHandler } from "../interfaces/iamacommandhandler";
import { View } from "../objects/view";
import { DomainError } from "../objects/domainerror";
import { ClockDate } from "../helpers/clock";
import { CommandValidator } from "../objects/commandvalidator";
import { StateReport } from "../objects/statereport";
import { Page } from "../objects/page";
export declare class ApplicationService {
    private static _instance;
    static readonly Instance: ApplicationService;
    private _commandHandlerTypes;
    private _commandHandlers;
    private _commandValidatorTypes;
    private _commandValidators;
    private _viewTypes;
    private _views;
    private _viewSubscribers;
    private _eventStore;
    private _domainService;
    private _domainErrorHandlers;
    private _onEventStoredHandlers;
    clear(): void;
    constructor();
    reset(): void;
    replayEvents(finalTime?: ClockDate, millisecondsInterval?: number): void;
    hardReplayEvents(finalTime?: ClockDate, millisecondsInterval?: number): void;
    onDomainError(callback: (error: DomainError) => void): void;
    onActionStored(callback: (event: IAmADomainEvent) => void): void;
    handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void): void;
    validateHypotheticalCommand(command: IAmACommand, onError: (error: DomainError) => void, callback?: (command: IAmACommand) => void): void;
    registerCommandHandler<T extends IAmACommandHandler>(commandHandler: {
        new (id?: string): T;
    }): void;
    registerCommandValidator<T extends CommandValidator>(commandValidator: {
        new (): T;
    }): void;
    registerView<T extends View>(view: {
        new (): View;
    }): void;
    subscribe(viewName: string, callback: (view: View) => void): void;
    subscribePage(page: Page, viewName: string, callback: (view: View) => void): void;
    unsubscribe(callback: (view: View) => void): void;
    getView(name: string): View;
    getStateReport(): StateReport;
    storeAction(event: IAmADomainEvent): void;
}
