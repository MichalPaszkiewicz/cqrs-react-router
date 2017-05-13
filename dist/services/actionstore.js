"use strict";
var ActionStore = (function () {
    function ActionStore() {
        this._actions = [];
        this._onActionStoredEvents = [];
    }
    ActionStore.prototype.storeAction = function (action) {
        this._actions.push(action);
        this._onActionStoredEvents.forEach(function (callback) {
            callback(action);
        });
    };
    ActionStore.prototype.onActionStored = function (callback) {
        this._onActionStoredEvents.push(callback);
        0;
    };
    ActionStore.prototype.clearOnActionStoredEvents = function () {
        this._onActionStoredEvents = [];
    };
    ActionStore.prototype.getActionsForID = function (id, callback) {
        callback(this._actions.filter(function (a) { return a.id == id; }));
    };
    return ActionStore;
}());
exports.ActionStore = ActionStore;
//# sourceMappingURL=actionstore.js.map