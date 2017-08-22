import * as React from 'react';
import {matchPath} from "../helpers/helpers";
import {Page, PageProps, PageState} from "./page";
import {ApplicationService} from "../services/applicationservice";
import {View} from "./view";
import {PAGE_NAVIGATED_EVENT_NAME, PageNavigatedEvent} from "./pagenavigated";
import {IAmADomainEvent} from "../interfaces/iamadomainevent";
import {PageNavigationCommandHandler} from "./pagenavigationcommandhandler";
import {NavigateToPageCommand} from "./navigatetopage";

export class RouteProps{
    path: string;
    component: new(props: PageProps) => Page;
}

let instances: Route[] = []
let matchedInstance: Route = null
let currentPage: Route = null;

const register = (comp) => instances.push(comp);
const unregister = (comp) => instances.splice(instances.indexOf(comp), 1);

const historyPush = (path) => {
  history.pushState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const historyReplace = (path) => {
  history.replaceState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

export class Route extends React.Component<RouteProps, any>{
    props: RouteProps;
    private _reactInternalInstance: any;
    id: string;

    constructor(props: RouteProps){
        super(props);
        var self = this;

        var eventListener = () => self.handlePop();

        self["componentDidMount"] = () => {
            register(self);     
            addEventListener("popstate", eventListener);
        }

        self["componentWillUnMount"] = () => {
            removeEventListener("popstate", eventListener);
            unregister(self);                                    
        }
    }

    handlePop(){
        this.forceUpdate();
    }

    matchesPath(){
        var self = this;
        var match = matchPath(location.hash, {path: self.props.path, exact: true});

        if(match != null){
            if(matchedInstance == this){
                self.id = match.id
                return true;
            }

            if(matchedInstance == null){
                matchedInstance = self;
                self.id = match.id
                return true;
            }

            if(matchedInstance != null){
                if(!matchedInstance.matchesPath() || matchedInstance.props.path == "*"){
                    matchedInstance = self;
                    self.id = match.id
                    return true;
                }
            }
            self.id = match.id
            return true;
        }

        if(matchedInstance == this){
            matchedInstance = null;
        }

        return false;
    }

    firstRegistered(){
        return instances.some((i) => i.matchesPath() != null)
    }

    render(){
        var self = this;
        self.matchesPath();           
        
        return(
            <div>
                {
                    (!(matchedInstance == self)) ? null :
                    <self.props.component 
                        ApplicationService={self._reactInternalInstance._hostParent._currentElement._owner._instance.props.applicationService}
                        params={{id: self.id}} />
                }
            </div>
        )
    }
}

export class LinkProps{
    to: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
}

export class Link extends React.Component<LinkProps, null>{
    private _handleClick = (e) => {
        var self = this;
        if(self.props.onClick){
            self.props.onClick(e);
        }
        e.preventDefault()
        if(self.props.to){
            ApplicationService.Instance.handleCommand(new NavigateToPageCommand(self.props.to));
        }
    }
    render(){
        const {to, children} = this.props;

        return (
            <a className={this.props.className + " cqrs-link"} style={{cursor:"pointer"}} onClick={(e) => this._handleClick(e)}>
                {children}
            </a>
        )
    }
}

export class PageNavigationView extends View{
    name = "Page navigation view";
    
    handle(event: IAmADomainEvent){
        switch(event.name){
            case PAGE_NAVIGATED_EVENT_NAME:
                var pageNavigated = event as PageNavigatedEvent;
                historyPush(pageNavigated.destination);
                return;
            default:
                return;
        }
    }
}

ApplicationService.Instance.registerCommandHandler(PageNavigationCommandHandler);
ApplicationService.Instance.registerView(PageNavigationView);