"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomainService = (function () {
    function DomainService(eventStore) {
        this._aggregateRoots = [];
        this._eventStore = eventStore;
    }
    DomainService.prototype.getAggregateRoot = function (c, callback, id) {
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter(function (ar) {
            return ar.ID === id;
        });
        if (similarAggregateRoots.length == 0) {
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachEventStore(self._eventStore);
            // replay all actions for this Aggregate Root in the action store
            self._eventStore.getEventsForID(id, function (actions) {
                actions.forEach(function (action) { return newAggregateRoot.applyEvent(action); });
            });
            self._aggregateRoots.push(newAggregateRoot);
            callback(newAggregateRoot);
            return;
        }
        callback(similarAggregateRoots[0]);
    };
    DomainService.prototype.applyEventToAllAggregates = function (event) {
        this._aggregateRoots.forEach(function (ar) {
            ar.applyEvent(event);
        });
    };
    DomainService.prototype.clearAggregateRoots = function () {
        this._aggregateRoots = [];
    };
    return DomainService;
}());
exports.DomainService = DomainService;
//# sourceMappingURL=domainservice.js.map