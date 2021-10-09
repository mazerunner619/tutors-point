import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// creating context to use globally

const AuthContext = createContext(); //returns an object with all the features of the context

function AuthContextProvider(props) {

    const [logged, setLogged] = useState(undefined);
    const [loggedUser, setLoggedUser] = useState({});
    
    async function getLogged(){
            const {data} = await axios.get('/auth/current');
            console.log('getLogged resposne => ',data);
            if(data){
                setLogged(true);
                setLoggedUser(data)
                return data;
            }
            else {
                setLogged(false);
                setLoggedUser(undefined);
            }
    }
    
    useEffect( () => {
        getLogged();
    }, []);

    return (
    <AuthContext.Provider value ={{logged, getLogged, loggedUser}}>
        {props.children}
    </AuthContext.Provider>
    )
};

export {AuthContextProvider};
export default AuthContext;






