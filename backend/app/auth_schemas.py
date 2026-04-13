from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    """Schema para registro de usuario"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema para login de usuario"""
    username: str
    password: str


class Token(BaseModel):
    """Schema para respuesta de token"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema para datos del token"""
    username: Optional[str] = None


class UserResponse(BaseModel):
    """Schema para respuesta de usuario"""
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_superuser: bool
    
    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    """Schema de usuario en la base de datos"""
    hashed_password: str