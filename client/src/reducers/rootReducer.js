import { combineReducers } from 'redux';
import streams from './streamsReducer';
import auth from './authReducer';
import chat from './chatReducer';
import users from './usersReducer';
import location from './locationReducer';

const rootReducer = combineReducers({
  streams,
  auth,
  chat,
  users,
  location,
});

export default rootReducer;
