cqrs-react-router 
-----------------------------------------
cqrs-react-router is a library that will help you easily set up a CQRS/event sourcing system

[![Build Status](https://travis-ci.org/MichalPaszkiewicz/cqrs-react-router.svg?branch=master)](https://travis-ci.org/MichalPaszkiewicz/cqrs-react-router)

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

    handle(action: IAmAnAction){
        var self = this;
        switch(action.name){
            case "SomeAction":
                self.stuff++;
                return;
        }
    }
}

export class SomeAggregateRoot extends AggregateRoot{
    doStuff(command){
        //do something
    }

    applyAction(action){
        switch(action.Name){
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
testApplicationService.replayActions();
```


## apply actions from external sources ##
```javascript
testApplicationService.storeAction(new TestAction("123"));
```

