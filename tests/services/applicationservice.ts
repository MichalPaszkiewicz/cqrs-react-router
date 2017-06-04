import {ActionStore} from "../../src/services/actionstore";
import {DomainService} from "../../src/services/domainservice";
import {AggregateRoot} from "../../src/objects/aggregateroot";
import {ApplicationService} from "../../src/services/applicationservice";
import {IAmACommandHandler} from "../../src/interfaces/iamacommandhandler";
import {IAmACommand} from "../../src/interfaces/iamacommand";
import {IAmAnAction} from "../../src/interfaces/iamanaction";
import {View} from "../../src/objects/view";
import {Clock} from "../../src/helpers/clock";
import {DomainError} from "../../src/objects/domainerror";
import {CommandValidator} from "../../src/objects/commandvalidator";

const COMMAND_NAME: string = "testCommand";

const TEST_ACTION_NAME = "testAction";

class TestAction implements IAmAnAction{
    name = TEST_ACTION_NAME;
    created=Clock.now();
    constructor(public aggregateID: string) {
                        
    }
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

test("application service handles command", () => {

    ApplicationService.Instance.clear();

    var handleCalls = 0;

    class TestCommandHandler implements IAmACommandHandler{
    commandNames = [COMMAND_NAME];

        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            handleCalls++;
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);

    var testApplicationService = new ApplicationService();

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    expect(handleCalls).toBe(1);
});

test("view update is triggered by command sent to application service", () => {

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

        handle(action: IAmAnAction){
            if(action.name == TEST_ACTION_NAME){
                viewUpdateTriggers++;
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
    });

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    expect(viewUpdateTriggers).toBe(1);
});

test("second command is handling aggregate root logic", () => {

    ApplicationService.Instance.clear();

    class TestAction implements IAmAnAction{
        name="singleAction";
        aggregateID="testAggregate";
        created=Clock.now();
    }

    var handledSecondCommand = false;

    class SingleCommandOnlyPleaseAggregateRoot extends AggregateRoot{
        
        constructor(){
            super("testAggregate")
        }

        actionCount=0;

        applyAction(action){
            this.actionCount++;
        }

        doThatTestThing(){
            if(this.actionCount > 0){
                handledSecondCommand = true;
                return;
            }
            this.storeAction(new TestAction());
        }

    }

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(SingleCommandOnlyPleaseAggregateRoot, (ar) => {
                ar.doThatTestThing();
            }, "testAggregate");
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);
    var testApplicationService = new ApplicationService();


    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());
    testApplicationService.handleCommand(new TestCommand());

    expect(handledSecondCommand).toBe(true);
});

test("external action updates existing aggregate root", () => {

    ApplicationService.Instance.clear();

    var actionsApplied = 0;

    class ExtendedTestAggregateRoot extends TestAggregateRoot{

        applyAction(action: IAmAnAction){
            actionsApplied++;
        }

    }

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(ExtendedTestAggregateRoot, (ar) => {
                ar.doThatTestThing();
            }, "123");
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.handleCommand(new TestCommand());

    testApplicationService.storeAction(new TestAction("123"));

    expect(actionsApplied).toBe(2);
});

test("external action replayed when new aggregate root called for", () => {

    ApplicationService.Instance.clear();

    var actionsApplied = 0;

    class ExtendedTestAggregateRoot extends TestAggregateRoot{

        applyAction(action: IAmAnAction){
            actionsApplied++;
        }

    }

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(ExtendedTestAggregateRoot, (ar) => {
                ar.doThatTestThing();
            }, "123");
        }
    }

    var testActionStore = new ActionStore();
    var testDomainService = new DomainService(testActionStore);
    var testApplicationService = new ApplicationService();

    testApplicationService.registerCommandHandler(TestCommandHandler);

    testApplicationService.storeAction(new TestAction("123"));

    testApplicationService.handleCommand(new TestCommand());

    expect(actionsApplied).toBe(2);
});

test("application service can allow handling of domain errors", () => {
    ApplicationService.Instance.clear();

    var actionsApplied = 0;

    class ExtendedTestAggregateRoot extends TestAggregateRoot{

        applyAction(action: IAmAnAction){
            actionsApplied++;
        }

        doStuff(){
            throw new DomainError("some message about an error");
        }
    }

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(ExtendedTestAggregateRoot, (ar) => {
                ar.doStuff();
            }, "123");
        }
    }
    
    var testApplicationService = new ApplicationService();
    testApplicationService.registerCommandHandler(TestCommandHandler);

    var callback = jest.fn();

    testApplicationService.onDomainError(callback);

    testApplicationService.handleCommand(new TestCommand());

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);
});

test("application service throws error on command handle if no handler specified", () => {
    ApplicationService.Instance.clear();

    var actionsApplied = 0;

    class ExtendedTestAggregateRoot extends TestAggregateRoot{

        applyAction(action: IAmAnAction){
            actionsApplied++;
        }

        doStuff(){
            throw new DomainError("some message about an error");
        }
    }

    class TestCommandHandler implements IAmACommandHandler{
        commandNames = [COMMAND_NAME];
        handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){
            domainService.getAggregateRoot(ExtendedTestAggregateRoot, (ar) => {
                ar.doStuff();
            }, "123");
        }
    }
    
    var testApplicationService = new ApplicationService();
    testApplicationService.registerCommandHandler(TestCommandHandler);

    var callback = jest.fn();

    expect(() => testApplicationService.handleCommand(new TestCommand())).toThrowError();

});

class TestValidatorCommandHandler implements IAmACommandHandler{
    commandNames = [COMMAND_NAME];

    handle(command: TestCommand, domainService: DomainService, callback: (command: IAmACommand) => void){

    }
}

test("application service validates with registered command validators", () => {
    ApplicationService.Instance.clear();

    var callback = jest.fn();

    class TestCommandValidator extends CommandValidator{

        commandNames = [COMMAND_NAME];

        validate(command: IAmACommand){
            callback();
        }
    }

    ApplicationService.Instance.registerCommandValidator(TestCommandValidator);

    ApplicationService.Instance.registerCommandHandler(TestValidatorCommandHandler)

    ApplicationService.Instance.handleCommand(new TestCommand());

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);
});

test("application service gets views for registered command validator during validating", () => {
    ApplicationService.Instance.clear();

    var viewName = "blah";
    var callback = jest.fn();    

    class SecondTestCommandValidator extends CommandValidator{
        commandNames = [COMMAND_NAME];

        validate(command: IAmACommand){
            this.getViewByName(viewName, (view: TestView)=> {
                callback();
                expect(view.testProperty).toBe(42);
            });
        }
    }

    class TestView extends View{
        name = viewName

        testProperty: 42;

        handle(action: IAmAnAction){

        }
    }

    ApplicationService.Instance.registerCommandValidator(SecondTestCommandValidator);
    ApplicationService.Instance.registerCommandHandler(TestValidatorCommandHandler)
    ApplicationService.Instance.registerView(TestView);

    ApplicationService.Instance.handleCommand(new TestCommand());

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);  
});