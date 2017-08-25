import React from 'react';
import * as firebase from 'firebase';
import Expo from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import reducer from '../redux/reducer';
import config from '../config/config.js';
import RootNavigation from './RootNavigation';
import Login from '../screens/LoginScreen';


// Initialize Firebase	
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
};

firebase.initializeApp(firebaseConfig);

function testButton(){
	console.log('prop function successfully passed down');
  loginWithFacebook();
}
// Listen for authentication state to change.
firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    console.log("We are authenticated now!");
  }

  // Do other things
});

async function loginWithFacebook() {
  console.log('fire the laser');
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    config.facebook.APP_ID,
    { permissions: ['public_profile'] }
  );

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    firebase.auth().signInWithCredential(credential).catch((error) => {
      // Handle Errors here.
    });
  }
}


// Create the redux store
const initialState = {};
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(loggerMiddleware, thunkMiddleware)
);

export default () => <Provider store={store}><Login loginWithFacebook={testButton.bind(this)}/></Provider>;
