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


## replay events! ##
```javascript
testApplicationService.replayEvents();
```


## apply events from external sources ##
```javascript
testApplicationService.storeEvent(new TestEvent("123"));
```

# latest changes #

[The latest changes can be found in the Wiki.](https://github.com/MichalPaszkiewicz/cqrs-react-router/wiki/Latest-Changes)