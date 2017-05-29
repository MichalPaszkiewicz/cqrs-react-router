import * as React from 'react';
import {matchPath} from "../helpers/helpers";
import {Page, PageProps, PageState} from "./page";
import {ApplicationService} from "../services/applicationservice";

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
    }

    handlePop(){
        this.forceUpdate();
    }

    componentWillMount(){
        var self = this;
        register(self);     
        addEventListener("popstate", () => self.handlePop());
    }

    componentWillUnMount(){
        var self = this;
        removeEventListener("popstate", () => self.handlePop());
        unregister(self);                        
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
        const {to} = this.props
        if(this.props.onClick){
            this.props.onClick(e);
        }
        event.preventDefault()
        historyPush(to);
    }
    render(){
        const {to, children} = this.props;

        return (
            <a className={this.props.className} href={to} onClick={(e) => this._handleClick(e)}>
                {children}
            </a>
        )
    }
}