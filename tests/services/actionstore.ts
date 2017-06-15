import { IAmADomainEvent } from "../../src/interfaces/iamadomainevent";
import { EventStore } from "../../src/services/eventstore";
import {Clock} from "../../src/helpers/clock";

class TestAction implements IAmADomainEvent{
    name="testAction";
    created=Clock.now();
    constructor(public aggregateID: string){

    }
}

test("action store retains an action correctly", () => {
    var aggregateID = "123";
    var testAction = new TestAction(aggregateID);

    var testActionStore = new EventStore();

    testActionStore.storeEvent(testAction);

    testActionStore.getEventsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction);
    });
});

test("action store retains multiple actions", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);
    var testAction2 = new TestAction(aggregateID);

    var testActionStore = new EventStore();

    testActionStore.storeEvent(testAction1);
    testActionStore.storeEvent(testAction2);

    testActionStore.getEventsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(2);
        expect(actions[0]).toBe(testAction1);
        expect(actions[1]).toBe(testAction2);
    });
});

test("action store doesn't return incorrect actions", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);
    var testAction2 = new TestAction("not the right aggregate");

    var testActionStore = new EventStore();

    testActionStore.storeEvent(testAction1);
    testActionStore.storeEvent(testAction2);

    testActionStore.getEventsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction1);
    });
});

test("can subscribe to onActionStored", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);

    var onActionStoredCalls = 0;

    var testActionStore = new EventStore();
    testActionStore.onEventStored((action: TestAction) => {
        onActionStoredCalls++;
        expect(action.aggregateID).toBe(aggregateID);
    });

    testActionStore.storeEvent(testAction1);

    testActionStore.getEventsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction1);
    });

    expect(onActionStoredCalls).toBe(1);
});