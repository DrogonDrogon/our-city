import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import reducer from '../redux/reducer';
import RootNavigation from './RootNavigation';
import Login from '../screens/LoginScreen';

// Listen for authentication state to change.
firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    console.log("We are authenticated now!");
  }

  // Do other things
});

async function loginWithFacebook() {
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

export default () =>
  <Provider store={store}>
    <RootNavigation />
  </Provider>;
