import React from 'react';

import Root from './Root';
import { UserProvider } from './src/Contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Root />
    </UserProvider>
  );
}