import {IAmADomainEvent} from "../interfaces/iamadomainevent";
import {ClockDate} from "../helpers/clock";

export class EventStore{

    private _events: IAmADomainEvent[] = [];
    private _onEventStoredEvents: ((event: IAmADomainEvent) => void)[] = [];

    storeEvent(event: IAmADomainEvent){
        this._events.push(event);
        this._onEventStoredEvents.forEach((callback) => {
            callback(event);
        })
    }

    replayEvents(finalTime?: ClockDate){
        var self = this;
        self._events.filter((event) => {
            return finalTime == null 
                || event.created == null   
                || event.created.isBefore(finalTime);
        }).forEach((event) => {
            self._onEventStoredEvents.forEach((callback) => {
                callback(event);
            });
        }); 
    }

    onEventStored(callback: (event: IAmADomainEvent) => void){
        this._onEventStoredEvents.push(callback);
    }

    clearOnEventStoredEvents(){
        this._onEventStoredEvents = [];
    }

    getEventsForID(id: string, callback: (events: IAmADomainEvent[]) => void){
        callback(this._events.filter(a => a.aggregateID == id));
    }

    getAllEvents(){
        return this._events;
    }
}