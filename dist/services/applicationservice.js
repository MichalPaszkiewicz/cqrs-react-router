"use strict";
var domainerror_1 = require("../objects/domainerror");
var domainservice_1 = require("../services/domainservice");
var actionstore_1 = require("../services/actionstore");
var ViewSubscriber = (function () {
    function ViewSubscriber(viewName, callback) {
        this.viewName = viewName;
        this.callback = callback;
    }
    return ViewSubscriber;
}());
var ApplicationService = (function () {
    function ApplicationService() {
        this._commandHandlers = [];
        this._views = [];
        this._viewSubscribers = [];
        this._actionStore = new actionstore_1.ActionStore();
        this._domainService = new domainservice_1.DomainService(this._actionStore);
        var self = this;
        self._actionStore.onActionStored(function (action) {
            self._views.forEach(function (view) {
                view.handle(action);
                self._viewSubscribers.filter(function (vs) { return vs.viewName == view.name; }).forEach(function (vs) {
                    vs.callback(view);
                });
            });
        });
    }
    Object.defineProperty(ApplicationService, "Instance", {
        get: function () {
            if (ApplicationService._instance == null) {
                ApplicationService._instance = new ApplicationService();
            }
            return ApplicationService._instance;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationService.prototype.handleCommand = function (command, callback) {
        var self = this;
        var commandHandlersOfName = self._commandHandlers.filter(function (ch) { return ch.commandNames.some(function (cn) { return cn == command.name; }); });
        if (commandHandlersOfName.length == 0) {
            throw new domainerror_1.DomainError("no command handler registered for command of name \"" + command.name + "\"");
        }
        var handlersCount = commandHandlersOfName.length;
        commandHandlersOfName.forEach(function (ch) {
            ch.handle(command, self._domainService, function () {
                handlersCount--;
                if (handlersCount == 0) {
                    if (callback) {
                        callback(command);
                    }
                }
            });
        });
    };
    ApplicationService.prototype.registerCommandHandler = function (commandHandler) {
        this._commandHandlers.push(new commandHandler());
    };
    ApplicationService.prototype.registerView = function (view) {
        this._views.push(new view());
    };
    ApplicationService.prototype.subscribe = function (viewName, callback) {
        this._viewSubscribers.push(new ViewSubscriber(viewName, callback));
    };
    ApplicationService.prototype.getView = function (name) {
        var viewsOfName = this._views.filter(function (v) { return v.name == name; });
        if (viewsOfName.length == 0) {
            throw new domainerror_1.DomainError("no view registered with the name \"" + name + "\"");
        }
        return viewsOfName[0];
    };
    return ApplicationService;
}());
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=applicationservice.js.map