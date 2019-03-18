import React, { useState } from 'react';
import Todo from './components/Todo.js';
import Header from './components/Header.js';
import Auth from './components/Auth.js';
import AuthContext from './common/app-context.js';



const App = props => {

  //State
  const [routeName, setRouteName] = useState(0);
  const [authStatus, setAuthStatus] = useState(false);

  //Event Handlers
  const todoHandler = event => {
    setRouteName(1);
  }

  const authHandler = event => {
    setRouteName(0);
  }

  const customRoute = routeName ? <Todo/> : <Auth/>;

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
