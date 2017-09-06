import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import rootReducer from '../reducers/rootReducer';
import RootNavigation from './RootNavigation';
import asyncAwait from 'redux-async-await';

// Create the redux store
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware, asyncAwait)
);

export default () => (
  <Provider store={store}>
    <RootNavigation />
  </Provider>
);
