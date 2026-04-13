from tortoise import Tortoise
from fastapi import FastAPI

import os

DB_PATH = os.environ.get("DB_PATH", "sqlite://empleados.db")

TORTOISE_ORM = {
    "connections": {
        "default": DB_PATH
    },
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        }
    }
}

async def init_db(app: FastAPI) -> None:
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()
    app.state.db = Tortoise.get_connection("default")

async def close_db() -> None:
    await Tortoise.close_connections() 