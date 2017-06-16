"use strict";
var EventStore = (function () {
    function EventStore() {
        this._events = [];
        this._onEventStoredEvents = [];
    }
    EventStore.prototype.storeEvent = function (event) {
        this._events.push(event);
        this._onEventStoredEvents.forEach(function (callback) {
            callback(event);
        });
    };
    EventStore.prototype.replayEvents = function (finalTime, millisecondsInterval) {
        var self = this;
        var eventsToReplay = self._events.filter(function (event) {
            return finalTime == null
                || event.created == null
                || event.created.isBefore(finalTime);
        });
        function replayEvent(index) {
            self._onEventStoredEvents.forEach(function (callback) {
                callback(eventsToReplay[index]);
            });
            if (index + 1 == eventsToReplay.length) {
                return;
            }
            if (millisecondsInterval) {
                setTimeout(function () { return replayEvent(index + 1); }, millisecondsInterval);
            }
            else {
                replayEvent(index + 1);
            }
        }
        replayEvent(0);
    };
    EventStore.prototype.onEventStored = function (callback) {
        this._onEventStoredEvents.push(callback);
    };
    EventStore.prototype.removeOnEventStoredEvent = function (callback) {
        this._onEventStoredEvents = this._onEventStoredEvents.filter(function (oese) { return oese != callback; });
    };
    EventStore.prototype.clearOnEventStoredEvents = function () {
        this._onEventStoredEvents = [];
    };
    EventStore.prototype.getEventsForID = function (id, callback) {
        callback(this._events.filter(function (a) { return a.aggregateID == id; }));
    };
    EventStore.prototype.getAllEvents = function () {
        return this._events;
    };
    return EventStore;
}());
exports.EventStore = EventStore;
//# sourceMappingURL=eventstore.js.map