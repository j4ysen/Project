import * as log from 'loglevel';

import * as Cognito from '../lib/aws-cognito';
import * as ApiGateway from '../lib/api-gateway';
import * as IoT from '../lib/aws-iot';
import history from '../lib/history';
import {
  AUTH_STATUS,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGIN,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  REGISTER,
  FORM_CHANGE,
  NEW,
  SIGNOUT,
  CLEAR_TOPICS,
  MESSAGE_HANDLER_ATTACHED,
} from './types';


const signOutUserSuccess = (dispatch, getState) => {
  sessionStorage.setItem('isLoggedIn', 'false');
  const topics = getState().chat.subscribedTopics;
  IoT.unsubscribeFromTopics(topics);
  dispatch({ type: CLEAR_TOPICS });
  dispatch({ type: MESSAGE_HANDLER_ATTACHED, attached: false });
  dispatch({ type: AUTH_STATUS, loggedIn: false });
  dispatch({ type: SIGNOUT });
};


export const handleSignOut = () => (
  (dispatch, getState) => (
    Cognito.logout()
      .then(() => {
        Cognito.clearCachedId();
        sessionStorage.clear();
        localStorage.clear();
        signOutUserSuccess(dispatch, getState);
      })
  )
);


const loginUserSuccess = (dispatch, user, credentials, token) => {

  sessionStorage.setItem('credentials', JSON.stringify(credentials));
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('providerToken', token);
  dispatch({ type: LOGIN_SUCCEEDED, user });
  dispatch({ type: AUTH_STATUS, loggedIn: true });
  const identityId = Cognito.getIdentityId();
  ApiGateway.createUser(user.username)
    .then((createdUser) => {
      log.debug('created user', createdUser);
      dispatch({ type: NEW, identityId, user: createdUser });
    });
};

export const login = (username, password) => (
  (dispatch) => {
    dispatch({ type: LOGIN });

    let len = localStorage.length;
    for (let i = 0; i < len; i += 1, len = localStorage.length) {
      const key = localStorage.key(i);
      if (key.includes('CognitoIdentityServiceProvider') || key.includes('aws.cognito.identity')) {
        log.debug('Removed from storage:', key);
        localStorage.removeItem(key);
      }
    }
    return Cognito.login(username, password)
      .then(userData => loginUserSuccess(dispatch, userData.userObj, userData.credentials, 'user_pool', ''))
      .catch((error) => {
        dispatch({ type: LOGIN_FAILED, error });
        log.error(error);
      });
  }
);

export const authStatusChange = loggedIn => ({
  type: AUTH_STATUS,
  loggedIn,
});

export const formChange = (prop, value) => ({
  type: FORM_CHANGE,
  prop,
  value,
});



export const register = (username, password, email) => (
  (dispatch) => {
    dispatch({ type: REGISTER });
    return Cognito.register(username, password, email)
      .then(registeredUsername => {
        dispatch({ type: REGISTER_SUCCESS, username });
        history.push('/login');
      })
      .catch(error => {
        dispatch({ type: REGISTER_FAILED, error });
      });
  }
);
