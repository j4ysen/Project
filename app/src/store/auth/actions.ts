
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

const LOGGED_IN_STATUS_CHANGED = 'LOGGED_IN_STATUS_CHANGED';
const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
const LOGIN_USER_FAILED = 'LOGIN_USER_FAILED';
const LOGIN_USER = 'LOGIN_USER';
const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
const REGISTER_USER_FAILED = 'REGISTER_USER_FAILED';
const REGISTER_USER = 'REGISTER_USER';
const AUTH_FORM_UPDATE = 'AUTH_FORM_UPDATE';
const IDENTITY_UPDATED = 'IDENTITY_UPDATED';
const LOGOUT = 'LOGOUT';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const DELETE_POSTS = 'DELETE_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const FAIL_RECEIVE_POSTS = 'FAIL_RECEIVE_POSTS';

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';

export const login = (
    username: string,
    email: string,
    password: string,
): LoginAction => ({
    type: LOGIN,
    username,
    email,
    password,
});

export const register = (
    username: string,
    email: string,
    password: string,
): SignUpAction => ({
    type: REGISTER,
    username,
    email,
    password,
});

