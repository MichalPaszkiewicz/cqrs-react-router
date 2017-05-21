export class ClockDate{
    Date: Date;

    short(){
        return (this.Date.getDate()) + "/" + (this.Date.getMonth() + 1) + "/" + this.Date.getFullYear();
    }

    getTime(){
        return this.Date.getTime();
    }

    isBefore(date: ClockDate): boolean{
        return this.getTime() < date.getTime();
    }

    isAfter(date: ClockDate): boolean{
        return this.getTime() > date.getTime();
    }

    addDays(days): ClockDate{
        this.Date.setTime(this.getTime() + days * 24 * 60 * 60 * 1000)

        return this;
    }

    addHours(hours: number): ClockDate{
        this.Date.setTime(this.getTime() + hours * 60 * 60 *1000)

        return this;
    }

    addMinutes(minutes: number): ClockDate{
        this.Date.setTime(this.getTime() + minutes * 60 * 1000);

        return this;
    }

    addSeconds(seconds: number): ClockDate{
        this.Date.setTime(this.getTime() + seconds * 1000);

        return this;
    }

    addMilliSeconds(milliseconds: number): ClockDate{
        this.Date.setTime(this.getTime() + milliseconds);

        return this;
    }

    constructor(year: number, month: number, day: number, hour: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0){
        this.Date = new Date(year, (month + 11) % 12, day, hour, minutes, seconds, milliseconds);
    }

    static fromTicks(ticks: number){
        var now = new Date(ticks);
        return new ClockDate(now.getFullYear(), (now.getMonth() + 1) % 12, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
}

export class Clock{

    private static _instance: Clock;

    private _timeDifference: number = 0;

    static get Instance() : Clock{
        if(Clock._instance == null){
            Clock._instance = new Clock();
        }
        return Clock._instance;
    }

    reset(){
        this._timeDifference = 0;
    }

    addDays(days: number){
        this._timeDifference += days * 24 * 60 * 60 * 1000;
    }

    addHours(hours: number){
        this._timeDifference += hours * 60 * 60 * 1000;
    }

    addMinutes(minutes: number){
        this._timeDifference += minutes * 60 * 1000;
    }

    addSeconds(seconds: number){
        this._timeDifference += seconds * 1000;
    }

    addMilliseconds(milliseconds: number){
        this._timeDifference += milliseconds;
    }

    static now(){
        return ClockDate.fromTicks(Date.now() + Clock.Instance._timeDifference);
    }
        
}