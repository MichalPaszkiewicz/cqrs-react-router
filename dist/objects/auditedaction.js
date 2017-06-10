"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var datedaction_1 = require("./datedaction");
var clock_1 = require("../helpers/clock");
var AuditedAction = (function (_super) {
    __extends(AuditedAction, _super);
    function AuditedAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.created = clock_1.Clock.now();
        return _this;
    }
    return AuditedAction;
}(datedaction_1.DatedAction));
exports.AuditedAction = AuditedAction;
//# sourceMappingURL=auditedaction.js.map