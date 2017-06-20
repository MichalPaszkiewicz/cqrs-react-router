import {DatedEvent} from "./datedevent";

export var PAGE_NAVIGATED_EVENT_NAME = "Page navigated";

export class PageNavigatedEvent extends DatedEvent{
    name = PAGE_NAVIGATED_EVENT_NAME;
    aggregateID = "Page navigation";

    constructor(public destination: string){
        super();
    }
}