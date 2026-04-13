from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.models import User
from app.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    get_current_active_user
)
from app.auth_schemas import (
    UserRegister, 
    UserLogin, 
    Token, 
    UserResponse
)
from app.config import settings

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Registrar un nuevo usuario"""
    
    existing_user = await User.get_or_none(username=user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está registrado"
        )
    
    existing_email = await User.get_or_none(email=user_data.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    user = await User.create(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_active=True,
        is_superuser=False
    )
    
    return user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login de usuario"""
    
    print(f"🔍 Intentando login para usuario: {form_data.username}")
    
    user = await User.get_or_none(username=form_data.username)
    
    if not user:
        print(f"❌ Usuario no encontrado: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"✅ Usuario encontrado: {user.username}")
    
    if not verify_password(form_data.password, user.hashed_password):
        print(f"❌ Contraseña incorrecta")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"✅ Contraseña correcta")
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    print(f"✅ Login exitoso")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Obtener información del usuario actual"""
    return current_user


@router.post("/logout")
async def logout():
    """Logout"""
    return {"message": "Logout exitoso. Elimina el token del cliente."}