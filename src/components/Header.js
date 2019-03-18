import React, { useContext } from 'react';
import AuthContext from '../common/app-context';

const Header = props => {
    const auth = useContext(AuthContext);
    return(
        <header>
            {auth.status && <button onClick={props.onLoadTodos}>TodoList</button>}
            <button onClick={props.onLoadAuth}> Auth </button>
        </header>
    );
}

export default Header;