import {IAmADomainEvent} from "../interfaces/iamadomainevent";

export abstract class View{

    abstract name: string;

    abstract handle(event: IAmADomainEvent);
}