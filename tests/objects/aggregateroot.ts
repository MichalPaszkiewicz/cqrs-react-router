import {AggregateRoot} from "../../src/objects/aggregateroot";
import {IAmAnAction} from "../../src/interfaces/iamanaction";

test("Aggregate root implementation", () => {

    class TestAction implements IAmAnAction{
        name="TestAction";
        
        constructor(public id: string){

        }
    }

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