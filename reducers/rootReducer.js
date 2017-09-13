import { combineReducers } from 'redux';
import user from './user';
import phototags from './phototags';
import isLoading from './isLoading';
import isLoggedIn from './isLoggedIn';
import userFavs from './userFavs';
import location from './location';
import badges from './badges';
const rootReducer = combineReducers({
  user,
  phototags,
  isLoading,
  isLoggedIn,
  userFavs,
  location,
  badges,
});

export default rootReducer;
