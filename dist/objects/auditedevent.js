"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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