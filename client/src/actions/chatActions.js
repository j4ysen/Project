 
import * as log from 'loglevel';

import moment, { now } from 'moment';
import uuid from 'uuid/v4';

import {
  REPLY_MESSAGE,
  SUBSCRIBED,
  FETCHING_CHATS,
  RECEIVE_CHATS,
  CREATING_CHAT,
  ADD_CHAT,
  CHAT_ERROR,
  NEW_MESSAGE,
} from './types';
import * as ApiGateway from '../lib/api-gateway';
import * as IoT from '../lib/aws-iot';
import history from '../lib/history';



export const messageValueChanged = messageValue => ({
  type: REPLY_MESSAGE,
  messageValue,
});

export const subscribe = topic => (
  (dispatch, getState) => {
    const { subscribedTopics } = getState().chat;
    if (subscribedTopics.includes(topic)) {
      log.debug('Already subscribed: ', topic);
    } else {
      IoT.subscribe(topic);
      dispatch({ type: SUBSCRIBED, topic });

      ApiGateway.fetchChatHistory("/app/" + topic.replace("/+",''))
      .then((chats) => {
        chats.forEach(
          (chat) => {
            dispatch({ type: NEW_MESSAGE, message: chat.payload, username: chat.admin, time: chat.timestamp, id: chat.id, stream: topic.replace("/+",'') });
          }
        )
      });
    }
    return Promise.resolve();
  }
);


export const fetchAllChats = () => (
  (dispatch) => {
    dispatch({ type: FETCHING_CHATS });
    return ApiGateway.fetchAllChats()
      .then((chats) => {
        dispatch({ type: RECEIVE_CHATS, chats });
      });
  }
);


export const setTimetable = (stream, timetables) => (
  (dispatch) => {

    return ApiGateway.setTimetableChats(timetables, stream).then((chat) =>{
      fetchAllChats()
      
    })

  }
);

export const fetchTimetableChats = (stream, timetables) => (
  (dispatch) => {

    return ApiGateway.fetchTimetableChats( stream).then((chat) =>{
      console.log("Timetable", chat)
    })

  }
);

export const createChat = (stream) => (
  (dispatch) => {
    dispatch({ type: CREATING_CHAT });

    return ApiGateway.createChat(`stream/${stream}`)
      .then((chat) => {
        dispatch({ type: ADD_CHAT, chat });
        history.push(`/app/${chat.name}`);
      })
      .catch((response) => {
        dispatch({ type: CHAT_ERROR, error: JSON.parse(response.message).error });
      });
  }
);
