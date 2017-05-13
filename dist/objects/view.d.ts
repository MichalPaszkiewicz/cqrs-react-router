import { IAmAnAction } from "../interfaces/iamanaction";
export declare abstract class View {
    abstract name: string;
    abstract handle(action: IAmAnAction): any;
}
