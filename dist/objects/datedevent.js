"use strict";
var clock_1 = require("../helpers/clock");
var DatedEvent = (function () {
    function DatedEvent() {
        this.created = clock_1.Clock.now();
    }
    return DatedEvent;
}());
exports.DatedEvent = DatedEvent;
//# sourceMappingURL=datedevent.js.map