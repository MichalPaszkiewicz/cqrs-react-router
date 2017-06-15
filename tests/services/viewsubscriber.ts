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
const TEST_ACTION_NAME = "testAction";
const TEST_VIEW_NAME = "testView";

class TestAction implements IAmADomainEvent{
    name = TEST_ACTION_NAME;
    created=Clock.now();
    constructor(public aggregateID: string) {
                        
    }
}

class TestAggregateRoot extends AggregateRoot{
    applyEvent(action: IAmADomainEvent){

    }

    doThatTestThing(){
        this.storeEvent(new TestAction("123"));
    }
}

class TestCommand implements IAmACommand{
    name = COMMAND_NAME
}

class TestView extends View{
    name = TEST_VIEW_NAME;

    handle(action: IAmADomainEvent){

    }
}

test("initial subscription to view updates subscriber", () => {
    var testAppService = new ApplicationService();

    testAppService.registerView(TestView);

    const callback = jest.fn();

    testAppService.subscribe(TEST_VIEW_NAME, callback);

    testAppService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.name).toBe(TEST_VIEW_NAME);
    });

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);
});

test("initial subscription to view does not update subscriber until view is registered", () => {
    var testAppService = new ApplicationService();

    const callback = jest.fn();

    testAppService.subscribe(TEST_VIEW_NAME, callback);

    testAppService.subscribe(TEST_VIEW_NAME, (view: TestView) => {
        expect(view.name).toBe(TEST_VIEW_NAME);
    });

    expect(callback).toHaveBeenCalledTimes(0);
    expect(callback.mock.calls.length).toBe(0);

    testAppService.registerView(TestView);

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);
});

test("allow unsubscribing from view", () => {
    var testAppService = new ApplicationService();

    const callback = jest.fn();

    testAppService.subscribe(TEST_VIEW_NAME, callback);
    testAppService.unsubscribe(callback);

    testAppService.registerView(TestView);        

    expect(callback.mock.calls.length).toBe(0);
});