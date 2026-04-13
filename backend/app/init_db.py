from tortoise import Tortoise
from app.database import TORTOISE_ORM

async def init_db():
    print("Initializing database...")
    await Tortoise.init(config=TORTOISE_ORM)
    print("Generating schemas...")
    await Tortoise.generate_schemas()
    print("Database initialized successfully!")
    await Tortoise.close_connections()
    print("Database connections closed.")

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(init_db())
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        print("Script finished.") 