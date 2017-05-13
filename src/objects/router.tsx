import * as React from 'react';
import {ApplicationService} from "../services/applicationservice";
import {Page, PageProps, PageState} from "./page";
import {Route} from "./route";

export class RouterProps{
    applicationService: ApplicationService;    
}

export class RouterState{
    
}

export class Router extends React.Component<RouterProps, RouterState>{

    state: RouterState = {
        applicationService: ApplicationService.Instance
    }

    render(){
        return(
            <div>
                {
                    this.props.children
                }
            </div>
        )
    }
}