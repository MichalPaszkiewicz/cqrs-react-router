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
    ActionStore.prototype.replayActions = function (finalTime) {
        var self = this;
        self._actions.filter(function (action) {
            return finalTime == null
                || action.created == null
                || action.created.isBefore(finalTime);
        }).forEach(function (action) {
            self._onActionStoredEvents.forEach(function (callback) {
                callback(action);
            });
        });
    };
    ActionStore.prototype.onActionStored = function (callback) {
        this._onActionStoredEvents.push(callback);
    };
    ActionStore.prototype.clearOnActionStoredEvents = function () {
        this._onActionStoredEvents = [];
    };
    ActionStore.prototype.getActionsForID = function (id, callback) {
        callback(this._actions.filter(function (a) { return a.aggregateID == id; }));
    };
    ActionStore.prototype.getAllActions = function () {
        return this._actions;
    };
    return ActionStore;
}());
exports.ActionStore = ActionStore;
//# sourceMappingURL=actionstore.js.map