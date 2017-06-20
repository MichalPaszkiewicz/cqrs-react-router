import { IAmACommand } from "../interfaces/iamacommand";
export declare var NAVIGATE_TO_PAGE_COMMAND_NAME: string;
export declare class NavigateToPageCommand implements IAmACommand {
    destination: string;
    name: string;
    constructor(destination: string);
}
