import uuid
from pydantic import BaseModel
from typing import List, TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .orders import Order

class UserBase(BaseModel):
    username: str
    email: str
    orders: Optional["Order"] = []

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class User(UserBase):
    userid: uuid.UUID


from .orders import Order
 