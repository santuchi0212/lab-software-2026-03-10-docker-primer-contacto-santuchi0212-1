from tortoise import fields
from tortoise.models import Model


class Departamento(Model):
    """Modelo para Departamento"""
    id = fields.IntField(pk=True, generated=True)
    nombre = fields.CharField(max_length=100, unique=True)
    descripcion = fields.TextField(null=True)
    creado_en = fields.DatetimeField(auto_now_add=True)
    actualizado_en = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "departamentos"
    
    def __str__(self):
        return self.nombre


class Posicion(Model):
    """Modelo para Puesto/Posición"""
    id = fields.IntField(pk=True, generated=True)
    titulo = fields.CharField(max_length=100)
    descripcion = fields.TextField(null=True)
    salario_min = fields.DecimalField(max_digits=10, decimal_places=2, null=True)
    salario_max = fields.DecimalField(max_digits=10, decimal_places=2, null=True)
    creado_en = fields.DatetimeField(auto_now_add=True)
    actualizado_en = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "posiciones"
    
    def __str__(self):
        return self.titulo


class Empleado(Model):
    """Modelo para Empleado"""
    id = fields.IntField(pk=True, generated=True)
    
    # Información personal
    codigo_empleado = fields.CharField(max_length=20, unique=True)
    nombre = fields.CharField(max_length=50)
    apellido = fields.CharField(max_length=50)
    email = fields.CharField(max_length=100, unique=True)
    telefono = fields.CharField(max_length=20, null=True)
    fecha_nacimiento = fields.DateField(null=True)
    
    # Información laboral
    fecha_contratacion = fields.DateField()
    salario = fields.DecimalField(max_digits=10, decimal_places=2)
    activo = fields.BooleanField(default=True)
    
    # Relaciones ForeignKey
    departamento = fields.ForeignKeyField('models.Departamento', related_name='empleados')
    Posicion = fields.ForeignKeyField('models.Posicion', related_name='empleados')
    
    # Timestamps
    creado_en = fields.DatetimeField(auto_now_add=True)
    actualizado_en = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "empleados"
    
    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.codigo_empleado})"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"


class User(Model):
    """Modelo para Usuario del sistema"""
    id = fields.IntField(pk=True, generated=True)
    username = fields.CharField(max_length=50, unique=True)
    email = fields.CharField(max_length=100, unique=True)
    full_name = fields.CharField(max_length=100, null=True)
    hashed_password = fields.CharField(max_length=255)
    is_active = fields.BooleanField(default=True)
    is_superuser = fields.BooleanField(default=False)
    creado_en = fields.DatetimeField(auto_now_add=True)
    actualizado_en = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "users"
    
    def __str__(self):
        return self.username