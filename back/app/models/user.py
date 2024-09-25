
import uuid
#from sqlalchemy.dialects.postgresql import UUID 
from . import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.ext.asyncio import AsyncAttrs


class  User(Base, AsyncAttrs):
    __tablename__ = 'users'

    userid: Mapped[uuid.UUID] = mapped_column(primary_key=True, nullable=False, index=True, default=lambda:  str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(nullable=False, index=True, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, index=True)

    # one to many a user can have many orders
    orders =  relationship('Order', back_populates="user")
    