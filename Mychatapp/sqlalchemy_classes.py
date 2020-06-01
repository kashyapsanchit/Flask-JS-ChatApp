from sqlalchemy import (
    Integer,
    Column,
    String,
    TIMESTAMP,
    ForeignKey,
    Boolean,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship, synonym
from sqlalchemy_base import Base, Session, engine
from datetime import datetime
from uuid import uuid4
from server_helpers import hash_password


class UsersChats(Base):
    __tablename__ = "users_chats"
    user_id = Column(String(150), ForeignKey("users.id"), primary_key=True)
    chat_id = Column(String(150), ForeignKey("chats.id"), primary_key=True)


class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, autoincrement=False)
    message = Column(String(500), default="")
    created_at = Column("created_at", TIMESTAMP(), nullable=False)
    read_at = Column("read_at", TIMESTAMP())
    chat_id = Column(String, ForeignKey("chats.id"))
    username = Column("username", String(50), nullable=False)
    image = Column("image", String(150), nullable=True)

    def __init__(self, username):
        self.created_at = datetime.utcnow()
        self.id = str(uuid4())
        self.username = username


class Friendships(Base):
    __tablename__ = "friendships"
    user_a_id = Column(
        "user_a_id", String(100), ForeignKey("users.id"), index=True, primary_key=True
    )
    user_b_id = Column(
        "user_b_id", String(100), ForeignKey("users.id"), primary_key=True
    )
    created_at = Column("created_at", TIMESTAMP(), default=datetime.utcnow())
    UniqueConstraint("user_a_id", "user_b_id", name="unique_friendships")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, autoincrement=False)
    username = Column("username", String(50), nullable=False)
    password = Column("password", String(500), nullable=False)
    firstname = Column("firstname", String(50), nullable=False)
    lastname = Column("lastname", String(50), nullable=False)
    email = Column("email", String(100), nullable=False)
    created_at = Column("created_at", TIMESTAMP(), nullable=False)
    updated_at = Column("updated_on", TIMESTAMP(), nullable=False)
    last_login = Column("last_login", TIMESTAMP(), default=None)
    visible_in_searches = Column("visible_in_searches", Boolean, default=False)
    avatar = Column("avatar", String(500), nullable=True)
    chats = relationship("Chat", secondary="users_chats", lazy="dynamic")
    friends = relationship(
        "User",
        secondary="friendships",
        primaryjoin=id == Friendships.user_a_id,
        secondaryjoin=id == Friendships.user_b_id,
        lazy="dynamic",
    )
    notifications = relationship("Notification", lazy="dynamic")

    def __init__(self, username, password, firstname, lastname, email):
        self.id = str(uuid4())
        self.username = username
        self.password = hash_password(password)
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def add_friend(self, friend):
        if friend not in self.friends:
            self.friends.append(friend)
            friend.friends.append(self)

    def remove_friend(self, friend):
        if friend in self.friends:
            self.friends.remove(friend)
            friend.friends.remove(self)


class Chat(Base):
    __tablename__ = "chats"
    id = Column(String(150), primary_key=True, autoincrement=False)
    created_at = Column("created_at", TIMESTAMP(), nullable=False)
    users = relationship(User, secondary="users_chats", lazy="dynamic")
    messages = relationship(Message, lazy="dynamic")
    last_message = Column("last_message", String(1000), nullable=True)
    last_message_timestamp = Column(
        "last_message_timestamp", TIMESTAMP(), nullable=True
    )

    def __init__(self):
        self.id = str(uuid4())
        self.created_at = datetime.utcnow()


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String(150), primary_key=True, autoincrement=False)
    recipient = Column(String, ForeignKey("users.id"))
    type = Column("type", String(50), nullable=False)
    sender = Column("sender", String(150), nullable=False)
    avatar = Column("avatar", String, nullable=True)
    timestamp = Column("timestamp", TIMESTAMP(), nullable=False)
    dismissed = Column("dismissed", Boolean, nullable=False)
    message = Column("message", String, nullable=False)

    def __init__(self, type, sender, message, avatar=None):
        self.id = str(uuid4())
        self.type = type
        self.sender = sender
        self.message = message
        self.timestamp = datetime.utcnow()
        self.dismissed = False
        self.avatar = avatar


Base.metadata.create_all(engine)
