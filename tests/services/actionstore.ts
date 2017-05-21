import { IAmAnAction } from "../../src/interfaces/iamanaction";
import { ActionStore } from "../../src/services/actionstore";
import {Clock} from "../../src/helpers/clock";

class TestAction implements IAmAnAction{
    name="testAction";
    created=Clock.now();
    constructor(public id: string){

    }
}

test("action store retains an action correctly", () => {
    var aggregateID = "123";
    var testAction = new TestAction(aggregateID);

    var testActionStore = new ActionStore();

    testActionStore.storeAction(testAction);

    testActionStore.getActionsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction);
    });
});

test("action store retains multiple actions", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);
    var testAction2 = new TestAction(aggregateID);

    var testActionStore = new ActionStore();

    testActionStore.storeAction(testAction1);
    testActionStore.storeAction(testAction2);

    testActionStore.getActionsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(2);
        expect(actions[0]).toBe(testAction1);
        expect(actions[1]).toBe(testAction2);
    });
});

test("action store doesn't return incorrect actions", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);
    var testAction2 = new TestAction("not the right aggregate");

    var testActionStore = new ActionStore();

    testActionStore.storeAction(testAction1);
    testActionStore.storeAction(testAction2);

    testActionStore.getActionsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction1);
    });
});

test("can subscribe to onActionStored", () => {
    var aggregateID = "123";
    var testAction1 = new TestAction(aggregateID);

    var onActionStoredCalls = 0;

    var testActionStore = new ActionStore();
    testActionStore.onActionStored((action: TestAction) => {
        onActionStoredCalls++;
        expect(action.id).toBe(aggregateID);
    });

    testActionStore.storeAction(testAction1);

    testActionStore.getActionsForID(aggregateID, (actions) => {
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(testAction1);
    });

    expect(onActionStoredCalls).toBe(1);
});