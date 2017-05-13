import {IAmAnAction} from "../interfaces/iamanaction";

export abstract class View{

    abstract name: string;

    abstract handle(action: IAmAnAction);
}