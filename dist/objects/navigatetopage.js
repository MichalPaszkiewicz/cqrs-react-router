"use strict";
exports.NAVIGATE_TO_PAGE_COMMAND_NAME = "Navigate to page";
var NavigateToPageCommand = (function () {
    function NavigateToPageCommand(destination) {
        this.destination = destination;
        this.name = exports.NAVIGATE_TO_PAGE_COMMAND_NAME;
    }
    return NavigateToPageCommand;
}());
exports.NavigateToPageCommand = NavigateToPageCommand;
//# sourceMappingURL=navigatetopage.js.map