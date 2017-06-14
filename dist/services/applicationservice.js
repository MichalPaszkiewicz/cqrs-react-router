"use strict";
var domainerror_1 = require("../objects/domainerror");
var domainservice_1 = require("../services/domainservice");
var actionstore_1 = require("../services/actionstore");
var statereport_1 = require("../objects/statereport");
var ViewSubscriber = (function () {
    function ViewSubscriber(viewName, callback) {
        this.viewName = viewName;
        this.callback = callback;
    }
    return ViewSubscriber;
}());
var ApplicationService = (function () {
    function ApplicationService() {
        this._commandHandlerTypes = [];
        this._commandHandlers = [];
        this._commandValidatorTypes = [];
        this._commandValidators = [];
        this._viewTypes = [];
        this._views = [];
        this._viewSubscribers = [];
        this._actionStore = new actionstore_1.ActionStore();
        this._domainService = new domainservice_1.DomainService(this._actionStore);
        this._domainErrorHandlers = [];
        this._onActionStoredHandlers = [];
        var self = this;
        self._actionStore.onActionStored(function (action) {
            self._views.forEach(function (view) {
                view.handle(action);
                self._viewSubscribers.filter(function (vs) { return vs.viewName == view.name; }).forEach(function (vs) {
                    vs.callback(view);
                });
            });
        });
        ApplicationService._instance = this;
    }
    Object.defineProperty(ApplicationService, "Instance", {
        get: function () {
            if (window) {
                var appPublicString = "_cqrs_ApplicationService";
                if (!window[appPublicString]) {
                    window[appPublicString] = new ApplicationService();
                }
                return window[appPublicString];
            }
            if (ApplicationService._instance == null) {
                ApplicationService._instance = new ApplicationService();
            }
            return ApplicationService._instance;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationService.prototype.clear = function () {
        this._commandHandlerTypes = [];
        this._commandHandlers = [];
        this._viewTypes = [];
        this._views = [];
        this._viewSubscribers = [];
        this._actionStore = new actionstore_1.ActionStore();
        this._domainService = new domainservice_1.DomainService(this._actionStore);
        this._domainErrorHandlers = [];
        this._onActionStoredHandlers = [];
    };
    ApplicationService.prototype.reset = function () {
        var self = this;
        self._views = [];
        self._viewTypes.forEach(function (viewType) {
            self._views.push(new viewType());
        });
    };
    ApplicationService.prototype.replayActions = function (finalTime) {
        this.reset();
        this._actionStore.replayActions(finalTime);
    };
    ApplicationService.prototype.hardReplayActions = function (finalTime) {
        this.reset();
        this._domainService.clearAggregateRoots();
    };
    ApplicationService.prototype.onDomainError = function (callback) {
        this._domainErrorHandlers.push(callback);
    };
    ApplicationService.prototype.onActionStored = function (callback) {
        this._onActionStoredHandlers.push(callback);
    };
    ApplicationService.prototype.handleCommand = function (command, callback) {
        var self = this;
        try {
            self._commandValidators
                .filter(function (cv) { return cv.commandNames.some(function (cn) { return cn == command.name; }); })
                .forEach(function (cv) { return cv.validate(command); });
        }
        catch (error) {
            if (error.isADomainError && self._domainErrorHandlers.length > 0) {
                self._domainErrorHandlers.forEach(function (deh) {
                    deh(error);
                });
                return;
            }
        }
        var commandHandlersOfName = self._commandHandlers.filter(function (ch) { return ch.commandNames.some(function (cn) { return cn == command.name; }); });
        if (commandHandlersOfName.length == 0) {
            throw new domainerror_1.DomainError("no command handler registered for command of name \"" + command.name + "\"");
        }
        var handlersCount = commandHandlersOfName.length;
        commandHandlersOfName.forEach(function (ch) {
            try {
                ch.handle(command, self._domainService, function () {
                    handlersCount--;
                    if (handlersCount == 0) {
                        if (callback) {
                            callback(command);
                        }
                    }
                });
            }
            catch (error) {
                if (error.isADomainError && self._domainErrorHandlers.length > 0) {
                    self._domainErrorHandlers.forEach(function (deh) {
                        deh(error);
                    });
                }
                else {
                    throw error;
                }
            }
        });
    };
    ApplicationService.prototype.registerCommandHandler = function (commandHandler) {
        if (this._commandHandlerTypes.some(function (cht) { return cht == commandHandler; })) {
            throw new domainerror_1.DomainError("A command handler of this type has already been added");
        }
        this._commandHandlerTypes.push(commandHandler);
        this._commandHandlers.push(new commandHandler());
    };
    ApplicationService.prototype.registerCommandValidator = function (commandValidator) {
        var self = this;
        if (self._commandValidatorTypes.some(function (cv) { return cv == commandValidator; })) {
            throw new domainerror_1.DomainError("This command validator has already been registered");
        }
        self._commandValidatorTypes.push(commandValidator);
        var newCommandValidator = new commandValidator();
        newCommandValidator.getViewByName = function (name, viewCallBack) {
            self._views.forEach(function (v) {
                if (v.name == name) {
                    viewCallBack(v);
                }
            });
        };
        self._commandValidators.push(newCommandValidator);
    };
    ApplicationService.prototype.registerView = function (view) {
        this._viewTypes.push(view);
        var newView = new view();
        this._views.push(newView);
        this._viewSubscribers.filter(function (vs) { return vs.viewName == newView.name; }).forEach(function (vs) {
            vs.callback(newView);
        });
    };
    ApplicationService.prototype.subscribe = function (viewName, callback) {
        this._viewSubscribers.push(new ViewSubscriber(viewName, callback));
        this._views.filter(function (v) { return v.name == viewName; }).forEach(function (v) {
            callback(v);
        });
    };
    ApplicationService.prototype.unsubscribe = function (callback) {
        this._viewSubscribers = this._viewSubscribers.filter(function (vs) { return vs.callback != callback; });
    };
    ApplicationService.prototype.getView = function (name) {
        var viewsOfName = this._views.filter(function (v) { return v.name == name; });
        if (viewsOfName.length == 0) {
            throw new domainerror_1.DomainError("no view registered with the name \"" + name + "\"");
        }
        return viewsOfName[0];
    };
    ApplicationService.prototype.getStateReport = function () {
        return new statereport_1.StateReport(this._actionStore.getAllActions());
    };
    ApplicationService.prototype.storeAction = function (action) {
        this._domainService.applyActionToAllAggregates(action);
        this._actionStore.storeAction(action);
        this._onActionStoredHandlers.forEach(function (callback) {
            callback(action);
        });
    };
    return ApplicationService;
}());
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=applicationservice.js.map