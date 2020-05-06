 import {
  REPLY_MESSAGE,
  SUBSCRIBED,
  FETCHING_CHATS,
  RECEIVE_CHATS,
  CREATING_CHAT,
  ADD_CHAT,
  CHAT_ERROR,
  SIGNOUT,
  FETCHING_USER,
  NEW,
  CLEAR_TOPICS,
} from '../actions/types';

export const init = {
  messageValue: '',
  subscribedTopics: [],
  allChats: [],
  loadingChats: false,
  creatingChat: false,
  error: '',
  fetchingUser: false,
};

export default (state = init, action) => {
  switch (action.type) {
    case REPLY_MESSAGE:
      return {
        ...state,
        messageValue: action.messageValue,
      };
    case SUBSCRIBED:
      return {
        ...state,
        subscribedTopics: [
          ...state.subscribedTopics,
          action.topic,
        ],
      };
    case CLEAR_TOPICS:
      return {
        ...state,
        subscribedTopics: init.subscribedTopics,
      };
    case FETCHING_CHATS:
      return {
        ...state,
        loadingChats: true,
      };
    case RECEIVE_CHATS:
      return {
        ...state,
        allChats: action.chats,
        loadingChats: false,
      };
    case CREATING_CHAT:
      return {
        ...state,
        creatingChat: true,
        error: '',
      };
    case ADD_CHAT:
      return {
        ...state,
        allChats: [
          ...state.allChats,
          action.chat,
        ],
        creatingChat: false,
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case SIGNOUT:
      return {
        ...init,
      };
    case FETCHING_USER:
      return {
        ...state,
        fetchingUser: true,
      };
    case NEW:
      return {
        ...state,
        fetchingUser: false,
      };
    default:
      return state;
  }
};
