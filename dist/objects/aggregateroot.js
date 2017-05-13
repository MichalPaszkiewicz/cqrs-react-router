"use strict";
var guid_1 = require("../helpers/guid");
var AggregateRoot = (function () {
    function AggregateRoot(id) {
        this.ID = id || guid_1.Guid.newGuid();
    }
    AggregateRoot.prototype.attachActionStore = function (actionStore) {
        this._actionStore = actionStore;
    };
    return AggregateRoot;
}());
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregateroot.js.map