import * as ApiGateway from '../lib/api-gateway';
import * as Cognito from '../lib/aws-cognito';
import * as IoT from '../lib/aws-iot';
import {
  CONNECT,
  PUBLISH,
  SUBSCRIBE,
  RECEIVE,
  DEVICE_STATUS,
  IDENTITY_UPDATED,
  MESSAGE_HANDLER_ATTACHED,
} from './types';
import { handleSignOut } from './authActions';
import { newMessage } from './messageActions';



export const fetchPolicies = (connectCallback, closeCallback) => (
  async (dispatch, getState) => {
    const {
      connectPolicy,
      publishPolicy,
      subscribePolicy,
      receivePolicy,
    } = getState().location;

    const loggedIn = await Cognito.authorize();
    if (!loggedIn) {
      handleSignOut()(dispatch);
      return Promise.resolve();
    }
    const identityId = Cognito.getIdentityId();
    dispatch({ type: IDENTITY_UPDATED, identityId });
    const credentials = JSON.parse(sessionStorage.getItem('credentials'));

    IoT.initNewClient(credentials);
    IoT.attachConnectHandler(connectCallback);
    IoT.attachCloseHandler(closeCallback);

    if (!connectPolicy) {
      ApiGateway.connect().then(() =>
        dispatch({ type: CONNECT }));
    }

    if (!publishPolicy) {
      ApiGateway.publish().then(() =>
        dispatch({ type: PUBLISH }));
    }

    if (!subscribePolicy) {
      ApiGateway.subscribe().then(() =>
        dispatch({ type: SUBSCRIBE }));
    }

    if (!receivePolicy) {
      ApiGateway.receive().then(() =>
        dispatch({ type: RECEIVE }));
    }

    return Promise.resolve();
  }
);


export const deviceStatus = status => ({
  type: DEVICE_STATUS,
  deviceConnected: status,
});

const message_redux_handler = (dispatch, getState) => (
  (topic, jsonPayload) => {
    const payload = JSON.parse(jsonPayload.toString());
    const { message } = payload;
    newMessage(message, topic)(dispatch, getState);
  }
);

export const attachMessageHandler = () => (
  (dispatch, getState) => {
    const attached = getState().location.messageHandlerAttached;
    if (!attached) {
      IoT.attachMessageHandler(message_redux_handler(dispatch, getState));
    }
    dispatch({ type: MESSAGE_HANDLER_ATTACHED, attached: true });
    return Promise.resolve();
  }
);
