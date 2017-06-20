import {IAmACommandHandler} from "../interfaces/iamacommandhandler";
import {IAmACommand} from "../interfaces/iamacommand";
import {DomainService} from "../services/domainservice";
import {NavigateToPageCommand, NAVIGATE_TO_PAGE_COMMAND_NAME} from "./navigatetopage";
import {PageNavigationAggregate} from "./pagenavigationaggregate";

export class PageNavigationCommandHandler implements IAmACommandHandler{
    commandNames = [
        NAVIGATE_TO_PAGE_COMMAND_NAME
    ]

    handle(command: IAmACommand, domainService: DomainService, callback: (command: IAmACommand) => void){
        switch(command.name){
            case NAVIGATE_TO_PAGE_COMMAND_NAME:
                var navigateToPage = command as NavigateToPageCommand;
                domainService.getAggregateRoot(PageNavigationAggregate, (ar) => {
                    ar.navigateToPage(navigateToPage);
                }, "Page navigation");
                return;
            default: 
                return;
        }
    }
}