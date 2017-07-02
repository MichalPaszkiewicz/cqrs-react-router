"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateReport = (function () {
    function StateReport(events) {
        this.events = events;
        if (typeof (window) == "object") {
            this.url = window.location.href;
            this.hash = window.location.hash;
        }
    }
    StateReport.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return StateReport;
}());
exports.StateReport = StateReport;
//# sourceMappingURL=statereport.js.map