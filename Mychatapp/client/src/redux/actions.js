export const LOAD_NOTIFICATIONS = "LOAD_NOTIFICATIONS";
export const LOAD_FRIENDS = "LOAD_FRIENDS";
export const LOAD_CHATS = "LOAD_CHATS";
export const LOAD_USERS = "LOAD_USERS";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const ADD_FRIEND = "ADD_FRIEND";
export const SET_FRIEND_ONLINE = "SET_FRIEND_ONLINE";
export const SET_FRIEND_OFFLINE = "SET_FRIEND_OFFLINE";

export const ADD_CHAT = "ADD_CHAT";
export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
export const ADD_MESSAGE_TO_CHAT = "ADD_MESSAGE_TO_CHAT";
export const LOAD_ACTIVE_CHAT_MESSAGES = "LOAD_ACTIVE_CHAT_MESSAGES";

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION";

export const ERROR = "ERROR";

export const ACCOUNT_UPDATE = "ACCOUNT_UPDATE";

export const SET_NIGHT_MODE = "SET_NIGHT_MODE";

export const REAUTH = "REAUTH";

export const updateAccount = e => ({ type: ACCOUNT_UPDATE, payload: e });

export const login = e => ({ type: LOGIN, payload: e });
export const logout = () => ({ type: LOGOUT });

export const loadChats = e => ({ type: LOAD_CHATS, payload: e });
export const loadUsers = e => ({ type: LOAD_USERS, payload: e });
export const loadFriends = e => ({ type: LOAD_FRIENDS, payload: e });
export const loadNotifications = e => ({
  type: LOAD_NOTIFICATIONS,
  payload: e
});

export const addFriend = e => ({ type: ADD_FRIEND, payload: e });
export const setFriendOnline = e => ({ type: SET_FRIEND_ONLINE, payload: e });
export const setFriendOffline = e => ({ type: SET_FRIEND_OFFLINE, payload: e });

export const addChat = e => ({ type: ADD_CHAT, payload: e });
export const setActiveChat = e => ({ type: SET_ACTIVE_CHAT, payload: e });
export const addMessageToChat = e => ({
  type: ADD_MESSAGE_TO_CHAT,
  payload: e
});
export const loadMessages = e => ({
  type: LOAD_ACTIVE_CHAT_MESSAGES,
  payload: e
});

export const addNotification = e => ({ type: ADD_NOTIFICATION, payload: e });
export const dismissNotification = e => ({
  type: DISMISS_NOTIFICATION,
  payload: e
});
export const deleteNotification = e => ({
  type: DELETE_NOTIFICATION,
  payload: e
});

export const error = e => ({ type: ERROR, payload: e });
