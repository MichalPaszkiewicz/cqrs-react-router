"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var datedevent_1 = require("./datedevent");
var clock_1 = require("../helpers/clock");
var AuditedEvent = (function (_super) {
    __extends(AuditedEvent, _super);
    function AuditedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.created = clock_1.Clock.now();
        return _this;
    }
    return AuditedEvent;
}(datedevent_1.DatedEvent));
exports.AuditedEvent = AuditedEvent;
//# sourceMappingURL=auditedevent.js.map