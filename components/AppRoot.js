import React from 'react';
import * as firebase from 'firebase';
import Expo from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import reducer from '../redux/reducer';
import RootNavigation from './RootNavigation';
import Login from '../screens/LoginScreen';

function testButton(){
	console.log('prop function successfully passed down');
}

// Create the redux store
const initialState = {};
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(loggerMiddleware, thunkMiddleware)
);

export default () => <Provider store={store}><Login loginWithFacebook={testButton.bind(this)}/></Provider>;
