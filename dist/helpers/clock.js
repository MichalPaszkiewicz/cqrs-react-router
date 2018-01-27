"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// never set .toISOString!
var ClockDate = (function () {
    function ClockDate(year, month, day, hour, minutes, seconds, milliseconds) {
        if (hour === void 0) { hour = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (milliseconds === void 0) { milliseconds = 0; }
        var _this = this;
        this._clockDateStatusCheckFunc = function () { return true; };
        this._myDate = function () { return _this.Date; };
        this.getTimeZoneOffset = function () { return _this._myDate().getTimezoneOffset(); };
        this.getDate = function () { return _this._myDate().getDate(); };
        this.getDay = function () { return _this._myDate().getDay(); };
        this.getFullYear = function () { return _this._myDate().getFullYear(); };
        this.getHours = function () { return _this._myDate().getHours(); };
        this.getMilliseconds = function () { return _this._myDate().getMilliseconds(); };
        this.getMinutes = function () { return _this._myDate().getMinutes(); };
        this.getMonth = function () { return _this._myDate().getMonth(); };
        this.getSeconds = function () { return _this._myDate().getSeconds(); };
        this.getUTCDate = function () { return _this._myDate().getUTCDate(); };
        this.getUTCDay = function () { return _this._myDate().getUTCDay(); };
        this.getUTCFullYear = function () { return _this._myDate().getUTCFullYear(); };
        this.getUTCHours = function () { return _this._myDate().getUTCHours(); };
        this.getUTCMilliseconds = function () { return _this._myDate().getUTCMilliseconds(); };
        this.getUTCMinutes = function () { return _this._myDate().getUTCMinutes(); };
        this.getUTCMonth = function () { return _this._myDate().getUTCMonth(); };
        this.getUTCSeconds = function () { return _this._myDate().getUTCSeconds(); };
        this.Date = new Date(year, (month + 11) % 12, day, hour, minutes, seconds, milliseconds);
    }
    ClockDate.prototype.short = function () {
        return (this.Date.getDate()) + "/" + (this.Date.getMonth() + 1) + "/" + this.Date.getFullYear();
    };
    ClockDate.prototype.getTime = function () {
        return this._myDate().getTime();
    };
    ClockDate.prototype.isBefore = function (date) {
        return this.getTime() < date.getTime();
    };
    ClockDate.prototype.isAt = function (date) {
        return this.getTime() == date.getTime();
    };
    ClockDate.prototype.isAfter = function (date) {
        return this.getTime() > date.getTime();
    };
    ClockDate.prototype.addDays = function (days) {
        return ClockDate.fromTicks(this.getTime() + days * 24 * 60 * 60 * 1000);
    };
    ClockDate.prototype.addHours = function (hours) {
        return ClockDate.fromTicks(this.getTime() + hours * 60 * 60 * 1000);
    };
    ClockDate.prototype.addMinutes = function (minutes) {
        return ClockDate.fromTicks(this.getTime() + minutes * 60 * 1000);
    };
    ClockDate.prototype.addSeconds = function (seconds) {
        return ClockDate.fromTicks(this.getTime() + seconds * 1000);
    };
    ClockDate.prototype.addMilliSeconds = function (milliseconds) {
        return ClockDate.fromTicks(this.getTime() + milliseconds);
    };
    ClockDate.fromTicks = function (ticks) {
        var now = new Date(ticks);
        return new ClockDate(now.getFullYear(), (now.getMonth() + 1) % 12, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    };
    ClockDate.fromString = function (dateString) {
        return ClockDate.fromTicks(new Date(dateString).getTime());
    };
    return ClockDate;
}());
exports.ClockDate = ClockDate;
var ClockDateRange = (function () {
    function ClockDateRange(StartTime, EndTime) {
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this._isDateRange = true;
    }
    return ClockDateRange;
}());
exports.ClockDateRange = ClockDateRange;
var dateStrings = [
    "time",
    "date",
    "created"
];
function fixDates(item, additionalDateMatchStrings, customDateMatchStrings) {
    var tempDateStrings = [];
    if (additionalDateMatchStrings) {
        tempDateStrings = dateStrings.concat(additionalDateMatchStrings);
    }
    if (customDateMatchStrings) {
        tempDateStrings = additionalDateMatchStrings;
    }
    for (var property in item) {
        if (item.hasOwnProperty(property)) {
            if (item[property]._isDateRange) {
                fixDates(item[property]);
                return;
            }
            else if (dateStrings.some(function (ds) { return property.toLowerCase().indexOf(ds) > -1; })) {
                if (typeof (item[property]) == "string") {
                    // stringified date
                    item[property] = ClockDate.fromString(item[property]);
                    return;
                }
                if (typeof (item[property]) == "object") {
                    // parsed ClockDate
                    if (typeof (item[property]._clockDateStatusCheckFunc) == "function") {
                        return;
                    }
                    // could be date object
                    if (typeof (item[property].toISOString) == "function") {
                        item[property] = ClockDate.fromTicks(item[property].getTime());
                        return;
                    }
                    // unfixed ClockDate
                    item[property] = ClockDate.fromString(item[property].Date);
                }
            }
        }
    }
}
exports.fixDates = fixDates;
var Clock = (function () {
    function Clock() {
        this._timeDifference = 0;
    }
    Object.defineProperty(Clock, "Instance", {
        get: function () {
            if (Clock._instance == null) {
                Clock._instance = new Clock();
            }
            return Clock._instance;
        },
        enumerable: true,
        configurable: true
    });
    Clock.prototype.reset = function () {
        this._timeDifference = 0;
    };
    Clock.prototype.addDays = function (days) {
        this._timeDifference += days * 24 * 60 * 60 * 1000;
    };
    Clock.prototype.addHours = function (hours) {
        this._timeDifference += hours * 60 * 60 * 1000;
    };
    Clock.prototype.addMinutes = function (minutes) {
        this._timeDifference += minutes * 60 * 1000;
    };
    Clock.prototype.addSeconds = function (seconds) {
        this._timeDifference += seconds * 1000;
    };
    Clock.prototype.addMilliseconds = function (milliseconds) {
        this._timeDifference += milliseconds;
    };
    Clock.now = function () {
        return ClockDate.fromTicks(Date.now() + Clock.Instance._timeDifference);
    };
    return Clock;
}());
exports.Clock = Clock;
//# sourceMappingURL=clock.js.map