import messagesReducer, { init as initialMessagesState } from './messagesReducer';
import {
  NEW_MESSAGE,
} from '../actions/types';

export const init = {
  messages: initialMessagesState,
};

export default (state = init, action) => {
  console.log(action);
  switch (action.type) {
    case NEW_MESSAGE: {
      return {
        ...state,
        messages: messagesReducer(state.messages, action),
      };
    }

    default:
      return state;
  }
};
