export declare class ClockDate {
    Date: Date;
    _clockDateStatusCheckFunc: () => boolean;
    short(): string;
    private _myDate;
    getTimeZoneOffset: () => number;
    getDate: () => number;
    getDay: () => number;
    getFullYear: () => number;
    getHours: () => number;
    getMilliseconds: () => number;
    getMinutes: () => number;
    getMonth: () => number;
    getSeconds: () => number;
    getUTCDate: () => number;
    getUTCDay: () => number;
    getUTCFullYear: () => number;
    getUTCHours: () => number;
    getUTCMilliseconds: () => number;
    getUTCMinutes: () => number;
    getUTCMonth: () => number;
    getUTCSeconds: () => number;
    getTime(): number;
    isBefore(date: ClockDate): boolean;
    isAt(date: ClockDate): boolean;
    isAfter(date: ClockDate): boolean;
    addDays(days: any): ClockDate;
    addHours(hours: number): ClockDate;
    addMinutes(minutes: number): ClockDate;
    addSeconds(seconds: number): ClockDate;
    addMilliSeconds(milliseconds: number): ClockDate;
    constructor(year: number, month: number, day: number, hour?: number, minutes?: number, seconds?: number, milliseconds?: number);
    static fromTicks(ticks: number): ClockDate;
    static fromString(dateString: string): ClockDate;
}
export declare class ClockDateRange {
    StartTime: ClockDate;
    EndTime: ClockDate;
    _isDateRange: boolean;
    constructor(StartTime: ClockDate, EndTime: ClockDate);
}
export declare function fixDates(item: any, additionalDateMatchStrings?: string[], customDateMatchStrings?: boolean): void;
export declare class Clock {
    private static _instance;
    private _timeDifference;
    static readonly Instance: Clock;
    reset(): void;
    addDays(days: number): void;
    addHours(hours: number): void;
    addMinutes(minutes: number): void;
    addSeconds(seconds: number): void;
    addMilliseconds(milliseconds: number): void;
    static now(): ClockDate;
}
