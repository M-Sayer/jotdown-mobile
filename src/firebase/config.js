import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-M8qtAi4WmhQ-e1KLWgaerbaCoCcrk4A',
  authDomain: 'reactnative-7d044.firebase.com',
  databaseURL: 'https://reactnative-7d044.firebaseio.com',
  projectId: 'reactnative-7d044',
  storageBucket: 'reactnative-7d044.appspot.com',
  messagingSenderId: '554926718249',
  appId: '1:554926718249:ios:1ae7d18e2ebec1ae700b38',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };