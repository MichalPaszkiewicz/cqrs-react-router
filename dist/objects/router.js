"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var applicationservice_1 = require("../services/applicationservice");
var RouterProps = (function () {
    function RouterProps() {
    }
    return RouterProps;
}());
exports.RouterProps = RouterProps;
var RouterState = (function () {
    function RouterState() {
    }
    return RouterState;
}());
exports.RouterState = RouterState;
var Router = (function (_super) {
    __extends(Router, _super);
    function Router() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            applicationService: applicationservice_1.ApplicationService.Instance
        };
        return _this;
    }
    Router.prototype.render = function () {
        return (React.createElement("div", null, this.props.children));
    };
    return Router;
}(React.Component));
exports.Router = Router;
//# sourceMappingURL=router.js.map