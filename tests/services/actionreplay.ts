import {EventStore} from "../../src/services/eventstore";
import {DomainService} from "../../src/services/domainservice";
import {AggregateRoot} from "../../src/objects/aggregateroot";
import {ApplicationService} from "../../src/services/applicationservice";
import {IAmACommandHandler} from "../../src/interfaces/iamacommandhandler";
import {IAmACommand} from "../../src/interfaces/iamacommand";
import {IAmADomainEvent} from "../../src/interfaces/iamadomainevent";
import {View} from "../../src/objects/view";
import {Clock} from "../../src/helpers/clock";

const COMMAND_NAME: string = "testCommand";

const TEST_EVENT_NAME = "testEvent";

class TestEvent implements IAmADomainEvent{
    name = TEST_EVENT_NAME;
    created=Clock.now();
    constructor(public aggregateID: string) {}
}

class TestCommand implements IAmACommand{
    name = COMMAND_NAME
}

test("event replay puts view in correct state", () => {

    ApplicationService.Instance.clear();

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(TestAggregateRoot, (ar) => {
                ar.doThatTestThing();
            });
        }
    }

    var aggregateActionsHandled = 0;

    class TestAggregateRoot extends AggregateRoot{
        applyEvent(event: IAmADomainEvent){
            aggregateActionsHandled++;
        }

        doThatTestThing(){
            this.storeEvent(new TestEvent("123"));
        }
    }


    var viewUpdateTriggers = 0;    

    const TEST_VIEW_NAME = "testView";

    class TestView extends View{
        name = TEST_VIEW_NAME;

        data = [1,2,3]

        actionsHandled = 0;

        handle(event: IAmADomainEvent){
            if(event.name == TEST_EVENT_NAME){
                viewUpdateTriggers++;
                this.actionsHandled++;
            }
        }
    }

    var testEventStore = new EventStore();
    var testDomainService = new DomainService(testEventStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerView(TestView)

    testApplicationService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.data.length).toBe(3);
        expect(view.data[0]).toBe(1);
        expect(view.actionsHandled).toBe(aggregateActionsHandled);
    });

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    testApplicationService.replayEvents(Clock.now().addMinutes(1));

    expect(viewUpdateTriggers).toBe(2);
});

test("action replay replays all with null time", () => {

    var aggregateActionsHandled = 0;

    class TestAggregateRoot extends AggregateRoot{
        applyEvent(event: IAmADomainEvent){
            aggregateActionsHandled++;
        }

        doThatTestThing(){
            this.storeEvent(new TestEvent("123"));
        }
    }

    ApplicationService.Instance.clear();

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

        handle(event: IAmADomainEvent){
            if(event.name == TEST_EVENT_NAME){
                viewUpdateTriggers++;
                this.actionsHandled++;
            }
        }
    }

    var testEventStore = new EventStore();
    var testDomainService = new DomainService(testEventStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerView(TestView)


    testApplicationService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.data.length).toBe(3);
        expect(view.data[0]).toBe(1);
        expect(view.actionsHandled).toBe(aggregateActionsHandled);
    });

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    testApplicationService.replayEvents();

    expect(viewUpdateTriggers).toBe(2);
});