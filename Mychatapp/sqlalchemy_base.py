from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlalchemy_classes
import os

POSTGRESQL_URL = os.environ.get("DATABASE_URL")

Base = declarative_base()
engine = create_engine(POSTGRESQL_URL)
Session = sessionmaker(bind=engine)
