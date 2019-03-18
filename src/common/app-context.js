import React from 'react';

const authContext = React.createContext({
    status:false,
    logIn:()=>{}
});

export default authContext;