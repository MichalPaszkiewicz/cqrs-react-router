"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var navigatetopage_1 = require("./navigatetopage");
var pagenavigationaggregate_1 = require("./pagenavigationaggregate");
var PageNavigationCommandHandler = (function () {
    function PageNavigationCommandHandler() {
        this.commandNames = [
            navigatetopage_1.NAVIGATE_TO_PAGE_COMMAND_NAME
        ];
    }
    PageNavigationCommandHandler.prototype.handle = function (command, domainService, callback) {
        switch (command.name) {
            case navigatetopage_1.NAVIGATE_TO_PAGE_COMMAND_NAME:
                var navigateToPage = command;
                domainService.getAggregateRoot(pagenavigationaggregate_1.PageNavigationAggregate, function (ar) {
                    ar.navigateToPage(navigateToPage);
                }, "Page navigation");
                return;
            default:
                return;
        }
    };
    return PageNavigationCommandHandler;
}());
exports.PageNavigationCommandHandler = PageNavigationCommandHandler;
//# sourceMappingURL=pagenavigationcommandhandler.js.map