import {ActionStore} from "../../src/services/actionstore";
import {DomainService} from "../../src/services/domainservice";
import {AggregateRoot} from "../../src/objects/aggregateroot";
import {ApplicationService} from "../../src/services/applicationservice";
import {IAmACommandHandler} from "../../src/interfaces/iamacommandhandler";
import {IAmACommand} from "../../src/interfaces/iamacommand";
import {IAmAnAction} from "../../src/interfaces/iamanaction";
import {View} from "../../src/objects/view";
import {Clock} from "../../src/helpers/clock";

const COMMAND_NAME: string = "testCommand";

const TEST_ACTION_NAME = "testAction";

class TestAction implements IAmAnAction{
    name = TEST_ACTION_NAME;
    created=Clock.now();
    constructor(public id: string) {}
}

class TestAggregateRoot extends AggregateRoot{
    applyAction(action: IAmAnAction){

    }

    doThatTestThing(){
        this.storeAction(new TestAction("123"));
    }
}

class TestCommand implements IAmACommand{
    name = COMMAND_NAME
}

test("action replay puts view in correct state", () => {

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(TestAggregateRoot, (ar) => {
                ar.doThatTestThing();
            });
        }
    }

    var viewUpdateTriggers = 0;    

    const TEST_VIEW_NAME = "testView";

    class TestView extends View{
        name = TEST_VIEW_NAME;

        data = [1,2,3]

        actionsHandled = 0;

        handle(action: IAmAnAction){
            if(action.name == TEST_ACTION_NAME){
                viewUpdateTriggers++;
                this.actionsHandled++;
            }
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerView(TestView)


    testApplicationService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.data.length).toBe(3);
        expect(view.data[0]).toBe(1);
        expect(view.actionsHandled).toBe(1);
    });

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    testApplicationService.replayActions(Clock.now().addMinutes(1));

    expect(viewUpdateTriggers).toBe(2);
});

test("action replay replays all with null time", () => {

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(TestAggregateRoot, (ar) => {
                ar.doThatTestThing();
            });
        }
    }

    var viewUpdateTriggers = 0;    

    const TEST_VIEW_NAME = "testView";

    class TestView extends View{
        name = TEST_VIEW_NAME;

        data = [1,2,3]

        actionsHandled = 0;

        handle(action: IAmAnAction){
            if(action.name == TEST_ACTION_NAME){
                viewUpdateTriggers++;
                this.actionsHandled++;
            }
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerView(TestView)


    testApplicationService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.data.length).toBe(3);
        expect(view.data[0]).toBe(1);
        expect(view.actionsHandled).toBe(1);
    });

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    testApplicationService.replayActions();

    expect(viewUpdateTriggers).toBe(2);
});