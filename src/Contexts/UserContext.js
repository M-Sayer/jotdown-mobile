import React, { useState } from 'react';

const UserContext = React.createContext({
  uid: null,
  setUid: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
});

export default UserContext;

export const UserProvider = (props) => {
  const [uid, setUid] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <UserContext.Provider value={{uid, setUid, loggedIn, setLoggedIn}}>
      {props.children}
    </UserContext.Provider>
  );
}