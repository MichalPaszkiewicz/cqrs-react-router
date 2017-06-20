"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var datedevent_1 = require("./datedevent");
exports.PAGE_NAVIGATED_EVENT_NAME = "Page navigated";
var PageNavigatedEvent = (function (_super) {
    __extends(PageNavigatedEvent, _super);
    function PageNavigatedEvent(destination) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.name = exports.PAGE_NAVIGATED_EVENT_NAME;
        _this.aggregateID = "Page navigation";
        return _this;
    }
    return PageNavigatedEvent;
}(datedevent_1.DatedEvent));
exports.PageNavigatedEvent = PageNavigatedEvent;
//# sourceMappingURL=pagenavigated.js.map