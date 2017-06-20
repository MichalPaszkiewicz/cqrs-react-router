import {AggregateRoot} from "./aggregateroot";
import {IAmADomainEvent} from "../interfaces/iamadomainevent";
import {NavigateToPageCommand} from "./navigatetopage";
import {PageNavigatedEvent} from "./pagenavigated";

export class PageNavigationAggregate extends AggregateRoot{
    applyEvent(event: IAmADomainEvent){
        switch(event.name){
            //no need to do anything here
            default:
                return;
        }
    }

    navigateToPage(command: NavigateToPageCommand){
        var self = this;
        self.storeEvent(new PageNavigatedEvent(command.destination));
    }
}