export class DomainError extends Error{

    constructor(public message: string){
        super(message);
        this.name = "DomainError";
        this.stack = (<any> new Error()).stack;
    }

}