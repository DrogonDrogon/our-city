import { combineReducers } from 'redux';
import user from './user';
import phototags from './phototags';

const rootReducer = combineReducers({ user, phototags });

export default rootReducer;
