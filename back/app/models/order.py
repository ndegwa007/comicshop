from . import Base
#from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs
import uuid
import datetime


class Order(Base, AsyncAttrs):
    __tablename__ =  'orders'

    order_id: Mapped[uuid.UUID] = mapped_column( primary_key=True, nullable=False, index=True, default=lambda: str(uuid.uuid4()))
    item_name: Mapped[str] = mapped_column(nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(nullable=False, index=True)
    order_time: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.utcnow) 
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.userid'), nullable=False)

    # relationship 
    user = relationship('User', back_populates='orders')