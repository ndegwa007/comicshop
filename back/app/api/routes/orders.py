from fastapi import APIRouter, Depends, HTTPException
from app.schemas import Order, OrderCreate, OrderUpdate
from typing import Sequence
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db_session
import app.crud.orders as crudorders
from sqlalchemy import select
import app.models as models
from uuid import UUID
from typing import List


router = APIRouter()

from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


router = APIRouter()

@router.post("/orders", response_model=List[Order])
async def create_orders(orders: List[OrderCreate], db: AsyncSession = Depends(get_db_session)) -> List[Order]:
    created_orders = []
    
    for order in orders:
        # Create a new order instance with the provided data
        order_params = OrderCreate(**order.model_dump())
        created_order = await crudorders.create_order(db, order_params)
        created_orders.append(created_order)

        for order in created_orders:
            user_data = await order.awaitable_attrs.user
            logger.info(f"Order {order.order_id} is associated with User {user_data.username}")
    return created_orders
    


'''
        new_order = Order(
            item_name=order_data.item_name,
            quantity=order_data.quantity,
            order_time=order_data.order_time,
            user_id=order_data.user_id  # Assuming this comes from the JWT or request body
        )
        
        db.add(new_order)


    # Commit all new orders at once for efficiency
    await db.commit()


    # Use selectinload to load related user data after creating orders
    #statement = select(Order).options(selectinload(Order.user))
    statement = select(Order)
    result = await db.execute(statement)
    
    created_orders.extend(result.scalars().all())  # Get all created orders with loaded users
    # access related user data aynchronously for each other
    for order in created_orders:
        user_data = await order.awaitable_attrs.user
        logger.info(f"Order {order.order_id} is associated with User {user_data.username}")
    
    return created_orders
'''


@router.get("/orders", response_model=list[Order])
async def get_orders(db:AsyncSession = Depends(get_db_session)) -> Sequence[Order]:
    logger.info("fetching orders")
    orders_list = await crudorders.get_orders(db)
    logger.info(f"fetched orders: {orders_list}")
    return orders_list
"""
@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: UUID, db: AsyncSession = Depends(get_db_session)) -> Order:
    logger.info(f"get order with id {order_id}")
    order = await crudorders.get_order(order_id, db)
    logger.info(f"found order: {order}")
    return order
"""

@router.get("/orders/{user_id}", response_model=List[Order])
async def get_orders_by_user(user_id: UUID, db: AsyncSession = Depends(get_db_session)) -> Order:
    logger.info(f"get orders for user: {user_id}")
    orders = await crudorders.get_orders_by_userid(user_id, db)
    return orders

@router.put("/orders/{order_id}", response_model=Order)
async def update_order(order_id: UUID, params: OrderUpdate, db: AsyncSession = Depends(get_db_session)) -> Order:
    logger.info(f"update order with id: {order_id}")
    order = await crudorders.update_order(order_id, params, db)
    logger.info(f"updated order: {order}")
    return order

@router.delete("/order/{order_id}", response_model=Order)
async def delete_order(order_id: UUID, db: AsyncSession = Depends(get_db_session)) -> Order:
    logger.info(f"deleting order with id: {order_id}")
    order = await crudorders.delete_order(order_id, db)
    logger.info(f"deleted order: {order}")
    return order

"""
@router.delete("/orders/{user_id}", response_model=Sequence[Order]) 
async def delete_orders(user_id: UUID, db:AsyncSession = Depends(get_db_session)):
    logger.info(f"delete all orders for current user")
    orders = await crudorders.delete_orders_by_userid(user_id, db)
    logger.info(f"deleted orders")
    return orders
"""