"use strict";
var domainerror_1 = require("../objects/domainerror");
var domainservice_1 = require("../services/domainservice");
var eventstore_1 = require("../services/eventstore");
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
        this._eventStore = new eventstore_1.EventStore();
        this._domainService = new domainservice_1.DomainService(this._eventStore);
        this._domainErrorHandlers = [];
        this._onEventStoredHandlers = [];
        var self = this;
        self._eventStore.onEventStored(function (action) {
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
        this._eventStore = new eventstore_1.EventStore();
        this._domainService = new domainservice_1.DomainService(this._eventStore);
        this._domainErrorHandlers = [];
        this._onEventStoredHandlers = [];
    };
    ApplicationService.prototype.reset = function () {
        var self = this;
        self._views = [];
        self._viewTypes.forEach(function (viewType) {
            self._views.push(new viewType());
        });
    };
    ApplicationService.prototype.replayEvents = function (finalTime, millisecondsInterval) {
        this.reset();
        this._eventStore.replayEvents(finalTime, millisecondsInterval);
    };
    ApplicationService.prototype.hardReplayEvents = function (finalTime, millisecondsInterval) {
        this._domainService.clearAggregateRoots();
        this.replayEvents(finalTime, millisecondsInterval);
    };
    ApplicationService.prototype.onDomainError = function (callback) {
        this._domainErrorHandlers.push(callback);
    };
    ApplicationService.prototype.onActionStored = function (callback) {
        this._onEventStoredHandlers.push(callback);
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
    ApplicationService.prototype.validateHypotheticalCommand = function (command, onError, callback) {
        var self = this;
        var tempEventStore = new eventstore_1.EventStore();
        var tempDomainService = new domainservice_1.DomainService(tempEventStore);
        var tempCommandValidators = self._commandValidatorTypes.map(function (cvt) { return new cvt(); });
        var tempCommandHandlers = self._commandHandlerTypes.map(function (cht) { return new cht(); });
        try {
            tempCommandValidators
                .filter(function (cv) { return cv.commandNames.some(function (cn) { return cn == command.name; }); })
                .forEach(function (cv) { return cv.validate(command); });
            var commandHandlersOfName = tempCommandHandlers.filter(function (ch) { return ch.commandNames.some(function (cn) { return cn == command.name; }); });
            if (commandHandlersOfName.length == 0) {
                throw new domainerror_1.DomainError("no command handler registered for command of name \"" + command.name + "\"");
            }
            var handlersCount = commandHandlersOfName.length;
            commandHandlersOfName.forEach(function (ch) {
                ch.handle(command, tempDomainService, function () {
                    handlersCount--;
                    if (handlersCount == 0) {
                        if (callback) {
                            callback(command);
                        }
                    }
                });
            });
        }
        catch (error) {
            if (error.isADomainError) {
                onError(error);
                return;
            }
        }
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
    ApplicationService.prototype.subscribePage = function (page, viewName, callback) {
        var myApp = this;
        page["componentDidMount"] = function () { return myApp.subscribe(viewName, callback); };
        page["componentWillUnmount"] = function () { return myApp.unsubscribe(callback); };
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
        return new statereport_1.StateReport(this._eventStore.getAllEvents());
    };
    ApplicationService.prototype.storeAction = function (event) {
        this._domainService.applyEventToAllAggregates(event);
        this._eventStore.storeEvent(event);
        this._onEventStoredHandlers.forEach(function (callback) {
            callback(event);
        });
    };
    return ApplicationService;
}());
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=applicationservice.js.map