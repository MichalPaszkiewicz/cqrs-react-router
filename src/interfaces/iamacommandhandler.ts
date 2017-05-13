import {IAmACommand} from "./iamacommand";
import {DomainService} from "../services/domainservice";

export interface IAmACommandHandler{
    commandNames: string[];

    handle(command: IAmACommand, domainService: DomainService, callback: (command: IAmACommand) => void): void;
}