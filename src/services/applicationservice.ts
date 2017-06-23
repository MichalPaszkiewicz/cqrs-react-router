import {IAmACommand} from "../interfaces/iamacommand";
import {IAmADomainEvent} from "../interfaces/iamadomainevent";
import {IAmACommandHandler} from "../interfaces/iamacommandhandler";
import {View} from "../objects/view";
import {DomainError} from "../objects/domainerror";
import {DomainService} from "../services/domainservice";
import {EventStore} from "../services/eventstore";
import {ClockDate} from "../helpers/clock";
import {CommandValidator} from "../objects/commandvalidator";
import {StateReport} from "../objects/statereport";
import {Page} from "../objects/page";

class ViewSubscriber{
    constructor(public viewName: string, public callback: (view: View) => void){}
}

export class ApplicationService{
    private static _instance: ApplicationService;
    static get Instance(): ApplicationService{
        if(window){
            var appPublicString = "_cqrs_ApplicationService";
            if(!window[appPublicString]){
                window[appPublicString] = new ApplicationService();
            }
            return window[appPublicString];
        }
        if(ApplicationService._instance == null){
            ApplicationService._instance = new ApplicationService();
        }
        return ApplicationService._instance;
    }

    private _commandHandlerTypes: {new(): IAmACommandHandler}[] = [];
    private _commandHandlers: IAmACommandHandler[] = [];
    private _commandValidatorTypes: {new(): CommandValidator}[] = [];
    private _commandValidators: CommandValidator[] = [];
    private _viewTypes: {new(): View}[] = [];
    private _views: View[] = [];
    private _viewSubscribers: ViewSubscriber[] = [];
    private _eventStore: EventStore = new EventStore();    
    private _domainService: DomainService = new DomainService(this._eventStore);
    private _domainErrorHandlers: ((error: DomainError) => void)[] = [];
    private _onEventStoredHandlers: ((event: IAmADomainEvent) => void)[] = [];
    private _onCommandValidatedHandlers: ((command: IAmACommand) => void)[] = [];

    clear(){
        this._commandHandlerTypes = [];
        this._commandHandlers = [];
        this._viewTypes = [];
        this._views = [];
        this._viewSubscribers = [];
        this._eventStore = new EventStore();
        this._domainService = new DomainService(this._eventStore);
        this._domainErrorHandlers = [];
        this._onEventStoredHandlers = [];
        this._onCommandValidatedHandlers = [];
    }

    constructor() {
        var self = this;
        self._eventStore.onEventStored((event) => {
            self._views.forEach((view: View) => {
                view.handle(event);
                self._viewSubscribers.filter((vs) => vs.viewName == view.name).forEach((vs) => {
                    vs.callback(view);
                })
            });
        });

        ApplicationService._instance = this;
    }

    reset(){
        var self = this;
        self._views = [];
        self._viewTypes.forEach((viewType) => {
            self._views.push(new viewType());
        });
    }

    replayEvents(finalTime?: ClockDate, millisecondsInterval?: number){
        this.reset();
        this._eventStore.replayEvents(finalTime, millisecondsInterval);
    }

    hardReplayEvents(finalTime?: ClockDate, millisecondsInterval?: number){
        this._domainService.clearAggregateRoots();
        this.reset();
        this._eventStore.replayEvents(finalTime, millisecondsInterval, true);
    }

    onDomainError(callback: (error: DomainError) => void){
        this._domainErrorHandlers.push(callback);
    }

    onCommandValidated(callback: (command: IAmACommand) => void){
        this._onCommandValidatedHandlers.push(callback);
    }

    onEventStored(callback: (event: IAmADomainEvent) => void){
        this._onEventStoredHandlers.push(callback);
    }

    static handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void){
        ApplicationService.Instance.handleCommand(command, callback);
    }

    handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void){
        var self = this;

        try{
            self._commandValidators
                .filter((cv) => cv.commandNames.some((cn) => cn == command.name))
                .forEach((cv) => cv.validate(command));
        }
        catch(error){
            if(error.isADomainError && self._domainErrorHandlers.length > 0){
                self._domainErrorHandlers.forEach((deh) => {
                    deh(error as DomainError);
                }); 
                return;
            }
        }

        this._onCommandValidatedHandlers.forEach((ocvh) => {
            ocvh(command);
        });

        var commandHandlersOfName = self._commandHandlers.filter((ch) => ch.commandNames.some((cn) => cn == command.name));

        if(commandHandlersOfName.length == 0){
            throw new DomainError(`no command handler registered for command of name "${command.name}"`);
        }

        var handlersCount = commandHandlersOfName.length;

        commandHandlersOfName.forEach((ch) =>{
            try{
                ch.handle(command, self._domainService,  () => {
                    handlersCount--;

                    if(handlersCount == 0){
                        if(callback){
                            callback(command);
                        }
                    }                
                });
            }
            catch(error){
                if(error.isADomainError && self._domainErrorHandlers.length > 0){
                    self._domainErrorHandlers.forEach((deh) => {
                        deh(error as DomainError);
                    }); 
                }
                else{
                    throw error;
                }
            }
        });
    }

    validateHypotheticalCommand(command: IAmACommand, onError: (error: DomainError) => void, callback?: (command: IAmACommand) => void){
        var self = this;
        var tempEventStore = new EventStore();
        var tempDomainService = new DomainService(tempEventStore);
        var tempCommandValidators = self._commandValidatorTypes.map((cvt) => new cvt());
        var tempCommandHandlers = self._commandHandlerTypes.map((cht) => new cht());

        try{
            tempCommandValidators
                .filter((cv) => cv.commandNames.some((cn) => cn == command.name))
                .forEach((cv) => cv.validate(command));

            var commandHandlersOfName = tempCommandHandlers.filter((ch) => ch.commandNames.some((cn) => cn == command.name));

            if(commandHandlersOfName.length == 0){
                throw new DomainError(`no command handler registered for command of name "${command.name}"`);
            }

            var handlersCount = commandHandlersOfName.length;

            commandHandlersOfName.forEach((ch) =>{
                ch.handle(command, tempDomainService,  () => {
                    handlersCount--;

                    if(handlersCount == 0){
                        if(callback){
                            callback(command);
                        }
                    }                
                });
            });
        }
        catch(error){
            if(error.isADomainError){
                onError(error as DomainError);
                return;
            }
        }
    }

    registerCommandHandler<T extends IAmACommandHandler>(commandHandler: {new(id?: string): T}){
        if(this._commandHandlerTypes.some((cht) => cht == commandHandler)){
            throw new DomainError("A command handler of this type has already been added");        
        }
        this._commandHandlerTypes.push(commandHandler);
        this._commandHandlers.push(new commandHandler());
    }

    registerCommandValidator<T extends CommandValidator>(commandValidator: {new(): T}){
        var self = this;
        if(self._commandValidatorTypes.some((cv) => cv == commandValidator)){
            throw new DomainError("This command validator has already been registered");
        }
        self._commandValidatorTypes.push(commandValidator);
        var newCommandValidator = new commandValidator();
        newCommandValidator.getViewByName = (name: string, viewCallBack: (view: View) => void) => {
            self._views.forEach((v) => {
                if(v.name == name){
                    viewCallBack(v);
                }
            })
        }
        self._commandValidators.push(newCommandValidator);
    }

    registerView<T extends View>(view: {new(): View}){
        this._viewTypes.push(view);
        var newView = new view();
        this._views.push(newView);

        this._viewSubscribers.filter((vs) => vs.viewName == newView.name).forEach((vs) => {
            vs.callback(newView);
        });
        
    }

    subscribe(viewName: string, callback:(view: View) => void){
        this._viewSubscribers.push(new ViewSubscriber(viewName, callback));

        this._views.filter((v) => v.name == viewName).forEach((v) => {
            callback(v);
        });
    }

    subscribePage(page: Page, viewName: string, callback:(view: View) => void){
        var myApp = this;
        page["componentDidMount"] = () => myApp.subscribe(viewName, callback);
        page["componentWillUnmount"] = () => myApp.unsubscribe(callback);
    }

    unsubscribe(callback:(view: View) => void){
        this._viewSubscribers = this._viewSubscribers.filter((vs) => vs.callback != callback);
    }

    getView(name: string): View{
        var viewsOfName = this._views.filter((v) => v.name == name);

        if(viewsOfName.length == 0){
            throw new DomainError(`no view registered with the name "${name}"`)
        }

        return viewsOfName[0];
    }

    getStateReport(): StateReport{
        return new StateReport(this._eventStore.getAllEvents());
    }

    storeEvent(event: IAmADomainEvent){
        this._domainService.applyEventToAllAggregates(event);
        this._eventStore.storeEvent(event);
        this._onEventStoredHandlers.forEach((callback) => {
            callback(event);
        });
    }
}