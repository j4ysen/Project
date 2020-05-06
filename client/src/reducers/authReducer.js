 import {
  AUTH_STATUS,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGIN,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  REGISTER,
  FORM_CHANGE,
  IDENTITY_UPDATED,
  SIGNOUT,
} from '../actions/types';

export const init = {
  username: '',
  password: '',
  email: '',
  error: '',
  notice: '',
  loading: false,
  loggedIn: false,
  user: null,
  identityId: '',
};

export default (state = init, action) => {
  switch (action.type) {
    case REGISTER:
      return {
        ...state,
        loading: true,
        error: '',
        notice: '',
      };
    case REGISTER_SUCCESS:
      return {
        ...init,
        username: action.username,
        notice: 'Sign up complete. Please sign in',
      };
    case REGISTER_FAILED:
      return {
        ...init,
        error: action.error || 'Sign up failed',
      };
    case LOGIN:
      return {
        ...state,
        loading: true,
        error: '',
        notice: '',
      };
    case LOGIN_SUCCEEDED:
      return {
        ...init,
        user: action.user,
      };
    case AUTH_STATUS:
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        error: action.error || 'Error',
        password: '',
        loading: false,
      };
    case SIGNOUT:
      return init;
    case FORM_CHANGE:
      return {
        ...state,
        [action.prop]: action.value,
      };
    case IDENTITY_UPDATED:
      return {
        ...state,
        identityId: action.identityId,
      };
    default:
      return state;
  }
};
