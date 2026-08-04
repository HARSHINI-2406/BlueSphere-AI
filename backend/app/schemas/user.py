from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    organization: Optional[str] = ""
    role: Optional[str] = ""

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    organization: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut
