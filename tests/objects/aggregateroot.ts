import {AggregateRoot} from "../../src/objects/aggregateroot";
import {IAmAnAction} from "../../src/interfaces/iamanaction";
import {ActionStore} from "../../src/services/actionstore";
import {Clock} from "../../src/helpers/clock";

class TestAction implements IAmAnAction{
        name="TestAction";
        created=Clock.now();

        constructor(public aggregateID: string){

    }
}

test("Aggregate root implementation", () => {

    

    let actionApplied = false;

    class TestAggregate extends AggregateRoot{
        applyAction(action: IAmAnAction){
            actionApplied = true;
        }
    }

    const testAggregate = new TestAggregate("test123");

    testAggregate.applyAction(new TestAction("123"));

    expect(actionApplied).toBeTruthy();
});

test("aggregate root applies action", () => {
    var actionStore = new ActionStore();

    let actionApplied = false;

    class TestAggregate extends AggregateRoot{

        ID="testAggregate";

        applyAction(action: IAmAnAction){
            actionApplied = true;
        }

        doSomething(){
            this.storeAction(new TestAction("testAggregate"));
        }
    }

    const testAggregate = new TestAggregate();
    testAggregate.attachActionStore(actionStore);

    testAggregate.doSomething();

    expect(actionApplied).toBeTruthy();

});