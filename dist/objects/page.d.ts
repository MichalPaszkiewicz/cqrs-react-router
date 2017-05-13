/// <reference types="react" />
import * as React from 'react';
import { ApplicationService } from "../services/applicationservice";
export declare class PageProps {
    ApplicationService: ApplicationService;
    params?: {
        id: string;
    };
}
export declare class PageState {
}
export declare class Page extends React.Component<PageProps, PageState> {
    constructor(props: PageProps);
}
