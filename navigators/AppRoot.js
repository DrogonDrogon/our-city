import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import asyncAwait from 'redux-async-await';
import rootReducer from '../reducers/rootReducer';
import RootNavigation from './RootNavigation';

// Create the redux store
const initialState = {};
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware, asyncAwait)
);

export default () => (
  <Provider store={store}>
    <RootNavigation />
  </Provider>
);
