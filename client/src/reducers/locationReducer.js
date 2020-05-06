import {
  CONNECT,
  PUBLISH,
  RECEIVE,
  SUBSCRIBE,
  SIGNOUT,
  DEVICE_STATUS,
  MESSAGE_HANDLER_ATTACHED,
} from '../actions/types';

export const init = {
  connectPolicy: false,
  publishPolicy: false,
  subscribePolicy: false,
  receivePolicy: false,
  deviceConnected: false,
  messageHandlerAttached: false,
};

export default (state = init, action) => {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        connectPolicy: true,
      };
    case PUBLISH:
      return {
        ...state,
        publishPolicy: true,
      };
    case SUBSCRIBE:
      return {
        ...state,
        subscribePolicy: true,
      };
    case RECEIVE:
      return {
        ...state,
        receivePolicy: true,
      };
    case DEVICE_STATUS:
      return {
        ...state,
        deviceConnected: action.deviceConnected,
      };
    case MESSAGE_HANDLER_ATTACHED:
      return {
        ...state,
        messageHandlerAttached: action.attached,
      };
    case SIGNOUT:
      return {
        ...init,
        messageHandlerAttached: state.messageHandlerAttached,
        deviceConnected: state.deviceConnected, // Leave this as connected to use same mqtt client
      };
    default:
      return state;
  }
};
