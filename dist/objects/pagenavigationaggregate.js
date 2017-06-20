"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aggregateroot_1 = require("./aggregateroot");
var pagenavigated_1 = require("./pagenavigated");
var PageNavigationAggregate = (function (_super) {
    __extends(PageNavigationAggregate, _super);
    function PageNavigationAggregate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageNavigationAggregate.prototype.applyEvent = function (event) {
        switch (event.name) {
            //no need to do anything here
            default:
                return;
        }
    };
    PageNavigationAggregate.prototype.navigateToPage = function (command) {
        var self = this;
        self.storeEvent(new pagenavigated_1.PageNavigatedEvent(command.destination));
    };
    return PageNavigationAggregate;
}(aggregateroot_1.AggregateRoot));
exports.PageNavigationAggregate = PageNavigationAggregate;
//# sourceMappingURL=pagenavigationaggregate.js.map