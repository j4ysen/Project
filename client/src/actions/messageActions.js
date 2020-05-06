import moment from 'moment';
import uuid from 'uuid/v4';
import * as log from 'loglevel';

import * as ApiGateway from '../lib/api-gateway';
import {
  NEW_MESSAGE,
  NEW,
  FETCHING_USER,
} from './types';
import { identityIdFromNewMessageTopic, streamFromNewMessageTopic } from '../lib/topicHelper';


const newUserAdd = (dispatch, identityId, user) => {
  dispatch({ type: NEW, identityId, user });
};


const newMessageAdd = (dispatch, message, username, time, id, stream) => {
  dispatch({ type: NEW_MESSAGE, message, username, time, id, stream });
};




export const newMessage = (message, topic) => (
  (dispatch, getState) => {

    const identityId = identityIdFromNewMessageTopic(topic);
    const stream = streamFromNewMessageTopic(topic);
    const user = getState().users[identityId];
    
    if (user) {
      newMessageAdd(dispatch, message, user.username, moment().format(), uuid(), stream);
      return Promise.resolve();
    }
    dispatch({ type: FETCHING_USER });
    return ApiGateway.fetchUser(identityId)
      .then((fetchedUser) => {
        newUserAdd(dispatch, identityId, fetchedUser);
        newMessageAdd(dispatch, message, fetchedUser.username, moment().format(), uuid(), stream);
      })
      .catch((error) => {
        log.error(error);
      });
  }
);
