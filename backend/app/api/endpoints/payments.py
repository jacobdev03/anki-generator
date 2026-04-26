import os
from typing import Annotated

import stripe
from fastapi import APIRouter, HTTPException, Depends, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.endpoints.auth import get_current_active_user
from app.models.user import User

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

router = APIRouter(tags=["payments"])

@router.post("/create-checkout-session")
async def create_checkout_session(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    try:
        price_id = os.getenv("STRIPE_PRICE_ID_100_CREDITS")
        if not price_id:
            raise HTTPException(status_code=500, detail="Stripe Price ID not configured")

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:3000/dashboard?payment=success',
            cancel_url='http://localhost:3000/dashboard?payment=cancel',
            client_reference_id=str(current_user.id),
            customer_email=current_user.email,
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-portal-session")
async def create_portal_session(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    try:
        # Find customer by email
        customers = stripe.Customer.list(email=current_user.email, limit=1)
        if not customers.data:
            raise HTTPException(status_code=400, detail="No billing history found for this user.")
        
        customer_id = customers.data[0].id
        
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url='http://localhost:3000/dashboard'
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Fulfill the purchase...
        user_id = session.client_reference_id
        if user_id:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                # Add 100 credits
                user.credits += 100
                db.commit()
                print(f"Added 100 credits to user {user.username}")

    return {"status": "success"}
