/// <reference types="react" />
import * as React from 'react';
import { Page, PageProps } from "./page";
import { View } from "./view";
import { IAmADomainEvent } from "../interfaces/iamadomainevent";
export declare class RouteProps {
    path: string;
    component: new (props: PageProps) => Page;
}
export declare class Route extends React.Component<RouteProps, any> {
    props: RouteProps;
    private _reactInternalInstance;
    id: string;
    constructor(props: RouteProps);
    handlePop(): void;
    componentWillMount(): void;
    componentWillUnMount(): void;
    matchesPath(): boolean;
    firstRegistered(): boolean;
    render(): JSX.Element;
}
export declare class LinkProps {
    to: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
}
export declare class Link extends React.Component<LinkProps, null> {
    private _handleClick;
    render(): JSX.Element;
}
export declare class PageNavigationView extends View {
    name: string;
    handle(event: IAmADomainEvent): void;
}
