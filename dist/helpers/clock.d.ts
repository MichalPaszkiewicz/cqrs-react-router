export declare class ClockDate {
    Date: Date;
    short(): string;
    getTime(): number;
    isBefore(date: ClockDate): boolean;
    isAfter(date: ClockDate): boolean;
    constructor(year: number, month: number, day: number, hour?: number, minutes?: number, seconds?: number, milliseconds?: number);
    static fromTicks(ticks: number): ClockDate;
}
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
