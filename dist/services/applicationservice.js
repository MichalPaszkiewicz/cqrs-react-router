"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._onCommandValidatedHandlers = [];
        this._onCommandHandledHandlers = [];
        this._preCommandValidatingHandlers = [];
        var self = this;
        self._eventStore.onEventStored(function (event) {
            self._views.forEach(function (view) {
                view.handle(event);
                self._viewSubscribers.filter(function (vs) { return vs.viewName == view.name; }).forEach(function (vs) {
                    vs.callback(view);
                });
            });
        });
        ApplicationService._instance = this;
    }
    Object.defineProperty(ApplicationService, "Instance", {
        get: function () {
            if (typeof window == "object") {
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
        this._onCommandValidatedHandlers = [];
        this._onCommandHandledHandlers = [];
        this._preCommandValidatingHandlers = [];
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
        this.reset();
        this._eventStore.replayEvents(finalTime, millisecondsInterval, true);
    };
    ApplicationService.prototype.replayEventsUpTo = function (domainEvent, millisecondsInterval, inclusive) {
        if (inclusive === void 0) { inclusive = true; }
        this.reset();
        this._eventStore.replayEventsUpTo(domainEvent, millisecondsInterval, false, inclusive);
    };
    ApplicationService.prototype.hardReplayEventsUpTo = function (domainEvent, millisecondsInterval, inclusive) {
        if (inclusive === void 0) { inclusive = true; }
        this._domainService.clearAggregateRoots();
        this.reset();
        this._eventStore.replayEventsUpTo(domainEvent, millisecondsInterval, true, inclusive);
    };
    ApplicationService.prototype.onDomainError = function (callback) {
        this._domainErrorHandlers.push(callback);
    };
    ApplicationService.prototype.preCommandValidated = function (callback) {
        this._preCommandValidatingHandlers.push(callback);
    };
    ApplicationService.prototype.onCommandValidated = function (callback) {
        this._onCommandValidatedHandlers.push(callback);
    };
    ApplicationService.prototype.onCommandHandled = function (callback) {
        this._onCommandHandledHandlers.push(callback);
    };
    ApplicationService.prototype.onEventStored = function (callback) {
        this._onEventStoredHandlers.push(callback);
    };
    ApplicationService.handleCommand = function (command, callback) {
        ApplicationService.Instance.handleCommand(command, callback);
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
        this._onCommandValidatedHandlers.forEach(function (ocvh) {
            ocvh(command);
        });
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
        this._onCommandHandledHandlers.forEach(function (ochh) {
            ochh(command);
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
    ApplicationService.prototype.storeEvent = function (event) {
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