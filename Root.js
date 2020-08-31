
import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserContext from './src/Contexts/UserContext';
import { LoginScreen, HomeScreen, RegistrationScreen, NoteScreen } from './src/screens';
import { firebase } from './src/firebase/config';
import { decode, encode } from 'base-64';

if (!global.btoa) { global.btoa = encode; }
if (!global.atob) { global.atob = decode; }

const Stack = createStackNavigator();

export default function Root() {
  
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);

  // if (loading) return (<Text>loading</Text>)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) { 
        userContext.setUid(user.uid)
        userContext.setLoggedIn(true)
      }
    })
  }, []);
  
  return (
    <NavigationContainer>
        <Stack.Navigator>
          { userContext.loggedIn
              ? (
                <>
                  <Stack.Screen name='Home' component={HomeScreen} />
                  <Stack.Screen name='Note' component={NoteScreen} />
                </>
                ) 
              : (
                <>
                  <Stack.Screen name='Login' component={LoginScreen} />
                  <Stack.Screen name='Registration' component={RegistrationScreen} />
                </>
                )
          }
        </Stack.Navigator>
      </NavigationContainer>
  )
}