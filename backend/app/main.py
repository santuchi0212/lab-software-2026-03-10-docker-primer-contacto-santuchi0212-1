from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, close_db
from app.routers import departamentos, posiciones, empleados, auth
from app.config import settings

app = FastAPI(
    title="Empleados API",
    description="API para gestionar empleados con autenticación JWT",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir router de autenticación (SIN protección)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Incluir routers protegidos
app.include_router(departamentos.router, prefix="/api/departments", tags=["departments"])
app.include_router(posiciones.router, prefix="/api/positions", tags=["positions"])
app.include_router(empleados.router, prefix="/api/employees", tags=["employees"])

@app.on_event("startup")
async def startup_event():
    await init_db(app)

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

@app.get("/")
async def root():
    return {
        "message": "API de Gestión de Empleados con JWT",
        "version": "2.0.0",
        "auth_endpoints": {
            "register": "/api/auth/register",
            "login": "/api/auth/login",
            "me": "/api/auth/me"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}