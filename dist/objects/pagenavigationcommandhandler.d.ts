import { IAmACommandHandler } from "../interfaces/iamacommandhandler";
import { IAmACommand } from "../interfaces/iamacommand";
import { DomainService } from "../services/domainservice";
export declare class PageNavigationCommandHandler implements IAmACommandHandler {
    commandNames: string[];
    handle(command: IAmACommand, domainService: DomainService, callback: (command: IAmACommand) => void): void;
}
