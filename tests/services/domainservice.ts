import {EventStore} from "../../src/services/eventstore";
import {DomainService} from "../../src/services/domainservice";
import {AggregateRoot} from "../../src/objects/aggregateroot";

class TestAggregateRoot extends AggregateRoot{
    applyEvent(){

    }
}

test("domain service returns a new aggregate root", () => {

    var testActionStore = new EventStore();
    var testDomainService = new DomainService(testActionStore);

    testDomainService.getAggregateRoot(TestAggregateRoot, (ar => {
        expect(ar).toBeInstanceOf(TestAggregateRoot);
    }));

});

test("domain service returns a new aggregate root with the correct id", () => {

    var testID = "1234";

    var testActionStore = new EventStore();
    var testDomainService = new DomainService(testActionStore);

    testDomainService.getAggregateRoot(TestAggregateRoot, (ar => {
        expect(ar).toBeInstanceOf(TestAggregateRoot);
        expect(ar.ID).toBe(testID);
    }), testID);

});

test("domain service calls callback", () => {
    var callbackcalled = false;
    
    var testID = "1234";

    var testActionStore = new EventStore();
    var testDomainService = new DomainService(testActionStore);

    testDomainService.getAggregateRoot(TestAggregateRoot, (ar => {
        callbackcalled = true;
    }), testID);

    expect(callbackcalled).toBeTruthy();
});