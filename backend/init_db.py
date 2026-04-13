from tortoise import Tortoise
from app.database import TORTOISE_ORM

async def init_db():
    print("🔄 Inicializando base de datos...")
    await Tortoise.init(config=TORTOISE_ORM)
    print("📝 Generando esquemas de tablas...")
    await Tortoise.generate_schemas()
    print("✅ Base de datos inicializada correctamente!")
    await Tortoise.close_connections()
    print("🔒 Conexiones cerradas.")

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(init_db())
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
    finally:
        print("✨ Script finalizado.")