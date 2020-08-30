import React, { useState } from 'react';

const UserContext = React.createContext({
  user: null,
  setUser: () => {},
});

export default UserContext;

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{user, setUser}}>
      {props.children}
    </UserContext.Provider>
  );
}