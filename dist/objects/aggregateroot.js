"use strict";
var guid_1 = require("../helpers/guid");
var AggregateRoot = (function () {
    function AggregateRoot(id) {
        this.ID = id || guid_1.Guid.newGuid();
    }
    AggregateRoot.prototype.attachEventStore = function (eventStore) {
        this._eventStore = eventStore;
    };
    AggregateRoot.prototype.storeEvent = function (event) {
        this.applyEvent(event);
        this._eventStore.storeEvent(event);
    };
    return AggregateRoot;
}());
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregateroot.js.map