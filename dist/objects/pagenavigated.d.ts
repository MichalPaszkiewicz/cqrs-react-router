import { DatedEvent } from "./datedevent";
export declare var PAGE_NAVIGATED_EVENT_NAME: string;
export declare class PageNavigatedEvent extends DatedEvent {
    destination: string;
    name: string;
    aggregateID: string;
    constructor(destination: string);
}
