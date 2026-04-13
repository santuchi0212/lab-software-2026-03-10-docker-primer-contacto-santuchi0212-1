from fastapi import APIRouter, HTTPException, Depends
from typing import List
from marshmallow import ValidationError

from app import crud
from app.schemas import PosicionSchema, PosicionCreateSchema
from app.auth import get_current_active_user
from app.models import User

router = APIRouter()
posicion_schema = PosicionSchema()
posiciones_schema = PosicionSchema(many=True)
posicion_create_schema = PosicionCreateSchema()

@router.get("/", response_model=List[dict])
async def read_posiciones(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/positions - Requiere autenticación"""
    posiciones = await crud.get_posiciones(skip=skip, limit=limit)
    return posiciones_schema.dump(posiciones)

@router.get("/{posicion_id}", response_model=dict)
async def read_posicion(
    posicion_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/positions/{id} - Requiere autenticación"""
    db_posicion = await crud.get_posicion(posicion_id=posicion_id)
    if db_posicion is None:
        raise HTTPException(status_code=404, detail="Posición no encontrada")
    return posicion_schema.dump(db_posicion)

@router.post("/", response_model=dict, status_code=201)
async def create_posicion(
    posicion_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """POST /api/positions - Requiere autenticación"""
    try:
        data = posicion_create_schema.load(posicion_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    posicion = await crud.create_posicion(data)
    return posicion_schema.dump(posicion)

@router.put("/{posicion_id}", response_model=dict)
async def update_posicion(
    posicion_id: int, 
    posicion_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """PUT /api/positions/{id} - Requiere autenticación"""
    try:
        data = posicion_create_schema.load(posicion_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    db_posicion = await crud.update_posicion(posicion_id=posicion_id, posicion=data)
    if db_posicion is None:
        raise HTTPException(status_code=404, detail="Posición no encontrada")
    return posicion_schema.dump(db_posicion)

@router.delete("/{posicion_id}")
async def delete_posicion(
    posicion_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """DELETE /api/positions/{id} - Requiere autenticación"""
    success = await crud.delete_posicion(posicion_id=posicion_id)
    if not success:
        raise HTTPException(status_code=404, detail="Posición no encontrada")
    return {"message": "Posición eliminada correctamente"}