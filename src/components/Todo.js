import React, { useState, useEffect, useReducer } from 'react';
import Axios from 'axios';

const Todo = (props)=>{
    // useState is also a function so we invoke it as a function
    // It takes in an initial state, which we pass as a string argument
    // It returns a value, which is an array - 2 elements
    // Using Array de-structuring to give different variable names to array
    const [todoName, setTodoName] = useState('');
    // const [todoList, setTodoList] = useState([]); // We will useReducer() hook instead

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    const todoListReducer = (state, action) => {
        // You can use action.mode / action.type
        switch( action.type ) {
            case 'ADD':
                return state.concat(action.payload);                
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((todo)=>{
                    return todo.id !== action.payload.id;
                });                
            default:
                return state;
        }
    }

    const [todoList, dispatch] = useReducer(todoListReducer, []);

    useEffect(()=>{
        // Also call the XHR request
        Axios.get(`https://reqres.in/api/users?page=2`)
        .then(res=>console.log(`Response from the service is`, res.data.data));
        // event registration
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        }
    }, []); //This means we want our effect to act as componentDidMount() lifecycle method

    const inputChangeHandler = (event) => {
        // First element - full state / current state
        // Second element - function to manipulate the state
        setTodoName(event.target.value);        
    };

    // const todoAddHandler = () => {
    //     setTodoList([...todoList,todoName]);        
    // }

    const todoAddHandler = () => {
        dispatch({type: 'ADD', payload: [...todoList, todoName]});
    }


    return (
    <React.Fragment>
        <input type="text" placeholder="Add Todo here..." onChange={ inputChangeHandler } value={ todoName }/>
        <button onClick={ todoAddHandler } >Add</button>
        <ul>
            { todoList.map(el => <li key={el}>{el}</li>)}
        </ul>
    </React.Fragment>
    );
}

export default Todo;