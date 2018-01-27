"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = require("../helpers/guid");
var AggregateRoot = (function () {
    function AggregateRoot(id) {
        this.ID = id || guid_1.Guid.newGuid();
    }
    AggregateRoot.prototype.attachEventStore = function (eventStore) {
        this._eventStore = eventStore;
    };
    AggregateRoot.prototype.storeEvent = function (event) {
        var self = this;
        self.applyEvent(event);
        //custom apply methods
        var fixedEventName = event.name.toLowerCase().replace(/ /g, '');
        var keys = [];
        for (var key in self) {
            keys.push(key);
        }
        keys.filter(function (p) { return typeof (self[p]) == "function"; })
            .filter(function (p) { return p.toLowerCase().indexOf("apply") > -1; })
            .filter(function (p) { return p.toLowerCase().indexOf(fixedEventName) > -1; })
            .forEach(function (p) {
            self[p](event);
        });
        self._eventStore.storeEvent(event);
    };
    return AggregateRoot;
}());
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregateroot.js.map