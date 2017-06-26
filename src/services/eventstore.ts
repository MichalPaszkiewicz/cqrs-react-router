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

    replayEvents(finalTime?: ClockDate, millisecondsInterval?: number, hardReplay: boolean = false){
        var self = this;
        var eventsToReplay = self._events.filter((event) => {
            return finalTime == null 
                || event.created == null   
                || event.created.isBefore(finalTime);
        })
        
        function replayEvent(index){

            self._onEventStoredEvents.forEach((callback) => {
                callback(eventsToReplay[index])
            })

            if(index + 1 == eventsToReplay.length){
                return;
            }

            if(millisecondsInterval){
                setTimeout(() => replayEvent(index + 1), millisecondsInterval);
            }
            else{
                replayEvent(index + 1);
            }
        }

        replayEvent(0);

        if(hardReplay){
            self._events = eventsToReplay;
        }
    }

    replayEventsUpTo(domainEvent: IAmADomainEvent, millisecondsInterval?: number, hardReplay: boolean = false, inclusive: boolean = true){
        var self = this;

        var replayedEvents: IAmADomainEvent[] = [];
        
        function replayEvent(index){

            if((!inclusive) && (self._events[index] == domainEvent)){
                if(hardReplay){
                    self._events = replayedEvents;
                }
                return;
            }

            self._onEventStoredEvents.forEach((callback) => {
                callback(self._events[index]);
            });

            replayedEvents.push(self._events[index]);

            if(self._events[index] == domainEvent){
                if(hardReplay){
                    self._events = replayedEvents;
                }
                return;
            }

            if(millisecondsInterval){
                setTimeout(() => replayEvent(index + 1), millisecondsInterval);
            }
            else{
                replayEvent(index + 1);
            }
        }
        replayEvent(0);
    }

    onEventStored(callback: (event: IAmADomainEvent) => void){
        this._onEventStoredEvents.push(callback);
    }   

    removeOnEventStoredEvent(callback: (event: IAmADomainEvent) => void){
        this._onEventStoredEvents = this._onEventStoredEvents.filter((oese) => oese != callback);
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