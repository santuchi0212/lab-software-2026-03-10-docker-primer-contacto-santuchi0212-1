import asyncio
import sys
from app.models import User
from app.database import TORTOISE_ORM
from tortoise import Tortoise

async def crear_admin():
    print("🔄 Inicializando base de datos...")
    
    try:
        await Tortoise.init(config=TORTOISE_ORM)
        await Tortoise.generate_schemas()
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        return
    
    # Verificar si ya existe un admin
    try:
        admin = await User.get_or_none(username="admin")
        
        if admin:
            print("⚠️  Ya existe un usuario admin")
            print(f"   Username: {admin.username}")
            print(f"   Email: {admin.email}")
            await Tortoise.close_connections()
            return
    except Exception as e:
        print(f"❌ Error verificando usuario existente: {e}")
        await Tortoise.close_connections()
        return
    
    print("📝 Creando usuario administrador...")
    
    # Importar después de inicializar Tortoise
    from app.auth import get_password_hash
    
    password = "admin123"
    
    try:
        print(f"   Hasheando contraseña...")
        hashed = get_password_hash(password)
        print(f"   ✅ Hash generado")
        
        admin = await User.create(
            username="admin",
            email="admin@example.com",
            full_name="Administrador del Sistema",
            hashed_password=hashed,
            is_active=True,
            is_superuser=True
        )
        
        print("\n✅ Usuario administrador creado exitosamente!")
        print(f"   Username: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Password: {password}")
        print("\n⚠️  IMPORTANTE: Cambia esta contraseña en producción!")
        
    except Exception as e:
        print(f"❌ Error al crear admin: {e}")
        import traceback
        print("\n📋 Traceback completo:")
        traceback.print_exc()
    
    await Tortoise.close_connections()
    print("🔒 Conexiones cerradas.")

if __name__ == "__main__":
    try:
        asyncio.run(crear_admin())
    except KeyboardInterrupt:
        print("\n⚠️  Proceso interrumpido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)