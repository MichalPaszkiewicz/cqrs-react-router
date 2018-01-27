import {ClockDate, Clock, fixDates, ClockDateRange} from "../../src/helpers/clock";

test("now is correct current time for clock", () => {
    Clock.Instance.reset();
    var firstNow = new Date();
    var testNow = Clock.now();
    var lastNow = new Date();

    expect(firstNow.getTime()).toBeLessThanOrEqual(testNow.getTime());

    expect(testNow.getTime()).toBeLessThanOrEqual(lastNow.getTime());
});

test("ClockDate comparison functions correctly check time differences", () => {
    Clock.Instance.reset();

    var firstNow = Clock.now();

    setTimeout(() => {
        var secondNow = Clock.now();

        expect(firstNow.isBefore(secondNow)).toBeTruthy();
        expect(secondNow.isBefore(firstNow)).toBeFalsy();

        expect(secondNow.isAfter(firstNow)).toBeTruthy();
        expect(firstNow.isAfter(secondNow)).toBeFalsy();
        
    }, 10);
});

test("fromTicks doesn't change a datetime", () => {

    var testDate = new Date();
    var testClockDate = ClockDate.fromTicks(testDate.getTime());

    expect(testClockDate.getTime()).toBe(testDate.getTime());
});

test("ClockDate short method gives british format date string", () => {

    var testDate = new ClockDate(2018, 2, 1);

    expect(testDate.short()).toBe("1/2/2018");

});

test("clock allows day change", () => {
    Clock.Instance.reset();

    var now = Date.now();

    setTimeout(() => {
        Clock.Instance.addDays(-1);

        expect(Clock.now().getTime()).toBeLessThan(now);
    }, 10)
});

test("clock allows hour change", () => {
    Clock.Instance.reset();

    var now = Date.now();

    setTimeout(() => {
        Clock.Instance.addHours(-1);

        expect(Clock.now().getTime()).toBeLessThan(now);
    }, 10)
});

test("clock allows minute change", () => {
    Clock.Instance.reset();

    var now = Date.now();

    setTimeout(() => {
        Clock.Instance.addMinutes(-1);

        expect(Clock.now().getTime()).toBeLessThan(now);
    }, 10)
});

test("clock allows second change", () => {
    Clock.Instance.reset();

    var now = Date.now();

    setTimeout(() => {
        Clock.Instance.addSeconds(-1);

        expect(Clock.now().getTime()).toBeLessThan(now);
    }, 10)
});

test("clock allows millisecond change", () => {
    Clock.Instance.reset();

    var now = Date.now();

    setTimeout(() => {
        Clock.Instance.addMilliseconds(-100);

        expect(Clock.now().getTime()).toBeLessThan(now);
    }, 10)
});

test("fix date gets date from string", () => {
    var date = new Date();
    var stringDate: any = JSON.parse(JSON.stringify(date));

    var clockDate = ClockDate.fromTicks(date.getTime());

    var testObject = {date: stringDate};
    fixDates(testObject);

    expect(clockDate.isAt(testObject.date)).toBe(true);
});

test("fix date gets date from ClockDate", () => {
    var date = Clock.now();

    var testObject = {time: ClockDate.fromTicks(date.getTime())};
    fixDates(testObject);

    expect(date.isAt(testObject.time)).toBe(true);
});

test("fix date fixes object with clock date stringified, then parsed", () => {
    var date = Clock.now();

    var testObject = {time: date};
    var stringTestObject = JSON.stringify(testObject);
    var parsedTestObject = JSON.parse(stringTestObject);

    fixDates(parsedTestObject);

    expect(date.isAt(parsedTestObject.time)).toBe(true);
});

test("fix date fixes clockdate range", () => {
    var range = new ClockDateRange(Clock.now(), Clock.now().addHours(1));

    var testObject = {time: range};
    var stringTestObject = JSON.stringify(testObject);
    var parsedTestObject = JSON.parse(stringTestObject);

    fixDates(parsedTestObject);

    expect(range.StartTime.isAt(parsedTestObject.time.StartTime)).toBe(true);
    expect(range.EndTime.isAt(parsedTestObject.time.EndTime)).toBe(true);
});