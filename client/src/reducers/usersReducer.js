import { NEW } from '../actions/types';

export const init = {
};

export default (state = init, action) => {
  switch (action.type) {
    case NEW:
      return {
        ...state,
        [action.identityId]: action.user,
      };
    default:
      return state;
  }
};
