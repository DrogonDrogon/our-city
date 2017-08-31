import { combineReducers } from 'redux';
import user from './user';
import phototags from './phototags';
import isPosting from './isPosting';
import isLoggedIn from './isLoggedIn';

const rootReducer = combineReducers({ user, phototags, isPosting, isLoggedIn });

export default rootReducer;
