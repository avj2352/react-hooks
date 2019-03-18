import React, { useContext } from 'react';
import AuthContext from './../common/app-context.js';

const Auth = props => {
    const auth = useContext(AuthContext);
    return(
        <div>
            <h1>Auth Component</h1>
            <button onClick={ auth.logIn }> Log in! </button>
        </div>
    );
};

export default Auth;