import os
import urllib.parse
from datetime import datetime
from typing import Dict, List
from dotenv import load_dotenv

import uvicorn
from fastapi import FastAPI, Form, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from twilio.twiml.messaging_response import MessagingResponse

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

raw_password = os.getenv("DB_PASSWORD")

encoded_password = urllib.parse.quote_plus(raw_password) 
DATABASE_URL = f"postgresql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    contact_number = Column(String, index=True)
    user_id = Column(Integer, foreign_key=True)
    product_id = Column(Integer, foreign_key=True)
    product_review = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Users(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String)

class Products(Base):
    __tablename__ = "products"
    product_id = Column(Integer, primary_key=True, index = True)
    product_name = Column(String)

Base.metadata.create_all(bind=engine)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conversation_state: Dict[str, int] = {}
user_data_buffer: Dict[str, dict] = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#This function is used to accept message from Whatsapp
@app.post("/whatsapp")
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...), db: Session = Depends(get_db)):
    response = MessagingResponse()
    msg = response.message()
    
    sender = From
    text = Body.strip()
    
    current_state = conversation_state.get(sender, 0)

    if current_state == 0:
        msg.body("Hi! Which product is this review for?")
        conversation_state[sender] = 1
        user_data_buffer[sender] = {}

    elif current_state == 1:
        user_data_buffer[sender]['product_name'] = text
        msg.body("Got it. What's your name?")
        conversation_state[sender] = 2

    elif current_state == 2:
        user_data_buffer[sender]['user_name'] = text
        product = user_data_buffer[sender].get('product_name', 'the product')
        msg.body(f"Okay {text}, please send your review for {product}.")
        conversation_state[sender] = 3

    elif current_state == 3:
        data = user_data_buffer.get(sender)
        
        if data:
            new_review = Review(
                contact_number=sender,
                user_name=data['user_name'],
                product_name=data['product_name'],
                product_review=text
            )
            db.add(new_review)
            db.commit()
            db.refresh(new_review)
            
            msg.body(f"Thanks {data['user_name']}! Your review for {data['product_name']} has been recorded.")
        else:
            msg.body("Session expired. Please say Hi to start again.")
        
        if sender in conversation_state: del conversation_state[sender]
        if sender in user_data_buffer: del user_data_buffer[sender]

    return Response(content=str(response), media_type="application/xml")

# This is the function for react frontend
@app.get("/api/reviews")
def get_reviews(db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.created_at.desc()).all()

@app.delete("/api/delete")
def delete_reviews(db: Session = Depends(get_db), User: str = Form(...)):
    review = db.getAll(Review, User)
    db.delete(review)
    db.commit()
@app.delete("/api/delete")
def delete_reviews(db: Session = Depends(get_db), User: str = Form(...)):
    review = db.getAll(Review, User)
    db.delete(review)
    db.commit()

@app.delete("/api/delete_by_user_and_product")
def delete_review_user_product(db: Session = Depends(get_db), User: str = From(...), Product: str: From(...)):
    user_id = db.get(Users, User)
    product_id = db.get(Products, Product)
    review = db.get(Review, user_id, product_id)
    db.delete(review)
    db.commit()


if __name__ == "__main__":    
    uvicorn.run(app, host="0.0.0.0", port=8000)