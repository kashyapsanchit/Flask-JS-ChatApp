import { combineReducers } from "redux";
import {
  LOGIN,
  LOGOUT,
  LOAD_CHATS,
  LOAD_FRIENDS,
  LOAD_USERS,
  ADD_FRIEND,
  SET_FRIEND_OFFLINE,
  SET_FRIEND_ONLINE,
  LOAD_NOTIFICATIONS,
  ADD_CHAT,
  ADD_MESSAGE_TO_CHAT,
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  DELETE_NOTIFICATION,
  SET_ACTIVE_CHAT,
  LOAD_ACTIVE_CHAT_MESSAGES,
  ACCOUNT_UPDATE,
  SET_NIGHT_MODE
} from "./actions";
const initialState = {
  friends: [],
  chats: [],
  accounts: [],
  activeChat: {
    id: null,
    recipientId: null,
    messages: []
  },
  user: {
    loggedIn: false,
    id: null,
    username: null,
    avatar: null,
    notifications: [],
    visible_in_searches: false
  },
  ui: {
    mode: false
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: { ...state.user, loggedIn: true, ...action.payload }
      };

    case LOGOUT:
      return initialState;

    case SET_NIGHT_MODE:
      return { ...state, ui: { mode: !state.ui.mode } };

    case ACCOUNT_UPDATE:
      return { ...state, user: { ...state.user, ...action.payload } };

    case LOAD_FRIENDS:
      return { ...state, friends: [...action.payload] };

    case LOAD_CHATS:
      return { ...state, chats: [...action.payload] };

    case LOAD_USERS:
      return { ...state, accounts: [...action.payload] };

    case ADD_FRIEND:
      return { ...state, friends: friendsReducer(state.friends, action) };

    case ADD_CHAT:
    case ADD_MESSAGE_TO_CHAT:
      return {
        ...state,
        chats: chatsReducer(state.chats, action),
        activeChat: activeChatReducer(state.activeChat, action)
      };

    case SET_ACTIVE_CHAT:
    case LOAD_ACTIVE_CHAT_MESSAGES:
      return {
        ...state,
        activeChat: activeChatReducer(state.activeChat, action)
      };

    case SET_FRIEND_ONLINE:
    case SET_FRIEND_OFFLINE:
      return {
        ...state,
        friends: friendsReducer(state.friends, action),
        chats: chatsReducer(state.chats, action)
      };

    case ADD_NOTIFICATION:
    case LOAD_NOTIFICATIONS:
    case DISMISS_NOTIFICATION:
    case DELETE_NOTIFICATION:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: notificationsReducer(state.user.notifications, action)
        }
      };
    default:
      return state;
  }
};

const notificationsReducer = (
  state = initialState.user.notifications,
  action
) => {
  switch (action.type) {
    case LOAD_NOTIFICATIONS:
      return [...action.payload];
    case ADD_NOTIFICATION:
      return [...state, action.payload];
    case DELETE_NOTIFICATION:
      let j = state.findIndex(i => i.id === action.payload);
      return [...state.slice(0, j), ...state.slice(j + 1)];
    case DISMISS_NOTIFICATION:
      let k = state.findIndex(i => i.id === action.payload);
      return [
        ...state.slice(0, k),
        { ...state[k], dismissed: true },
        ...state.slice(k + 1)
      ];
    default:
      return state;
  }
};

const friendsReducer = (state = initialState.friends, action) => {
  switch (action.type) {
    case ADD_FRIEND:
      return [...state, action.payload];
    case SET_FRIEND_ONLINE:
      return state.map(d =>
        d.id === action.payload ? { ...d, active: true } : d
      );
    case SET_FRIEND_OFFLINE:
      return state.map(d =>
        d.id === action.payload ? { ...d, active: false } : d
      );
    default:
      return state;
  }
};

const chatsReducer = (state = initialState.chats, action) => {
  switch (action.type) {
    case ADD_CHAT:
      return [...state, action.payload];
    case ADD_MESSAGE_TO_CHAT:
      return state.map(d =>
        d.id === action.payload.chatId
          ? {
              ...d,
              last_message: action.payload.last_message,
              last_message_timestamp: action.payload.last_message_timestamp
            }
          : d
      );
    case SET_FRIEND_ONLINE:
      return state.map(d =>
        d.recipientId === action.payload ? { ...d, active: true } : d
      );
    case SET_FRIEND_OFFLINE:
      return state.map(d =>
        d.recipientId === action.payload ? { ...d, active: false } : d
      );
    default:
      return state;
  }
};

const activeChatReducer = (state = initialState.activeChat, action) => {
  switch (action.type) {
    case ADD_MESSAGE_TO_CHAT:
      if (action.payload.chatId !== state.id) return state;
      return {
        ...state,
        messages: [...state.messages, action.payload.message]
      };
    case LOAD_ACTIVE_CHAT_MESSAGES:
      return { ...state, messages: [...action.payload] };
    case SET_ACTIVE_CHAT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer
});
