import {IAmACommand} from "../interfaces/iamacommand";

export var NAVIGATE_TO_PAGE_COMMAND_NAME = "Navigate to page";

export class NavigateToPageCommand implements IAmACommand{
    name = NAVIGATE_TO_PAGE_COMMAND_NAME;

    constructor(public destination: string){

    }
}