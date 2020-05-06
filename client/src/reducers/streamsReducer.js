import streamReducer, { init as initialStreamState } from './streamReducer';
import {
  NEW_MESSAGE,
  SIGNOUT,
} from '../actions/types';


export const init = {
  'test': initialStreamState,
};

export default (state = init, action) => {
  switch (action.type) {
    case NEW_MESSAGE: {
      return {
        ...state,
        [action.stream]: streamReducer(state[action.stream], action),
      };
    }
    case SIGNOUT:
      return init;
    default:
      return state;
  }
};
