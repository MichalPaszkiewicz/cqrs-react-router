"use strict";
var clock_1 = require("../helpers/clock");
var DatedAction = (function () {
    function DatedAction() {
        this.created = clock_1.Clock.now();
    }
    return DatedAction;
}());
exports.DatedAction = DatedAction;
//# sourceMappingURL=datedaction.js.map