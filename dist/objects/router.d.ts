/// <reference types="react" />
import * as React from 'react';
import { ApplicationService } from "../services/applicationservice";
export declare class RouterProps {
    applicationService: ApplicationService;
}
export declare class RouterState {
}
export declare class Router extends React.Component<RouterProps, RouterState> {
    state: RouterState;
    render(): JSX.Element;
}
