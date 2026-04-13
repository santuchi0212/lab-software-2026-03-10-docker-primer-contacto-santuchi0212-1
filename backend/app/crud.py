from app.models import Posicion, Departamento, Empleado

# ===== FUNCIONES PARA DEPARTAMENTOS =====

async def get_departamento(departamento_id: int):
    """Obtiene un departamento por ID"""
    return await Departamento.get_or_none(id=departamento_id)

async def get_departamentos(skip: int = 0, limit: int = 100):
    """Obtiene una lista de departamentos con paginación"""
    return await Departamento.all().offset(skip).limit(limit)

async def create_departamento(departamento: dict):
    """Crea un nuevo departamento"""
    return await Departamento.create(**departamento)

async def update_departamento(departamento_id: int, departamento: dict):
    """Actualiza un departamento existente"""
    await Departamento.filter(id=departamento_id).update(**departamento)
    return await get_departamento(departamento_id)

async def delete_departamento(departamento_id: int):
    """Elimina un departamento"""
    deleted_count = await Departamento.filter(id=departamento_id).delete()
    return deleted_count > 0

# ===== FUNCIONES PARA POSICIONES =====

async def get_posicion(posicion_id: int):
    """Obtiene una posición por ID"""
    return await Posicion.get_or_none(id=posicion_id)

async def get_posiciones(skip: int = 0, limit: int = 100):
    """Obtiene una lista de posiciones con paginación"""
    return await Posicion.all().offset(skip).limit(limit)

async def create_posicion(posicion: dict):
    """Crea una nueva posición"""
    return await Posicion.create(**posicion)

async def update_posicion(posicion_id: int, posicion: dict):
    """Actualiza una posición existente"""
    await Posicion.filter(id=posicion_id).update(**posicion)
    return await get_posicion(posicion_id)

async def delete_posicion(posicion_id: int):
    """Elimina una posición"""
    deleted_count = await Posicion.filter(id=posicion_id).delete()
    return deleted_count > 0

# ===== FUNCIONES PARA EMPLEADOS =====

async def get_empleado(empleado_id: int):
    return await Empleado.get_or_none(id=empleado_id).prefetch_related("departamento", "Posicion")

async def get_empleados(skip: int = 0, limit: int = 100):
    """Obtiene una lista de empleados con paginación"""
    return await Empleado.all().offset(skip).limit(limit).prefetch_related("departamento", "Posicion")

async def create_empleado(empleado: dict):
    empleado_obj = await Empleado.create(**empleado)
    await empleado_obj.fetch_related("departamento", "Posicion")
    return empleado_obj

async def update_empleado(empleado_id: int, empleado: dict):
    await Empleado.filter(id=empleado_id).update(**empleado)
    empleado_obj = await get_empleado(empleado_id)
    if empleado_obj:
        await empleado_obj.fetch_related("departamento", "Posicion")    
    return empleado_obj

async def delete_empleado(empleado_id: int):
    """Elimina una empleado"""
    deleted_count = await Empleado.filter(id=empleado_id).delete()
    return deleted_count > 0