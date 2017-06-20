import { AggregateRoot } from "./aggregateroot";
import { IAmADomainEvent } from "../interfaces/iamadomainevent";
import { NavigateToPageCommand } from "./navigatetopage";
export declare class PageNavigationAggregate extends AggregateRoot {
    applyEvent(event: IAmADomainEvent): void;
    navigateToPage(command: NavigateToPageCommand): void;
}
