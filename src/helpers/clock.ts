// never set .toISOString!
export class ClockDate{
    Date: Date;

    _clockDateStatusCheckFunc = () => true;

    short(){
        return (this.Date.getDate()) + "/" + (this.Date.getMonth() + 1) + "/" + this.Date.getFullYear();
    }

    private _myDate = () => this.Date;

    getTimeZoneOffset = () => this._myDate().getTimezoneOffset();

    getDate = () => this._myDate().getDate();
    getDay = () => this._myDate().getDay();
    getFullYear = () => this._myDate().getFullYear();
    getHours = () => this._myDate().getHours();
    getMilliseconds = () => this._myDate().getMilliseconds();
    getMinutes = () => this._myDate().getMinutes();
    getMonth = () => this._myDate().getMonth();
    getSeconds = () => this._myDate().getSeconds();

    getUTCDate = () => this._myDate().getUTCDate();
    getUTCDay = () => this._myDate().getUTCDay();
    getUTCFullYear = () => this._myDate().getUTCFullYear();
    getUTCHours = () => this._myDate().getUTCHours();
    getUTCMilliseconds = () => this._myDate().getUTCMilliseconds();    
    getUTCMinutes = () => this._myDate().getUTCMinutes();
    getUTCMonth = () => this._myDate().getUTCMonth();
    getUTCSeconds = () => this._myDate().getUTCSeconds();

    getTime(){
        return this._myDate().getTime();
    }

    isBefore(date: ClockDate): boolean{
        return this.getTime() < date.getTime();
    }

    isAt(date: ClockDate): boolean{
        return this.getTime() == date.getTime();
    }

    isAfter(date: ClockDate): boolean{
        return this.getTime() > date.getTime();
    }

    addDays(days): ClockDate{
        return ClockDate.fromTicks(this.getTime() + days * 24 * 60 * 60 * 1000);
    }

    addHours(hours: number): ClockDate{
        return ClockDate.fromTicks(this.getTime() + hours * 60 * 60 *1000)
    }

    addMinutes(minutes: number): ClockDate{
        return ClockDate.fromTicks(this.getTime() + minutes * 60 * 1000);
    }

    addSeconds(seconds: number): ClockDate{
        return ClockDate.fromTicks(this.getTime() + seconds * 1000);
    }

    addMilliSeconds(milliseconds: number): ClockDate{
        return ClockDate.fromTicks(this.getTime() + milliseconds);
    }

    constructor(year: number, month: number, day: number, hour: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0){
        this.Date = new Date(year, (month + 11) % 12, day, hour, minutes, seconds, milliseconds);
    }

    static fromTicks(ticks: number){
        var now = new Date(ticks);
        return new ClockDate(now.getFullYear(), (now.getMonth() + 1) % 12, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }

    static fromString(dateString: string){
        return ClockDate.fromTicks(new Date(dateString).getTime());
    }
}

export class ClockDateRange{
    _isDateRange = true;

    constructor(public StartTime: ClockDate, public EndTime: ClockDate){

    }
}

var dateStrings = [
    "time",
    "date",
    "created"
]

export function fixDates(item: any, additionalDateMatchStrings?: string[], customDateMatchStrings?: boolean){
    var tempDateStrings = [];
    if(additionalDateMatchStrings){
        tempDateStrings = dateStrings.concat(additionalDateMatchStrings);
    }
    if(customDateMatchStrings){
        tempDateStrings = additionalDateMatchStrings;
    }

    for (var property in item) {
        if (item.hasOwnProperty(property)) {
            if(item[property]._isDateRange){
                fixDates(item[property]);
                return;
            }
            else if(dateStrings.some((ds) => property.toLowerCase().indexOf(ds) > -1)){
                if(typeof(item[property]) == "string"){
                    // stringified date
                    item[property] = ClockDate.fromString(item[property]);
                    return;
                }
                if(typeof(item[property]) == "object"){
                    // parsed ClockDate
                    if(typeof(item[property]._clockDateStatusCheckFunc) == "function"){
                        return;
                    }
                    // could be date object
                    if(typeof(item[property].toISOString) == "function"){
                        item[property] = ClockDate.fromTicks(item[property].getTime());
                        return;
                    }
                    // unfixed ClockDate
                    item[property] = ClockDate.fromString(item[property].Date)
                }
            }
        }
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