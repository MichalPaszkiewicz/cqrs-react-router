export class DomainError extends Error{
    isADomainError = true;

    constructor(public message: string){
        super(message);
        this.name = "DomainError";
        this.stack = (<any> new Error()).stack;
    }

}