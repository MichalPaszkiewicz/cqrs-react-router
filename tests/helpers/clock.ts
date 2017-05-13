import {ClockDate, Clock} from "../../src/helpers/clock";

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