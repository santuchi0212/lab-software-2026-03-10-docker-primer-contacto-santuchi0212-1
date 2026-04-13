from fastapi import APIRouter, HTTPException, Depends
from typing import List
from marshmallow import ValidationError

from app import crud
from app.schemas import DepartamentoSchema, DepartamentoCreateSchema
from app.auth import get_current_active_user
from app.models import User

router = APIRouter()
departamento_schema = DepartamentoSchema()
departamentos_schema = DepartamentoSchema(many=True)
departamento_create_schema = DepartamentoCreateSchema()

@router.get("/", response_model=List[dict])
async def read_departamentos(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/departments - Requiere autenticación"""
    departamentos = await crud.get_departamentos(skip=skip, limit=limit)
    return departamentos_schema.dump(departamentos)

@router.get("/{departamento_id}", response_model=dict)
async def read_departamento(
    departamento_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/departments/{id} - Requiere autenticación"""
    db_departamento = await crud.get_departamento(departamento_id=departamento_id)
    if db_departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return departamento_schema.dump(db_departamento)

@router.post("/", response_model=dict, status_code=201)
async def create_departamento(
    departamento_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """POST /api/departments - Requiere autenticación"""
    try:
        data = departamento_create_schema.load(departamento_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    departamento = await crud.create_departamento(data)
    return departamento_schema.dump(departamento)

@router.put("/{departamento_id}", response_model=dict)
async def update_departamento(
    departamento_id: int, 
    departamento_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """PUT /api/departments/{id} - Requiere autenticación"""
    try:
        data = departamento_create_schema.load(departamento_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    db_departamento = await crud.update_departamento(departamento_id=departamento_id, departamento=data)
    if db_departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return departamento_schema.dump(db_departamento)

@router.delete("/{departamento_id}")
async def delete_departamento(
    departamento_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """DELETE /api/departments/{id} - Requiere autenticación"""
    success = await crud.delete_departamento(departamento_id=departamento_id)
    if not success:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return {"message": "Departamento eliminado correctamente"}