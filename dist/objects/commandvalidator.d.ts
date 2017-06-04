import { IAmACommand } from "../interfaces/iamacommand";
import { View } from "../objects/view";
export declare abstract class CommandValidator {
    abstract commandNames: string[];
    getViewByName(name: string, viewCallBack: (view: View) => void): void;
    abstract validate(command: IAmACommand): void;
}
