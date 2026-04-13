import os
from typing import List

class Settings:
    """Configuración de la aplicación"""

    # JWT Settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "tu-clave-secreta-super-segura-cambiala-en-produccion-123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = os.environ.get("DB_PATH", "sqlite://empleados.db")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:80",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
