import datetime, os, eventlet, uuid
from flask import Flask, request, make_response, json, render_template
from flask_socketio import SocketIO, join_room, leave_room, disconnect
from flask_login import login_user, current_user, logout_user
from sqlalchemy_classes import User, Message, Chat, Notification
from sqlalchemy_base import Session, Base, engine
from server_helpers import (
    FlaskLoginUser,
    logon_session,
    socket_session,
    disconnect_unauthorised,
    login_manager,
    verify_password,
    image_handler,
)

eventlet.monkey_patch()
app = Flask(
    __name__, template_folder="./client/build", static_folder="./client/build/static"
)
login_manager.init_app(app)
socket = SocketIO(app, async_mode="eventlet")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


"""
Catch all for react SPA.
"""


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


"""
Register route, handles parsing user info, populating user and adding to DB.
"""


@app.route("/api/register", methods=["POST"])
def handle_register():
    try:
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        firstname = request.json.get("firstname", None)
        lastname = request.json.get("lastname", None)
        email = request.json.get("email", None)

        # Check username, password, name and email are not null/empty string.
        if "" or None in {username, password, firstname, lastname, email}:
            return make_response("", 400)

        s = Session()
        # Check if user already exists.
        if s.query(User).filter(User.username == username).first():
            return make_response("", 409)

        # Create User object, add user to DB.
        user = User(username, password, firstname, lastname, email)
        s.add(user)
        s.commit()

        # Return 201 on successful creation of user
        return make_response("", 201)

    except Exception as err:
        print(err)
        # Return 500 on error
        return make_response("", 500)
    finally:
        if "s" in locals():
            s.close()


@app.route("/api/logout", methods=["POST"])
def handle_logout():
    try:
        sid = socket_session.get(current_user.user_id).decode("utf-8")
        s = Session()
        login_status("SET_FRIEND_OFFLINE", current_user.user_id, s)
        if sid:
            socket.emit("LOGOUT", room=sid)
            logon_session.delete(current_user.session)
            socket_session.delete(current_user.user_id)
            disconnect(sid=sid, namespace="/")
            logout_user()
        return make_response("Logged out", 200)
    except Exception as err:
        print(err)
    finally:
        if "s" in locals():
            s.close()


"""
Login route, handles verifying user provided credentials, adding session to Redis and
defining the length of the session dependant on user selecting 'remember me' or not.
"""


@app.route("/api/login", methods=["POST"])
def handle_login():
    try:
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        remember = request.json.get("remember", False)

        # Check username and password are not null/empty string.
        if None or "" in {username, password}:
            return make_response("", 401)

        # Query user from DB.
        s = Session()
        user = s.query(User).filter(User.username == username).first()

        # Return a 401 if user is not found
        if not user:
            return make_response("", 401)

        # If user is in DB, verifiy password:
        if not verify_password(password, user.password):
            return make_response("", 401)

        user.last_login = datetime.datetime.utcnow()
        s.commit()

        # Create and populate SessionUser object
        flaskLoginUser = FlaskLoginUser(
            username, user.id, str(uuid.uuid4()), user.avatar
        )

        # Store session and username in redis
        logon_session.set(
            flaskLoginUser.session, json.dumps([username, user.id, user.avatar])
        )

        # Set expiration of Redis entry dependant on remember value; true = 7 days, false = 6 hours.
        if not remember:
            logon_session.expireat(
                flaskLoginUser.session,
                int(
                    (
                        datetime.datetime.utcnow() + datetime.timedelta(hours=6)
                    ).timestamp()
                ),
            )
        if remember:
            logon_session.expireat(
                flaskLoginUser.session,
                int(
                    (
                        datetime.datetime.utcnow() + datetime.timedelta(days=7)
                    ).timestamp()
                ),
            )

        # Log user in.
        login_user(
            flaskLoginUser, remember=remember, duration=datetime.timedelta(days=7)
        )
        # Return success code along with username.
        return make_response(
            json.dumps(
                {
                    "username": username,
                    "userId": user.id,
                    "avatar": user.avatar,
                    "visible_in_searches": user.visible_in_searches,
                }
            ),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as err:
        print(err)
        return make_response("", 500)
    finally:
        if "s" in locals():
            s.close()


"""
Error function to emit an error message to the client with a messaged to display.
"""


def genError(sid, msg):
    try:
        s = Session()
        user = s.query(User).get(current_user.user_id)
        notification = Notification("ERROR", "System", msg)
        user.notifications.append(notification)
        s.commit()
        return socket.emit(
            "ADD_NOTIFICATION",
            {
                "id": notification.id,
                "type": notification.type,
                "dismissed": notification.dismissed,
                "message": notification.message,
            },
            room=sid,
        )
    except Exception as err:
        print(err)
    finally:
        if "s" in locals():
            s.close()


"""
Retrieves the users chats from the DB, parses the data and returns a dict with the chat info
and the last 50 messages for the chat. Each chat(socketio room) then be 'joined'.
The data will then be emitted to the client.
"""


def getChats(sid, s):
    try:
        if sid in {None, ""}:
            raise ValueError("SID and/or session not provided!")
        query = s.query(User).get(current_user.user_id).chats.all()
        chats = [
            {
                "id": i.id,
                "recipient": i.users.filter(User.id != current_user.user_id)
                .first()
                .username,
                "recipientId": i.users.filter(User.id != current_user.user_id)
                .first()
                .id,
                "active": socket_session.get(
                    i.users.filter(User.id != current_user.user_id).first().id
                )
                != None,
                "avatar": i.users.filter(User.id != current_user.user_id)
                .first()
                .avatar,
                "last_message": i.last_message,
                "last_message_timestamp": str(i.last_message_timestamp),
            }
            for i in query
        ]

        for i in chats:
            join_room(i["id"])
        socket.emit("LOAD_CHATS", chats, room=sid) 

    except ValueError as err:
        print(err)
        genError(request.sid, err)


"""
Retrieves the users friends from the DB, parses the data and emits the data to the client.
"""


def getFriends(sid, s):
    try:
        if sid in {None, ""}:
            raise TypeError("SID and/or session not provided!")
        friends = s.query(User).get(current_user.user_id).friends
        socket.emit(
            "LOAD_FRIENDS",
            [
                {
                    "id": i.id,
                    "username": i.username,
                    "avatar": i.avatar,
                    "active": socket_session.get(i.id) != None,
                }
                for i in friends
            ],
            room=sid,
        )
    except TypeError as err:
        print(err)
        genError(request.sid, err)


"""
Retrieves the users notifications from the DB, parses the data and emits to the client.
"""


def getNotifications(sid, s):
    try:
        if sid in {None, ""}:
            raise TypeError("SID and/or session not provided!")
        notifications = s.query(User).get(current_user.user_id).notifications.all()
        socket.emit(
            "LOAD_NOTIFICATIONS",
            [
                {
                    "id": x.id,
                    "sender": x.sender,
                    "type": x.type,
                    "dismissed": x.dismissed,
                    "message": x.message,
                    "avatar": x.avatar,
                }
                for x in notifications
            ],
            room=sid,
        )
    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)


"""
Emits a 'FRIEND_ACTIVE' or 'FRIEND_INACTIVE' message to a users friends to display if the user is online or not.
"""


def login_status(status, id, s):
    try:
        friends = s.query(User).get(id).friends
        for i in friends:
            friend_sid = socket_session.get(i.id)
            if friend_sid:
                socket.emit(status, id, room=friend_sid.decode("utf-8"))
    except (ValueError, TypeError) as err:
        print(err)


"""
On connection to socket, the user is added to the socket s Redis(used to determine if user is online or not),
emits chats, friends, notifications and login status.
"""


@socket.on("connect")
@disconnect_unauthorised
def handle_user_connect():
    print("CONNECTED_USER: %s" % current_user.user)
    try:
        # Store session details in redis
        socket_session.set(current_user.user_id, request.sid)

        # Get initial data and send to client
        s = Session()
        getChats(request.sid, s)
        getFriends(request.sid, s)
        getNotifications(request.sid, s)

        # Send login status to all friends
        login_status("SET_FRIEND_ONLINE", current_user.user_id, s)

    except Exception as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Removes the use from socket s Redis and emits the user's login status
"""


@socket.on("disconnect")
@disconnect_unauthorised
def handle_user_disconnect():
    try:
        print("DISCONNECTED: ", current_user.user)
        # Check if user is anonymous(when user logs out)
        if not current_user.is_anonymous:
            return

        # Delete the users session from Redis
        socket_session.delete(current_user.user_id)

        # Create session and pass to login_status function
        s = Session()
        login_status("SET_FRIEND_OFFLINE", current_user.user_id, s)

    except Exception as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Emits data for all users to client, used for searching.
Excludes users that have not opted in to being visible in searches.
"""


@socket.on("LOAD_USERS")
@disconnect_unauthorised
def handle_all_accounts():
    try:
        s = Session()
        query = (
            s.query(User)
            .filter(User.visible_in_searches == True, User.id != current_user.user_id)
            .all()
        )
        socket.emit(
            "LOAD_USERS",
            [{"id": i.id, "username": i.username, "avatar": i.avatar} for i in query],
            room=request.sid,
        )
    except Exception as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Stores message in DB and emits message to intended recipient/chat.
"""


@socket.on("ADD_MESSAGE_TO_CHAT")
@disconnect_unauthorised
def handle_new_message(data=None):
    try:
        if data.get("chat") in {None, ""}:
            raise TypeError("Chat ID not provided!")

        if data.get("message") in {None, ""}:
            if None or "" in {data.get("image"), data.get("extension")}:
                raise TypeError("Message, image and/or extension not provided.")

        s = Session()
        chat = s.query(Chat).get(data["chat"])

        if not chat:
            raise ValueError("Chat not found!")

        m = Message(current_user.user)
        if data.get("message"):
            m.message = data["message"]
            chat.last_message = f"{data['message'][:16]}..."

        if data.get("image") and data.get("extension"):
            fileName = image_handler(data["image"], data["extension"])
            if not fileName:
                raise ValueError("File not created")
            m.image = fileName
            chat.last_message = "Image"

        chat.messages.append(m)
        chat.last_message_timestamp = m.created_at
        s.commit()

        socket.emit(
            "ADD_MESSAGE_TO_CHAT",
            {
                "chatId": data["chat"],
                "last_message": chat.last_message,
                "last_message_timestamp": str(chat.last_message_timestamp)[:5],
                "message": {
                    "username": current_user.user,
                    "message": m.message,
                    "id": m.id,
                    "image": m.image,
                },
            },
            room=data["chat"],
        )

    except (TypeError, ValueError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Loads messages for the currently active chat
"""


@socket.on("LOAD_ACTIVE_CHAT_MESSAGES")
@disconnect_unauthorised
def handleLoadMessages(chatId=None):
    try:
        if chatId in {None, ""}:
            raise TypeError("Chat id not provided!")

        s = Session()
        chat = s.query(Chat).get(chatId)

        if not chat:
            return ValueError("Invalid chat id provided!")

        messages = chat.messages.limit(50).all()
        socket.emit(
            "LOAD_ACTIVE_CHAT_MESSAGES",
            [
                {
                    "id": i.id,
                    "message": i.message,
                    "username": i.username,
                    "timestamp": str(i.created_at),
                    "image": i.image,
                }
                for i in messages
            ],
            room=request.sid,
        )

    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)

    finally:
        if "s" in locals():
            s.close


"""
Creates a chat, adds the sender and recipient, Stores chat in DB and emits to the recipient the chat details
"""


@socket.on("ADD_CHAT")
@disconnect_unauthorised
def handle_new_chat(user=None):
    try:
        if user in {None, ""}:
            raise TypeError("User not provided.")

        s = Session()
        sender = s.query(User).filter(User.username == current_user.user).first()
        recipient = s.query(User).filter(User.username == user).first()

        if not recipient:
            raise ValueError("User doesn't exist")

        # Check if chats already exists (client should do this but just an extra check)
        existingChat = (
            s.query(Chat)
            .filter(Chat.users.contains(sender), Chat.users.contains(recipient))
            .first()
        )
        if existingChat:
            raise ValueError("Chat already exists")

        chat = Chat()
        sender.chats.append(chat)
        recipient.chats.append(chat)
        s.commit()

        join_room(chat.id)
        socket.emit(
            "ADD_CHAT",
            {
                "id": chat.id,
                "recipient": recipient.username,
                "recipientId": recipient.id,
                "avatar": recipient.avatar,
            },
            room=request.sid,
        )

        recipient_sid = socket_session.get(recipient.id)

        if recipient_sid:
            join_room(chat.id, sid=recipient_sid.decode("utf-8"))
            socket.emit(
                "ADD_CHAT",
                {
                    "id": chat.id,
                    "recipient": current_user.user,
                    "recipientId": sender.id,
                    "avatar": sender.avatar,
                    "last_message": "",
                    "last_message_timestamp": "",
                },
                room=recipient_sid.decode("utf-8"),
            )
    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
If request has not already been sent the request will be added to recipients notifications,
if recipient is online(checks socket s redis) the notiifcation will be sent otherwise
the notification will be displayed when the user next logs in.
"""


@socket.on("FRIEND_REQUEST")
@disconnect_unauthorised
def handleFriendRequest(id=None):
    print("AVATAR: ", current_user.avatar)
    try:
        if None or "" in {id}:
            raise ValueError("Id and/or Username not provided!")

        s = Session()
        recipient = s.query(User).get(id)

        if not recipient:
            raise ValueError("Recipient not found!")

        # Check they are not already friends
        if recipient.friends.filter(User.id == current_user.user_id).first():
            return False

        # Check a request has not already been sent and no
        # action has been taken by the user
        existingNotification = recipient.notifications.filter(
            Notification.sender == current_user.user,
            Notification.type == "FRIEND_REQUEST",
        ).first()

        if existingNotification:
            return False

        n = Notification(
            "FRIEND_REQUEST",
            current_user.user,
            f"{current_user.user} sent you a friend request",
            current_user.avatar,
        )
        recipient.notifications.append(n)
        s.commit()

        recipient_sid = socket_session.get(id)
        if recipient_sid:
            socket.emit(
                "ADD_NOTIFICATION",
                {
                    "id": n.id,
                    "type": n.type,
                    "dismissed": n.dismissed,
                    "sender": current_user.user,
                    "message": n.message,
                    "avatar": current_user.avatar,
                },
                room=recipient_sid.decode("utf-8"),
            )
    except ValueError as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Adds the friend to both users, There is a better way of doing this and I will likely refactor this at a later time.
"""


@socket.on("FRIEND_REQUEST_ACCEPTED")
@disconnect_unauthorised
def handle_friend_request_accepted(data=None):
    try:
        if None or "" in {data.get("username"), data.get("id")}:
            raise TypeError("Id and/or Username not provided.")

        s = Session()

        # Get sender from DB
        sender = s.query(User).filter(User.username == data["username"]).first()

        if not sender:
            raise ValueError("Sender not found!")

        # Get recipient from DB
        recipient = s.query(User).get(current_user.user_id)

        if not recipient:
            raise ValueError("Recipient not found!")

        # Create friendship
        sender.add_friend(recipient)
        recipient.add_friend(sender)

        # Delete request notification and emit change to client
        notification = s.query(Notification).get(data["id"])
        s.delete(notification)
        socket.emit("DELETE_NOTIFICATION", data["id"], room=request.sid)

        # Create Notification for request acceptance.
        n = Notification(
            "FRIEND_REQUEST_ACCEPTED",
            current_user.user,
            f"{recipient.username} accepted your friend request.",
            current_user.avatar,
        )
        sender.notifications.append(n)
        s.commit()

        # Send friend details to recipient (request.sid),. the user that accepted the request.
        socket.emit(
            "ADD_FRIEND",
            {
                "id": sender.id,
                "username": sender.username,
                "active": False,
                "avatar": sender.avatar,
            },
            room=request.sid,
        )

        # Check if user that sent friend request is currently online
        senderSession = socket_session.get(sender.id)
        if senderSession:
            socket.emit(
                "ADD_NOTIFICATION",
                {
                    "type": n.type,
                    "sender": recipient.username,
                    "message": n.message,
                    "dismissed": n.dismissed,
                    "avatar": n.avatar,
                },
                room=senderSession.decode("utf-8"),
            )
            socket.emit(
                "ADD_FRIEND",
                {"id": recipient.id, "username": recipient.username, "active": True},
                room=senderSession.decode("utf-8"),
            )

    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Removes the notification, Does not notify the sender.
"""


@socket.on("DELETE_NOTIFICATION")
@disconnect_unauthorised
def handle_friend_request_rejected(id=None):
    try:
        if id in {None, ""}:
            raise TypeError("Notification ID not provided.")

        s = Session()
        n = s.query(Notification).get(id)

        if n:
            s.delete(n)
            s.commit()

        # Covers situations where the DB is out of sync with the client
        socket.emit("DELETE_NOTIFICATION", id, room=request.sid)

    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Sets the notification to dismissed.
"""


@socket.on("DISMISS_NOTIFICATION")
@disconnect_unauthorised
def handleNotificationDismiss(id=None):
    try:
        if id in {None, ""}:
            raise TypeError("Notification ID not provided.")

        s = Session()
        n = s.query(Notification).get(id)
        if n:
            n.dismissed = True
            s.commit()

        # Covers situations where the DB is out of sync with the client
        socket.emit("DISMISS_NOTIFICATION", id, room=request.sid)
    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


"""
Handles account updates, options avatar etc.
Need to add removal of existing avatar image when new image is uploaded.
"""


@socket.on("ACCOUNT_UPDATE")
@disconnect_unauthorised
def handleUserSettings(data=None):
    try:
        if None or "" in {data.get("update"), data.get("value")}:
            raise TypeError("Update option and/or option value not provided!")

        s = Session()
        user = s.query(User).get(current_user.user_id)

        if data["update"] == "visible_in_searches":
            user.visible_in_searches = data["value"]
            s.commit()
            socket.emit(
                "ACCOUNT_UPDATE", {data["update"]: data["value"]}, room=request.sid
            )

        if data["update"] == "avatar":
            fileName = image_handler(data["value"], data["extension"])
            if fileName:
                user.avatar = fileName
                s.commit()
                socket.emit(
                    "ACCOUNT_UPDATE", {data["update"]: user.avatar}, room=request.sid
                )
            else:
                raise ValueError("Filename not generated")

    except (ValueError, TypeError) as err:
        print(err)
        genError(request.sid, err)
    finally:
        if "s" in locals():
            s.close()


if __name__ == "__main__":
    socket.run(app, debug=True)
