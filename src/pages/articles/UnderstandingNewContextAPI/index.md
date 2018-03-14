---
title: Understanding new Context API
date: "2018-03-12"
layout: post
draft: true
path: "/posts/understanding-new-context-api/"
category: "Tutorial"
tags:
  - "Building"
  - "Learning"
description: "I've playing a lot with the new Context API, comparing it with the old one and also re-write an old component of mine. You will learn the advantages of using it and why you should take a look ASAP!"
---

If you were following all the React trends in the last month, you would know that some API's have received a redesign: Context, refs, etc.

In this opportunity, I'm going to tell you my experience of re-writing a Component using this new Context API!

![Connection](./connection.jpg)

## But first, What the heck is Context?

Context is another way of sharing information between parent and children (like props). You could say that props is `explicit` communication, while Context is `implicit` Communication.

When an application starts to grow, you will end up having more components that also start to share more information between them. When this happened is common to start seeing the DrillingProps problem, which is a component passing down lots of props just to give access to component below of it.

This is when Context helps us! By removing those props chain between component, we endup with a more readeable and understandable code.

### Diagram Communication

Via props

```
<ParentComponent>   props: {  value: 1 }  ↓
  <IntermediateComponent>   props: {  value: 1 }  ↓
    <OtherIntermediateComponent>    props: {  value: 1 }  ↓
      <ChildComponent>    props: {  value: 1 }
```

Via Context

```
<ParentComponent>   context: {  value: 1 }
  <IntermediateComponent>
    <OtherIntermediateComponent>
      <ChildComponent>    props: {  value: 1 }
```

## What does this new API offer?

React developer team has re-disegn from start the way we declare a context inside a Component and introduce new concepts that previously were not present inside the framework.

Let's see a comparison between the new version and the old.

### Old version

```javascript
import React, { Component } from 'react';
import { number } from 'prop-types';

class Parent extends Component {
  static childContextTypes = {
    value: string
  };

  getChildContext() {
    return { value: 1 };
  }

  render() {
    return <Child />;
  }
}

class Child extends Component {
  static contextTypes = {
    value: number
  };

  render() {
    const { value } = this.context;
    return <p>The value from Context is: {value}</p>;
  }
}
```

### New version

```javascript
import React, { createContext } from 'react';
import { number } from 'prop-types';

const { Provider, Consumer } = createContext('contextExample')

const Parent = () => (
  <Provider value={ value: 1}>
    <Child />
  </Provider>
)

const Child = () => (
  <Consumer>
    ({value}) => <p>The value from Context is: {value}</p>
  </Consumer>
)
```

#### List of changes:

* Remove the need of using getChildContext to set values inside a context.
* Remove contextType and childContextTypes static definition in parent and children (which in my opinion was the worst).
* Add a new method `React.createContext` which create a new instance of a Context and return an object with a `Provider` and a `Consumer`.
* The `Provider` component allows you to define values inside the Context created.
* The `Consumer` component uses `renderProp` pattern inside its children, inside that function we'll have access to all the information inside the context created.

## Let's build something!

In 2017 I wrote a RadioGroup component with the old Context, so my goal is to re-write it using the new!

I choose a RadioGroup because is one of those component that are very annoying component to build in React. If you want to know why, just check this portion of code which objetive is to render a set of radio button that are controlled.

```javascript
import React, { Component } from 'react';

class Example extends Component {
  state = {
    selectedFruit: 'apple'
  };

  onChangeFruit = ({ target: { value } }) =>
    this.setState({ selectedFruit: value });

  render() {
    return (
      <div>
        <input
          type="fruits"
          value="apple"
          id="apple"
          onChange={this.onChangeFruit}
          checked={this.state.selectedFruit === 'apple'}
        />
        <label for="apple">Apple</label>
        <br />
        <input
          type="fruits"
          value="grapes"
          id="grapes"
          onChange={this.onChangeFruit}
          checked={this.state.selectedFruit === 'grapes'}
        />
        <label for="apple">Grapes</label>
        <br />
        <input
          type="fruits"
          value="orange"
          id="orange"
          onChange={this.onChangeFruit}
          checked={this.state.selectedFruit === 'orange'}
        />
        <label for="apple">Orange</label>
        <br />
      </div>
    );
  }
}
```

![Horrible](./horrible.gif)

That's a lot of code just to manage 3 radio buttons! Let's see how you can accomplish the same with the abstraction of the RadioGroup built with context.

```javascript
import React, { Component } from 'react';
import { RadioButton, RadioGroup } from 'react-radio-group-context';

class Example extends Component {
  state = {
    selectedFruit: 'apple'
  };

  onChangeFruit = ({ target: { value } }) =>
    this.setState({ selectedFruit: value });

  render() {
    return (
      <RadioGroup
        name="fruits"
        selected={this.state.selectedFruit}
        onChange={this.onChangeFruit}
      >
        <RadioButton id="apple">Apple</RadioButton> <br />
        <RadioButton id="grapes">Grapes</RadioButton> <br />
        <RadioButton id="orange">Orange</RadioButton> <br />
      </RadioGroup>
    );
  }
}
```

That looks sooo much better right? Lets see what is happening.

As you can see I have created a new component called RadioGroup which received all the shared properties along the RadioButton.

Then those properties are magically passed to every RadioButton which can determine if they are selected or not by themself. So, how are we going to do that? And the answer is Context :smile:

To create a new context you just to call to `React.createContext` and pass a name for the context.

```javascript
import React from 'react';

const { Provider, Consumer } = React.createContext('radioGroup');
```

Lets see how to write `RadioGroup` and `RadioButton`.

### RadioGroup

This component is in charge of distributing the information to all the RadioButton and nothing more, it doesn't have to render anything in special.

This component have to store inside its context:

* Name of the group for the radio buttons,
* The callback on onChange.
* The selected radio.
* If the group is disabled

```javascript
const RadioGroup = ({ selected, onChange, name, disabled, children }) => (
  <Provider
    value={{
      selected,
      onChange,
      name,
      disabledGroup: disabled
    }}
  >
    {children}
  </Provider>
);
```

### RadioButton

This component has to read from the context defined by the `RadioGroup` and make some validations:

* If the selected radio is equal to the `id`, then `checked` has to be `true`.
* If the `disabled` or `disabledGroup` were true, then `disabled` has to be `true`.
* In case `value` was not being sent, then `value` should be equal to `id`.

```javascript
const RadioButton = ({ id, value, disabled, children }) => (
  <Consumer>
    {({ selected, onChange, disabledGroup, name }) => (
      <Fragment>
        <input
          type="radio"
          checked={selected === id}
          disabled={disabled || disabledGroup}
          id={id}
          value={value || id}
          name={name}
          onChange={onChange}
        />
        <label for={id}>{children}</label>
      </Fragment>
    )}
  </Consumer>
);
```

Merging all, we endup with this powerful library!

```javascript
import React, { Fragment } from 'react';

const { Provider, Consumer } = React.createContext('radioGroup');

const RadioGroup = ({ selected, onChange, name, disabled, children }) => (
  <Provider
    value={{
      selected,
      onChange,
      name,
      disabledGroup: disabled
    }}
  >
    {children}
  </Provider>
);

const RadioButton = ({ id, value, disabled, children }) => (
  <Consumer>
    {({ selected, onChange, disabledGroup, name }) => (
      <Fragment>
        <input
          type="radio"
          checked={selected === id}
          disabled={disabled || disabledGroup}
          id={id}
          value={value || id}
          name={name}
          onChange={onChange}
        />
        <label for={id}>{children}</label>
      </Fragment>
    )}
  </Consumer>
);

export { RadioGroup, RadioButton };
```

---

I really like this new API, and I think it will be game changing in React. I invite all of you to build your own components using this awesome API, it's really powerful :fire:

Let’s keep building stuff together :construction_worker:

### Refs:

* [Context - React Documentation](https://reactjs.org/docs/context.html)
* [New version of Context - Pull Request](https://github.com/reactjs/rfcs/pull/2)
* [React new Context API - Blog](https://medium.com/dailyjs/reacts-%EF%B8%8F-new-context-api-70c9fe01596b)
* [Context in ReactJS Applications - Blog](https://javascriptplayground.com/context-in-reactjs-applications/)