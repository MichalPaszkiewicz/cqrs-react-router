# cqrs-react-router #

cqrs-react-router is a library that will help you easily set up a CQRS/event sourcing system

[![Build Status](https://travis-ci.org/MichalPaszkiewicz/cqrs-react-router.svg?branch=master)](https://travis-ci.org/MichalPaszkiewicz/cqrs-react-router)
[![npm version](https://badge.fury.io/js/cqrs-react-router.svg)](https://badge.fury.io/js/cqrs-react-router)

## breaking change ##
v2.0.0 is a breaking change, so please make sure you go through your code and fix any reference issues.

## typescript support ##
cqrs-react-router is written in typescript and therefore will always support typescript



## how to contribute ##
feel free to submit pull requests, just please provide clear notes as to what your update will change.
Pull requests that cause tests to fail will not be accepted.


## how to install ##
you will need npm. Then install this library with
```
npm install cqrs-react-router
```


## cqrs ##
to start writing your own typescript cqrs application, you will need an application service, to which you register command handlers and views
```javascript
import {ApplicationService, IAmACommandHandler, DomainService, IAmACommand, View, AggregateRoot} from "cqrs-react-router";

class SomeView extends View{
    name = "SomeView"; // subscribers can get updates for this view

    stuff = 0;

    handle(event: IAmADomainEvent){
        var self = this;
        switch(event.name){
            case "SomeEvent":
                self.stuff++;
                return;
        }
    }
}

export class SomeAggregateRoot extends AggregateRoot{
    doStuff(command){
        //do something
    }

    applyEvent(event){
        switch(event.Name){
            //when action applied, do something here
            default:
                return;
        }
    }
}

class SomeCommandHandler implements IAmACommandHandler{

    commandNames = ["SomeCommand"]; // this handler will handle commands with these names

    handle(command, domainService: DomainService, callback: () => void){
        domainService.getAggregateRoot(SomeAggregateRoot, (someAggregateRoot: SomeAggregateRoot) => {
            someAggregateRoot.doStuff(command);
        }, "someAggregateID");
    }
}

var appService = new ApplicationService();

appService.registerCommandHandler(SomeCommandHandler);
appService.registerView(SomeView);
```

To subscriber to a view

```javascript
appService.subscribe("SomeView", (view: SomeView) => {
    //do something with the new view;
});
```

To handle a command

```javascript
appService.handleCommand(new SomeCommand())
```

To validate a command from views

```javascript
class TestCommandValidator extends CommandValidator{

    commandNames = [COMMAND_NAME];

    validate(command: IAmACommand){
        // getViewByName fetches view from application service
        this.getViewByName(viewName, (view: TestView)=> {
            if(view.hasSomeUnexpectedValue){
                throw new DomainError("oh noes, I didn't expect that!");
            }
        });
    }
}
ApplicationService.Instance.registerCommandValidator(TestCommandValidator);
```


## router ##
use just like react-router, only it will inject an application service that you can subscribe to.

```javascript
import {Router, Route, ApplicationService, Page} from "cqrs-react-router";

class SomePage extends Page<any, any>{
    render(){
        return (
            <div>
                Some stuff
            </div>
        )
    }
}

export class App extends React.Component<AppProps, AppState>{
    render(){
        return (
            <Router applicationService={new ApplicationService()}>
                <Route path="/" component={SomePage} />
            </Router>
        )
    }
}
```


## replay actions! ##
```javascript
testApplicationService.replayEvents();
```


## apply actions from external sources ##
```javascript
testApplicationService.storeEvent(new TestEvent("123"));
```

# latest changes #

## 2.0.3 ##
React components (and therefore also cqrs-react-router pages) require subscription on mounting and should unsubscribe when unmounted.

`ApplicationService.Instance.subscribePage(page, viewName, callback)` is a new method that means you no longer have to worry about the mounting-unmounting process.

Please be aware that you probably might want to still manually write the mounting/unmounting code if you have custom code you need run there.

## 2.0.2 ##
`ApplicationService.Instance.validateHypotheticalCommand(command, onError)` now available for when you want to run all your business logic without changing the current state.

## 2.0.1 ##
Events can now be replayed slowly by calling replayEvents with two arguments:

```javascript
ApplicationService.Instance.replayEvents(Clock.now(), 1000); 
```

## 2.0.0 ##
Breaking changes: 

`IAmAnAction` renamed to `IAmADomainEvent`

`ActionStore` renamed to `EventStore`

`DatedAction` renamed to `DatedEvent`

`AuditedAction` renamed to `AuditedEvent`

All other functions and properties with "action" in them have been renamed with "event"

This is due to the fact that "actions" are usually associated with commands, whereas in this project, they clearly correspond to events.

## 1.1.0 ##
`onActionStored` can now be called on an ApplicationService instance.
```javascript
ApplicationService.Instance.onActionStored(callback: (action: IAmAnAction) => {
    // do something with this action
})
```

## 1.0.6 ##
`hardReplayActions` in ApplicationService that will allow you to also reset aggregate roots (`replayActions` only resets views).

## 1.0.5 ##
Introduction of `AuditedAction` abstract class that will enforce use of createdBy string property.

## 1.0.4 ##
Small fix to ClockDate object - adding of time now returns a new object and doesn't mutate the original ClockDate.

## 1.0.2 ##
`DatedAction` now comes as part of the package - it is an abstract class that implements IAmAnAction. 
It will automatically set the "Created" property on creation and therefore is more useful to users who want to use their actions for auditing purposes.

## 1.0.0 ##
Breaking change: the use of 'id' in IAmAnAction was a bit ambiguous, so IAmAnAction now has a property 'aggregateID' instead.

`CommandValidator` abstract class now available and can be registered to your `ApplicationService`.

You can now also get a report of your state from your application service with:

```javascript
var report = ApplicationService.Instance.getStateReport();
```

## 0.1.9 ##
You can now handle domain errors neatly by subscribe a domain error event for your application service:
```javascript
ApplicationService.Instance.onDomainError((error: DomainError) => {
    alert(error.message);
});
```
Please not that this will not handle any generic errors - only errors specified as DomainErrors.
