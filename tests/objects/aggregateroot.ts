import {AggregateRoot} from "../../src/objects/aggregateroot";
import {IAmADomainEvent} from "../../src/interfaces/iamadomainevent";
import {EventStore} from "../../src/services/eventstore";
import {Clock} from "../../src/helpers/clock";

class TestEvent implements IAmADomainEvent{
        name="TestEvent";
        created=Clock.now();

        constructor(public aggregateID: string){

    }
}

test("Aggregate root implementation", () => {

    

    let eventApplied = false;

    class TestAggregate extends AggregateRoot{
        applyEvent(event: IAmADomainEvent){
            eventApplied = true;
        }
    }

    const testAggregate = new TestAggregate("test123");

    testAggregate.applyEvent(new TestEvent("123"));

    expect(eventApplied).toBeTruthy();
});

test("aggregate root applies action", () => {
    var eventStore = new EventStore();

    let eventApplied = false;

    class TestAggregate extends AggregateRoot{

        ID="testAggregate";

        applyEvent(action: IAmADomainEvent){
            eventApplied = true;
        }

        doSomething(){
            this.storeEvent(new TestEvent("testAggregate"));
        }
    }

    const testAggregate = new TestAggregate();
    testAggregate.attachEventStore(eventStore);

    testAggregate.doSomething();

    expect(eventApplied).toBeTruthy();

});

test("aggregate root applies action in custom event applier", () => {
    var eventStore = new EventStore();

    let eventApplied = false;

    class TestAggregate extends AggregateRoot{

        ID="testAggregate";

        applyEvent(action: IAmADomainEvent){
        }

        applyTestEvent(action: TestEvent){
            eventApplied = true;            
        }

        doSomething(){
            this.storeEvent(new TestEvent("testAggregate"));
        }
    }

    const testAggregate = new TestAggregate();
    testAggregate.attachEventStore(eventStore);

    testAggregate.doSomething();

    expect(eventApplied).toBeTruthy();

});