# Gestor de Empleados — Instrucciones de ejecución

Resumen
-------
Proyecto fullstack (FastAPI backend + React frontend) para gestionar empleados, departamentos y posiciones.  
Comandos usados en este repo:

- Backend (desarrollo): `python -m uvicorn app.main:app --reload --port 5000`
- Frontend (desarrollo): `npm run dev` (desde la carpeta `frontend/Gestor de empleados`)

Requisitos (Linux)
------------------
- Python 3.10+ (recomendado).
- Node.js 16+ / npm 8+
- Git (opcional)
- Acceso a terminal / VS Code

Estructura relevante
--------------------
- backend/               -> código backend (FastAPI)
- frontend/Gestor de empleados/ -> frontend (React + Vite)

Instalación y ejecución (Backend)
--------------------------------
1. Abrir terminal y situarse en la carpeta `backend`:
   ```bash
   cd /home/vboxuser/programacion-3-2025-castineira-santuchi0212/backend
   ```

2. Crear y activar un entorno virtual (recomendado):
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```


4. Inicializar la base de datos:
   - Si existe `init_db.py`:
     ```bash
     python init_db.py
     ```
   - Si existe `crear_admin.py` y quieres crear un usuario admin inicial:
     ```bash
     python crear_admin.py
     ```
     (Sigue las instrucciones en pantalla si el script las solicita).

5. Iniciar el servidor de desarrollo:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
   ```
   - La API estará en: `http://localhost:5000`

Instalación y ejecución (Frontend)
---------------------------------
1. Abrir otra terminal y situarse en la carpeta del frontend:
   ```bash
   cd /home/vboxuser/programacion-3-2025-castineira-santuchi0212/frontend/Gestor\ de\ empleados
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   - El frontend normalmente se sirve en `http://localhost:3000` (o el puerto que Vite muestre).

API: registro / login (ejemplos)
--------------------------------
- Registro (JSON):
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"usuario1","email":"u1@example.com","password":"Pass1234","full_name":"Usuario Uno"}'
  ```

- Login (FORM o JSON según implementación; verifica `backend/app/routers/auth.py`):
  - Si el endpoint usa OAuth2 form:
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "username=usuario1&password=Pass1234"
    ```
  - Respuesta esperada: JSON con `access_token` y `token_type`.

Usar token en peticiones protegidas
----------------------------------
- Añadir header:
  ```
  Authorization: Bearer <access_token>
  ```
- Ejemplo:
  ```bash
  curl -H "Authorization: Bearer eyJhbGci..." http://localhost:5000/api/employees
  ```

Comportamiento en el frontend
-----------------------------
- El login guarda el token en `localStorage` (clave `access_token`) y ProtectedRoute impide acceso si no hay token.
- Cerrar sesión limpia el token y redirige a `/login`.

Problemas comunes y soluciones
------------------------------
- CORS blocked: si el navegador bloquea peticiones, ajusta orígenes permitidos en `backend/app/config.py` o en la configuración CORS de FastAPI.
- "Module not found" en frontend: ejecutar `npm install` y reiniciar `npm run dev`.
- Errores 401 en endpoints: revisa que el token se envíe correctamente (Authorization header) y que no haya expirado.
- Si la DB no tiene tablas: ejecutar el script de inicialización (`init_db.py`) o revisar `backend/app/main.py` startup.
- Logs de backend: mirar terminal donde corre uvicorn para mensajes claros (errores de migración, indices únicos, etc).

Sugerencias de seguridad (producción)
-------------------------------------
- No usar SQLite en despliegues serios; usar PostgreSQL/MySQL.
- Mantener `SECRET_KEY` en variables de entorno seguras.
- Configurar HTTPS y políticas de CORS estrictas.
- No guardar contraseñas en claro (el backend usa hashing).

Archivos útiles en el repo
--------------------------
- backend/app/routers/auth.py  — endpoints de register/login
- backend/crear_admin.py       — script para crear usuario admin (si existe)
- frontend/Gestor de empleados/src/services/employeeService.js — servicio que maneja auth y añade headers
- frontend/Gestor de empleados/src/components/ProtectedRoute.jsx — protección de rutas

Contacto / ayuda
----------------
Si aparece un error al ejecutar alguno de los pasos pega aquí la salida del terminal y el contenido del `backend/app/routers/auth.py` o la consola del navegador (F12 → Console) para que pueda ayudarte a corregirlo.

¡Listo! Sigue los pasos y deberías poder levantar backend (puerto 5000) y frontend.

Desarrollado por: Cdtech
