import {IAmACommand} from "../interfaces/iamacommand";
import {IAmAnAction} from "../interfaces/iamanaction";
import {IAmACommandHandler} from "../interfaces/iamacommandhandler";
import {View} from "../objects/view";
import {DomainError} from "../objects/domainerror";
import {DomainService} from "../services/domainservice";
import {ActionStore} from "../services/actionstore";
import {ClockDate} from "../helpers/clock";
import {CommandValidator} from "../objects/commandvalidator";
import {StateReport} from "../objects/statereport";

class ViewSubscriber{
    constructor(public viewName: string, public callback: (view: View) => void){}
}

export class ApplicationService{
    private static _instance: ApplicationService;
    static get Instance(): ApplicationService{
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
    private _actionStore: ActionStore = new ActionStore();    
    private _domainService: DomainService = new DomainService(this._actionStore);
    private _domainErrorHandlers: ((error: DomainError) => void)[] = [];

    clear(){
        this._commandHandlerTypes = [];
        this._commandHandlers = [];
        this._viewTypes = [];
        this._views = [];
        this._viewSubscribers = [];
        this._actionStore = new ActionStore();
        this._domainService = new DomainService(this._actionStore);
        this._domainErrorHandlers = [];
    }

    constructor() {
        var self = this;
        self._actionStore.onActionStored((action) => {
            self._views.forEach((view: View) => {
                view.handle(action);
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

    replayActions(finalTime?: ClockDate){
        this.reset();
        this._actionStore.replayActions(finalTime);
    }

    hardReplayActions(finalTime?: ClockDate){
        this.reset();
        this._domainService.clearAggregateRoots();
    }

    onDomainError(callback: (error: DomainError) => void){
        this._domainErrorHandlers.push(callback);
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
        return new StateReport(this._actionStore.getAllActions());
    }

    storeAction(action: IAmAnAction){
        this._domainService.applyActionToAllAggregates(action);
        this._actionStore.storeAction(action);
    }
}