"use strict";
var DomainService = (function () {
    function DomainService(actionStore) {
        this._aggregateRoots = [];
        this._actionStore = actionStore;
    }
    DomainService.prototype.getAggregateRoot = function (c, callback, id) {
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter(function (ar) {
            return ar.ID === id;
        });
        if (similarAggregateRoots.length == 0) {
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachActionStore(self._actionStore);
            // replay all actions for this Aggregate Root in the action store
            self._actionStore.getActionsForID(id, function (actions) {
                actions.forEach(function (action) { return newAggregateRoot.applyAction(action); });
            });
            self._aggregateRoots.push(newAggregateRoot);
            callback(newAggregateRoot);
            return;
        }
        callback(similarAggregateRoots[0]);
    };
    DomainService.prototype.applyActionToAllAggregates = function (action) {
        this._aggregateRoots.forEach(function (ar) {
            ar.applyAction(action);
        });
    };
    DomainService.prototype.clearAggregateRoots = function () {
        this._aggregateRoots = [];
    };
    return DomainService;
}());
exports.DomainService = DomainService;
//# sourceMappingURL=domainservice.js.map