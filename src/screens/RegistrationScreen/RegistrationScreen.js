import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import UserContext from '../../Contexts/UserContext';
import { firebase } from '../../firebase/config';

export default function RegistrationScreen({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userContext = useContext(UserContext);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) return alert('Passwords do not match.');

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        const uid = res.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
        };
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            userContext.setUser({user: data});
            navigation.navigate('Home');
          })
          .catch(error => alert(error));
      })
      .catch(error => alert(error));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'>
        {/* <Image 
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        /> */}
        <TextInput 
          style={styles.input}
          placeholder='Full Name'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          autoCapitalize='none'
        />
        <TextInput 
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize='none'
        />
        <TextInput 
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCapitalize='none'
        />
        <TextInput 
          style={styles.input}
          placeholder='Confirm Password'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          autoCapitalize='none'
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
          >
          <Text style={styles.buttonTitle}>Create Account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Already have an account?
            <Text onPress={onFooterLinkPress} style={styles.footerLink}> Log in</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}