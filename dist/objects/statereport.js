"use strict";
var StateReport = (function () {
    function StateReport(actions) {
        this.actions = actions;
        this.url = window.location.href;
        this.hash = window.location.hash;
    }
    StateReport.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return StateReport;
}());
exports.StateReport = StateReport;
//# sourceMappingURL=statereport.js.map