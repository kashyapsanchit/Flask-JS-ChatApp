import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  LOAD_FRIENDS,
  LOAD_CHATS,
  LOAD_USERS,
  LOAD_NOTIFICATIONS,
  ADD_MESSAGE_TO_CHAT,
  ADD_FRIEND,
  ADD_CHAT,
  ADD_NOTIFICATION,
  SET_FRIEND_ONLINE,
  SET_FRIEND_OFFLINE,
  DISMISS_NOTIFICATION,
  DELETE_NOTIFICATION,
  LOAD_ACTIVE_CHAT_MESSAGES,
  ERROR,
  ACCOUNT_UPDATE,
  REAUTH,
  logout,
  loadChats,
  loadFriends,
  loadUsers,
  loadNotifications,
  addMessageToChat,
  addFriend,
  addNotification,
  setFriendOnline,
  setFriendOffline,
  addChat,
  setActiveChat,
  dismissNotification,
  deleteNotification,
  loadMessages,
  error,
  updateAccount
} from "../redux/actions";

const useSocket = () => {
  const loggedIn = useSelector(state => state.rootReducer.user.loggedIn);
  const dispatch = useDispatch();
  const socket = useRef(null);

  useEffect(() => {
    // If user is logged in create socket connection and set up listeners.
    if (loggedIn) {
      socket.current = io("/");
      socket.current.on(REAUTH, () => dispatch(logout()));
      socket.current.on(LOAD_CHATS, e => dispatch(loadChats(e)));
      socket.current.on(LOAD_FRIENDS, e => dispatch(loadFriends(e)));
      socket.current.on(LOAD_USERS, e => dispatch(loadUsers(e)));
      socket.current.on(LOAD_NOTIFICATIONS, e =>
        dispatch(loadNotifications(e))
      );
      socket.current.on(LOAD_ACTIVE_CHAT_MESSAGES, e =>
        dispatch(loadMessages(e))
      );
      socket.current.on(ADD_MESSAGE_TO_CHAT, e => {
        dispatch(addMessageToChat(e));
      });
      socket.current.on(ADD_FRIEND, e => dispatch(addFriend(e)));
      socket.current.on(ADD_CHAT, e => {
        dispatch(addChat(e));
        dispatch(
          setActiveChat({
            id: e.id,
            recipient: e.recipient,
            recipientId: e.recipientId,
            avatar: e.avatar
          })
        );
      });
      socket.current.on(ADD_NOTIFICATION, e => dispatch(addNotification(e)));
      socket.current.on(DISMISS_NOTIFICATION, e =>
        dispatch(dismissNotification(e))
      );
      socket.current.on(DELETE_NOTIFICATION, e =>
        dispatch(deleteNotification(e))
      );
      socket.current.on(SET_FRIEND_ONLINE, e => dispatch(setFriendOnline(e)));
      socket.current.on(SET_FRIEND_OFFLINE, e => dispatch(setFriendOffline(e)));
      socket.current.on(ERROR, e => dispatch(error(e)));
      socket.current.on(ACCOUNT_UPDATE, e => dispatch(updateAccount(e)));
    } else {
      socket.current && socket.current.close();
    }
  }, [loggedIn, dispatch]);

  return [socket, loggedIn];
};

export default useSocket;
