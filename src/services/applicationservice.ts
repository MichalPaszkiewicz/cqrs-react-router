import {IAmACommand} from "../interfaces/iamacommand";
import {IAmAnAction} from "../interfaces/iamanaction";
import {IAmACommandHandler} from "../interfaces/iamacommandhandler";
import {View} from "../objects/view";
import {DomainError} from "../objects/domainerror";
import {DomainService} from "../services/domainservice";
import {ActionStore} from "../services/actionstore";
import {ClockDate} from "../helpers/clock";

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

    private _commandHandlers: IAmACommandHandler[] = [];
    private _viewTypes: {new(): View}[] = [];
    private _views: View[] = [];
    private _viewSubscribers: ViewSubscriber[] = [];
    private _actionStore: ActionStore = new ActionStore();    
    private _domainService: DomainService = new DomainService(this._actionStore);

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

    handleCommand(command: IAmACommand, callback?: (command: IAmACommand) => void){
        var self = this;

        var commandHandlersOfName = self._commandHandlers.filter((ch) => ch.commandNames.some((cn) => cn == command.name));

        if(commandHandlersOfName.length == 0){
            throw new DomainError(`no command handler registered for command of name "${command.name}"`);
        }

        var handlersCount = commandHandlersOfName.length;

        commandHandlersOfName.forEach((ch) =>{
            ch.handle(command, self._domainService,  () => {
                handlersCount--;

                if(handlersCount == 0){
                    if(callback){
                        callback(command);
                    }
                }                
            });
        });
    }

    registerCommandHandler<T extends IAmACommandHandler>(commandHandler: {new(id?: string): T}){
        this._commandHandlers.push(new commandHandler());
    }

    registerView<T extends View>(view: {new(): View}){
        this._viewTypes.push(view);
        this._views.push(new view());
    }

    subscribe(viewName: string, callback:(view: View) => void){
        this._viewSubscribers.push(new ViewSubscriber(viewName, callback));
    }

    getView(name: string): View{
        var viewsOfName = this._views.filter((v) => v.name == name);

        if(viewsOfName.length == 0){
            throw new DomainError(`no view registered with the name "${name}"`)
        }

        return viewsOfName[0];
    }

    storeAction(action: IAmAnAction){
        this._domainService.applyActionToAllAggregates(action);
        this._actionStore.storeAction(action);
    }
}