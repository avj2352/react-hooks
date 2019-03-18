# React Hooks

Current difference between `Functional` components and `Structural` components

| Functional | Structural |
|:-----------|-----------:|
| Props in, JSX Out | Uses props and state |
| Great for presentation | Business logic goes here |
| Focused on one / few purpose(s) | Orchestrates components |
| | Lifecycle hooks are hard to use |

> Conversion of Structural to Functional is annoying

---

# Example of a Hook

- In a React functional component, you inject hooks by using the prefix `use`
- `useState` is a hook that is also a function, so you can invoke it within your functional component

```js
// useState is a React Hook
import React, {useState} from 'react';

const todo = (props) => {    
    // useState is a hook that is also a function
    const inputState = useState('');
    return (
        ...
    );
}

```

- `useState('')` take in an argument, which is the initial state of the functional component
    - The argument can be anything - `Array`, `Object`, `String`, `Boolean` ...etc.,
- `useState('')` also returns an `array` which has 2 elements:
    - The first element of the array is the current state.
    - The second element of the array is the function to modify the state

```jsx
import React, { useState } from 'react';

const Todo = (props)=>{
    // useState is also a function so we invoke it as a function
    // It takes in an initial state, which we pass as a string argument
    // It returns a value, which is an array - 2 elements
 
    const inputState = useState('');

    const inputChangeHandler = (event) => {
        // First element - full state / current state
        // Second element - function to manipulate the state
        inputState[1](event.target.value);
    };

    return (
    <React.Fragment>
        <input type="text" placeholder="Add Todo here..." onChange={inputChangeHandler} value={inputState[0]}/>
        <button>Add</button>
        <ul/>
    </React.Fragment>
    );
}
```

---

# Difference between setState(Structural components) and useState(Functional Components)

> - Important: Unlike `setState()` which merges the new value with the existing state, 
> - The `useState()` creates new copies of the updated state and replaces them with the current state.
> - This means that whenever you `useState()` hook with only one state object for all the values, its your job to manually merge the remaining properties as well.
> - That's why it makes sense to split up the `useState()` hook.

# Rules of using Hooks in React

- It has to be a `React Functional` Component, not a ES6 / JS function
    - such a function which takes in props and returns a JSX component
    - which React can use to render the component
    - Hooks will not work correctly on other function
- You must only use `useState()` and all the other hooks directly at the top level of your component function.
- You cannot call `useState()` in a function / event handler of a function. The following is not allowed

```js
const inputChangeHandler = (event) => {        
        // this is not allowed
        const [todoList, setTodoList] = useState([]); // hooks cant be inside another function        
    };
```
- You cannot call `useState()` inside a if condition / for loop


# useEffect Hook

The `useEffect` react hook is especially useful if your functional component needs to fetch results as part of a XHR request 

- Unlike the `useState()` hook which takes in a string / object / array.
- The `useEffect()` hook takes in a function - This can be any code execution that should not be present in the render function
- The reason we donot put XHR request directly inside the `render()` function is because:
    - They are not Performant, React does quite alot of work behind the `render()` that's why its not the right place to put custom logic
    - They can produce side-effects

```js
// Simple mouse register event
const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
};

    useEffect(()=>{
        // Also call the XHR request
        Axios.get(`https://reqres.in/api/users?page=2`)
        .then(res=>console.log(`Response from the service is`, res.data.data));
        // event registration
        document.addEventListener('mousemove', mouseMoveHandler);
        // This also means we are using our effect as componentDidUnmount() lifecycle method
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        }
    }, []); //This means we want our effect to act as componentDidMount() / componentDidUpdate lifecycle method
```

---

# Passing Arguments using Bind function

> IMPORTANT: How to use bind along with function invoking

You can put reference to the same function when implementing a `prop` method. You can pass argument dynamically using the bind function

```js
// Consider this to be our functional component which calls 2 different arguments
const Header = props => {
    return(
        <header>
            // Calling on 2 different property methods
            <button onClick={props.onLoadTodos}>TodoList</button> | {' '}
            <button onClick={props.onLoadAuth}> Auth </button>
        </header>
    );
}

// You can still reference a single function when calling this and pass the binding arguments
// This will be our common function which takes in a parameter
const switchPage = pageName => {
    setPage(pageName);
}

// ...and this is how we use the same function, but bind different arguments to it
<Header onLoadTodos={switchPage.bind(this, 'todos')} onLoadAuth={switchPage.bind(this, 'auth')}/>

```
---

# Context API Hook `useContext()`

The `useContext()` takes in a `context API`  class and returns an instance of that Context API 
- so we can easily have access to the fields and properties of the Context API

- The following is a code to write a simple bare bones `functional` appContext class

```js
import React from 'react';

// Simple AuthContext class
const authContext = React.createContext({
    status:false,
    logIn:()=>{}
});

export default authContext;
```

- Now we can use this as a wrapper in our `App.js`  class as follows:

```js
import React, { useState } from 'react';
import Todo from './components/Todo.js';
import Header from './components/Header.js';
import Auth from './components/Auth.js';
import AuthContext from './common/app-context.js';



const App = props => {

  //State
  const [routeName, setRouteName] = useState(0);
  // We bind the fields of authContext as a useState hook of App.js
  const [authStatus, setAuthStatus] = useState(false);

  //Event Handlers
  const todoHandler = event => {
    setRouteName(1);
  }

  const authHandler = event => {
    setRouteName(0);
  }

  const customRoute = routeName ? <Todo/> : <Auth/>;

    // We override the function of appContext here!
  const logIn = () => {
    setAuthStatus(true);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ status: authStatus, logIn: logIn }} >
        <Header onLoadTodos={todoHandler} onLoadAuth={authHandler}/>
        <hr/>
        {customRoute}
      </AuthContext.Provider>
    </div>
  );
};

export default App;
```

---

- Now we can easily integrate this context api into our components, like such:

```js
// Header.js
import React, { useContext } from 'react';
import AuthContext from '../common/app-context';

const Header = props => {
    // Integrate context API using the useContext hook
    const auth = useContext(AuthContext);
    return(
        <header>
            {auth.status && <button onClick={props.onLoadTodos}>TodoList</button>}
            <button onClick={props.onLoadAuth}> Auth </button>
        </header>
    );
}

export default Header;

//Auth.js
import React, { useContext } from 'react';
import AuthContext from './../common/app-context.js';

const Auth = props => {
    // Integrate context API using the useContext hook
    const auth = useContext(AuthContext);
    return(
        <div>
            <h1>Auth Component</h1>
            <button onClick={ auth.logIn }> Log in! </button>
        </div>
    );
};

export default Auth;
```

---

# `useReducer()` Hook

A `useReducer()` hook is just a function which can handle more than one logic. In the end, its a function which can a handle a couple of 
different cases, a couple of different conditions and update the `state` in different ways.


