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
    EventStore.prototype.replayEvents = function (finalTime) {
        var self = this;
        self._events.filter(function (event) {
            return finalTime == null
                || event.created == null
                || event.created.isBefore(finalTime);
        }).forEach(function (event) {
            self._onEventStoredEvents.forEach(function (callback) {
                callback(event);
            });
        });
    };
    EventStore.prototype.onEventStored = function (callback) {
        this._onEventStoredEvents.push(callback);
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