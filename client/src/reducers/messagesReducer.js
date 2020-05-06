import {
  NEW_MESSAGE,
} from '../actions/types';

import moment from 'moment';
const messageTime = moment('20171024');

export const init = [];

export default (state = init, action) => {
  switch (action.type) {
    case NEW_MESSAGE:
      return [
        ...state,
        {
          author: action.username,
          time: action.time,
          body: action.message,
          id: action.id,
        },
      ];
    default:
      return state;
  }
};
