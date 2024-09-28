from fastapi import APIRouter, HTTPException, Request
import africastalking
import os
from loguru import logger

router = APIRouter()

# Initialize Africa's Talking
africastalking.initialize(username='sandbox', api_key=os.getenv('SMS_KEY'))
sms = africastalking.SMS


@router.post("/update-phone")
async def send_message(request: Request):
    # Extract phone number directly from the request body
    try:
        body = await request.json()
        logger.info(f"body: {body}")
        phone_number = body.get("phoneNumber")
        
        if not phone_number:
            raise HTTPException(status_code=400, detail="Phone number is required")

        # Define the custom message
        custom_message = "Your order is being processed swiftly by swifty! Enjoy your comics"

        # Send SMS to the user using Africa's Talking
        response = sms.send(custom_message, [phone_number], "swifty")
        return {"message": "Message sent successfully!", "response": response}
    except Exception as e:
        # Handle SMS sending failure or JSON parsing issues
        raise HTTPException(status_code=400, detail=f"Failed to send message: {str(e)}")









