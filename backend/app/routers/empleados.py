from fastapi import APIRouter, HTTPException, Depends
from typing import List
from marshmallow import ValidationError

from app import crud
from app.schemas import EmpleadoSchema, EmpleadoCreateSchema, EmpleadoUpdateSchema
from app.auth import get_current_active_user
from app.models import User

router = APIRouter()
empleado_schema = EmpleadoSchema()
empleados_schema = EmpleadoSchema(many=True)
empleado_create_schema = EmpleadoCreateSchema()
empleado_update_schema = EmpleadoUpdateSchema()

# Agregar dependencia de autenticación a todos los endpoints
@router.get("/", response_model=List[dict])
async def read_empleados(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/employees - Requiere autenticación"""
    empleados = await crud.get_empleados(skip=skip, limit=limit)
    return empleados_schema.dump(empleados)

@router.get("/{empleado_id}", response_model=dict)
async def read_empleado(
    empleado_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """GET /api/employees/{id} - Requiere autenticación"""
    db_empleado = await crud.get_empleado(empleado_id=empleado_id)
    if db_empleado is None:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado_schema.dump(db_empleado)

@router.post("/", response_model=dict, status_code=201)
async def create_empleado(
    empleado_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """POST /api/employees - Requiere autenticación"""
    try:
        data = empleado_create_schema.load(empleado_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    empleado = await crud.create_empleado(data)
    return empleado_schema.dump(empleado)

@router.put("/{empleado_id}", response_model=dict)
async def update_empleado(
    empleado_id: int, 
    empleado_data: dict,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """PUT /api/employees/{id} - Requiere autenticación"""
    try:
        data = empleado_update_schema.load(empleado_data)
    except ValidationError as err:
        raise HTTPException(status_code=400, detail=err.messages)
    
    db_empleado = await crud.update_empleado(empleado_id=empleado_id, empleado=data)
    if db_empleado is None:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado_schema.dump(db_empleado)

@router.delete("/{empleado_id}")
async def delete_empleado(
    empleado_id: int,
    current_user: User = Depends(get_current_active_user)  # 🔒 PROTEGIDO
):
    """DELETE /api/employees/{id} - Requiere autenticación"""
    success = await crud.delete_empleado(empleado_id=empleado_id)
    if not success:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return {"message": "Empleado eliminado correctamente"}