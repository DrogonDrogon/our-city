import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import rootReducer from '../reducers/rootReducer';
import RootNavigation from './RootNavigation';

// Create the redux store
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(loggerMiddleware, thunkMiddleware)
);

export default () =>
  <Provider store={store}>
    <RootNavigation />
  </Provider>;
