from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from models import TransactionType

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TransactionCreate(BaseModel):
    amount: float
    category: str
    type: TransactionType
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    category: str
    type: TransactionType
    description: Optional[str]
    date: datetime
    user_id: int
    
    class Config:
        from_attributes = True

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    type: Optional[TransactionType] = None
    description: Optional[str] = None
