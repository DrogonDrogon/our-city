import { combineReducers } from 'redux';
import user from './user';
import phototags from './phototags';
import isLoading from './isLoading';
import isLoggedIn from './isLoggedIn';
import userFavs from './userFavs';

const rootReducer = combineReducers({ user, phototags, isLoading, isLoggedIn, userFavs });

export default rootReducer;
