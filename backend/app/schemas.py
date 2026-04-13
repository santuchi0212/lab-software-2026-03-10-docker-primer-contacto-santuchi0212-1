from marshmallow import Schema, fields, validate
from datetime import date

class DepartamentoSchema(Schema):
    """Schema para validar datos de Departamento"""
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1))
    descripcion = fields.Str(required=False, allow_none=True)
    creado_en = fields.DateTime(dump_only=True)
    actualizado_en = fields.DateTime(dump_only=True)

class DepartamentoCreateSchema(Schema):
    """Schema para crear departamentos"""
    nombre = fields.Str(required=True, validate=validate.Length(min=1))
    descripcion = fields.Str(required=False, allow_none=True)


class PosicionSchema(Schema):
    """Schema para validar datos de Posición"""
    id = fields.Int(dump_only=True)
    titulo = fields.Str(required=True, validate=validate.Length(min=1))
    descripcion = fields.Str(required=False, allow_none=True)
    salario_min = fields.Decimal(required=False, allow_none=True)
    salario_max = fields.Decimal(required=False, allow_none=True)
    creado_en = fields.DateTime(dump_only=True)
    actualizado_en = fields.DateTime(dump_only=True)

class PosicionCreateSchema(Schema):
    """Schema para crear posiciones"""
    titulo = fields.Str(required=True, validate=validate.Length(min=1))
    descripcion = fields.Str(required=False, allow_none=True)
    salario_min = fields.Decimal(required=False, allow_none=True)
    salario_max = fields.Decimal(required=False, allow_none=True)


# ===== SCHEMAS PARA EMPLEADO =====

class EmpleadoSchema(Schema):
    """Schema completo para Empleado con relaciones anidadas"""
    id = fields.Int(dump_only=True)
    codigo_empleado = fields.Str(required=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1))
    apellido = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    telefono = fields.Str(required=False, allow_none=True)
    fecha_nacimiento = fields.Date(required=False, allow_none=True)
    fecha_contratacion = fields.Date(required=True)
    salario = fields.Decimal(required=True, places=2)
    activo = fields.Bool(required=False, load_default=True)
    
    # IDs de las relaciones
    departamento = fields.Nested(DepartamentoSchema)
    Posicion = fields.Nested(PosicionSchema)
    
    # Timestamps
    creado_en = fields.DateTime(dump_only=True)
    actualizado_en = fields.DateTime(dump_only=True)
    
    # Propiedad computada
    nombre_completo = fields.Str(dump_only=True)


class EmpleadoCreateSchema(Schema):
    """Schema para crear empleados - solo campos editables"""
    codigo_empleado = fields.Str(required=True, validate=validate.Length(min=1))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    apellido = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    email = fields.Email(required=True)
    telefono = fields.Str(required=False, allow_none=True, validate=validate.Length(max=20))
    fecha_nacimiento = fields.Date(required=False, allow_none=True)
    fecha_contratacion = fields.Date(required=True)
    salario = fields.Float(required=True, places=2, validate=validate.Range(min=0))
    activo = fields.Bool(required=False, load_default=True)
    departamento_id = fields.Int(required=True)
    Posicion_id = fields.Int(required=True)

class EmpleadoUpdateSchema(Schema):
    codigo_empleado = fields.Str(required=False, validate=validate.Length(min=1))
    nombre = fields.Str(required=False, validate=validate.Length(min=1, max=50))
    apellido = fields.Str(required=False, validate=validate.Length(min=1, max=50))
    email = fields.Email(required=False)
    telefono = fields.Str(required=False, allow_none=True, validate=validate.Length(max=20))
    fecha_nacimiento = fields.Date(required=False, allow_none=True)
    fecha_contratacion = fields.Date(required=False)
    salario = fields.Float(required=False, places=2, validate=validate.Range(min=0))
    activo = fields.Bool(required=False, load_default=True)
    departamento_id = fields.Int(required=False)
    Posicion_id = fields.Int(required=False)