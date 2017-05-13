import * as React from 'react';
import {ApplicationService} from "../services/applicationservice";

export class PageProps{
    ApplicationService: ApplicationService;
    params?: {id: string};
}

export class PageState{

}

export class Page extends React.Component<PageProps, PageState>{
    constructor(props: PageProps){
        super(props);
    }
}