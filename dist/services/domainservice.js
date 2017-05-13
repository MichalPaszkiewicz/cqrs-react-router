"use strict";
var DomainService = (function () {
    function DomainService(actionStore) {
        this._aggregateRoots = [];
        this._actionStore = actionStore;
    }
    DomainService.prototype.getAggregateRoot = function (c, callback, id) {
        var self = this;
        var similarAggregateRoots = self._aggregateRoots.filter(function (ar) {
            ar.ID == id;
        });
        if (similarAggregateRoots.length == 0) {
            var newAggregateRoot = new c(id);
            newAggregateRoot.attachActionStore(self._actionStore);
            self._aggregateRoots.push(newAggregateRoot);
            callback(newAggregateRoot);
            return;
        }
        callback(similarAggregateRoots[0]);
    };
    return DomainService;
}());
exports.DomainService = DomainService;
//# sourceMappingURL=domainservice.js.map