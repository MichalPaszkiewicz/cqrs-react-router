import { IAmACommand } from "./iamacommand";
import { DomainService } from "../services/domainservice";
import { View } from "../objects/view";
export interface IAmACommandHandler {
    commandNames: string[];
    handle(command: IAmACommand, domainService: DomainService, callback: (command: IAmACommand) => void, getViewByName?: (name: string, viewCallBack: (view: View) => void) => void): void;
}
