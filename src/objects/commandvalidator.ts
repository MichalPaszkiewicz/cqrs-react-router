import {IAmACommand} from "../interfaces/iamacommand";
import {View} from "../objects/view";

export abstract class CommandValidator{
    abstract commandNames: string[];    

    getViewByName(name: string, viewCallBack: (view: View) => void){}

    abstract validate(command: IAmACommand): void;
}