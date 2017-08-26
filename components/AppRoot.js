import React from 'react';
import * as firebase from 'firebase';
import Expo from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import reducer from '../redux/reducer';
import LoginScreen from '../screens/LoginScreen';
import RootNavigation from './RootNavigation';

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