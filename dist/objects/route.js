"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var helpers_1 = require("../helpers/helpers");
var RouteProps = (function () {
    function RouteProps() {
    }
    return RouteProps;
}());
exports.RouteProps = RouteProps;
var instances = [];
var matchedInstance = null;
var currentPage = null;
var register = function (comp) { return instances.push(comp); };
var unregister = function (comp) { return instances.splice(instances.indexOf(comp), 1); };
var historyPush = function (path) {
    history.pushState({}, null, path);
    instances.forEach(function (instance) { return instance.forceUpdate(); });
};
var historyReplace = function (path) {
    history.replaceState({}, null, path);
    instances.forEach(function (instance) { return instance.forceUpdate(); });
};
var Route = (function (_super) {
    __extends(Route, _super);
    function Route(props) {
        return _super.call(this, props) || this;
    }
    Route.prototype.handlePop = function () {
        this.forceUpdate();
    };
    Route.prototype.componentWillMount = function () {
        var self = this;
        register(self);
        addEventListener("popstate", function () { return self.handlePop(); });
    };
    Route.prototype.componentWillUnMount = function () {
        var self = this;
        removeEventListener("popstate", function () { return self.handlePop(); });
        unregister(self);
    };
    Route.prototype.matchesPath = function () {
        var self = this;
        var match = helpers_1.matchPath(location.hash, { path: self.props.path, exact: true });
        if (match != null) {
            if (matchedInstance == this) {
                self.id = match.id;
                return true;
            }
            if (matchedInstance == null) {
                matchedInstance = self;
                self.id = match.id;
                return true;
            }
            if (matchedInstance != null) {
                if (!matchedInstance.matchesPath() || matchedInstance.props.path == "*") {
                    matchedInstance = self;
                    self.id = match.id;
                    return true;
                }
            }
            self.id = match.id;
            return true;
        }
        if (matchedInstance == this) {
            matchedInstance = null;
        }
        return false;
    };
    Route.prototype.firstRegistered = function () {
        return instances.some(function (i) { return i.matchesPath() != null; });
    };
    Route.prototype.render = function () {
        var self = this;
        self.matchesPath();
        return (React.createElement("div", null, (!(matchedInstance == self)) ? null :
            React.createElement(self.props.component, { ApplicationService: self._reactInternalInstance._hostParent._currentElement._owner._instance.props.applicationService, params: { id: self.id } })));
    };
    return Route;
}(React.Component));
exports.Route = Route;
var LinkProps = (function () {
    function LinkProps() {
    }
    return LinkProps;
}());
exports.LinkProps = LinkProps;
var Link = (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (e) {
            var to = _this.props.to;
            event.preventDefault();
            historyPush(to);
        };
        return _this;
    }
    Link.prototype.render = function () {
        var _this = this;
        var _a = this.props, to = _a.to, children = _a.children;
        return (React.createElement("a", { href: to, onClick: function (e) { return _this.handleClick(e); } }, children));
    };
    return Link;
}(React.Component));
exports.Link = Link;
//# sourceMappingURL=route.js.map