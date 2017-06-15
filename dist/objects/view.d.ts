import { IAmADomainEvent } from "../interfaces/iamadomainevent";
export declare abstract class View {
    abstract name: string;
    abstract handle(event: IAmADomainEvent): any;
}
