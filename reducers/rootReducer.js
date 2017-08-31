import { combineReducers } from 'redux';
import user from './user';
import phototags from './phototags';
import isLoading from './isLoading';
import isLoggedIn from './isLoggedIn';

const rootReducer = combineReducers({ user, phototags, isLoading, isLoggedIn });

export default rootReducer;
