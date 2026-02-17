# 🚀 Guía de Despliegue y Migraciones

## 📦 Actualizar Producción

### Cuando haces cambios en la base de datos:

#### 1️⃣ Desarrollo Local (prueba primero)
```bash
# Ejecuta la migración en tu base de datos local
psql -U postgres -d bb_discos -f backend/database/tu_migracion.sql

# O desde el script
npm run dev
```

#### 2️⃣ Producción (Supabase)

**Opción A: Panel Web (más visual)**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. **SQL Editor** → **New query**
4. Copia el contenido del archivo `.sql`
5. Click **Run** (▶)

**Opción B: Script automatizado (más rápido)**
```bash
cd backend
npm run migrate-production
```

**Opción C: psql directo**
```bash
psql -h aws-1-sa-east-1.pooler.supabase.com \
     -U postgres.kufuepjztnwqocvrmtgf \
     -d postgres \
     -f backend/database/tu_migracion.sql
```

---

## 🔄 Flujo Completo de Desarrollo → Producción

### Escenario: Agregaste una nueva feature

```bash
# 1. DESARROLLO LOCAL
cd backend
npm run dev              # Servidor local
# Haces cambios en código y base de datos

# 2. PRUEBA LOCAL
# Todo funciona ✅

# 3. MIGRAR BASE DE DATOS DE PRODUCCIÓN
npm run migrate-production
# Ejecuta el SQL en Supabase ✅

# 4. SUBIR CÓDIGO A GIT
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 5. DESPLIEGUE AUTOMÁTICO
# Tu servicio de hosting (Railway, Render, Vercel) detecta el push
# y despliega automáticamente ✅
```

---

## 🗂️ Estructura de Migraciones

```
backend/database/
├── schema.sql                          # Schema inicial
├── seed.sql                            # Datos iniciales
├── migration_multiple_images_table.sql # Migración 1
├── migration_add_reviews.sql           # Migración 2
└── migration_add_wishlist.sql          # Migración 3
```

### Buenas prácticas:

✅ **Hacer:**
- Nombrar archivos: `migration_descripcion.sql`
- Usar `IF NOT EXISTS` para evitar errores
- Probar en desarrollo ANTES de producción
- Hacer backups antes de migraciones grandes
- Documentar cambios en el archivo SQL

❌ **Evitar:**
- Ejecutar SQL directo sin probarlo
- Modificar migraciones anteriores (crear una nueva)
- Borrar datos sin backup

---

## 📊 Migraciones Actuales

| Archivo | Descripción | Aplicado en Local | Aplicado en Producción |
|---------|-------------|-------------------|------------------------|
| `schema.sql` | Base de datos inicial | ✅ | ✅ |
| `seed.sql` | Datos de ejemplo | ✅ | ✅ |
| `migration_multiple_images_table.sql` | Soporte múltiples imágenes | ✅ | ⏳ Pendiente |

**Para aplicar pendientes:**
```bash
npm run migrate-production
```

---

## 🚀 Despliegue de Backend (Ejemplo Railway)

### Primera vez:

1. **Crear proyecto en Railway**
   - Conecta tu repositorio de GitHub
   - Railway detecta que es Node.js

2. **Configurar variables de entorno**
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=aws-1-sa-east-1.pooler.supabase.com
   DB_PORT=5432
   DB_USER=postgres.kufuepjztnwqocvrmtgf
   DB_PASSWORD=tu_password
   DB_NAME=postgres
   CLOUDINARY_CLOUD_NAME=dzjik8puv
   CLOUDINARY_API_KEY=759891286873558
   CLOUDINARY_API_SECRET=nauEY8btOT2v1zuhmVttUuneEgc
   ```

3. **Configurar comando de inicio**
   - Build: `npm install`
   - Start: `npm start`

4. **Deploy!**

### Actualizaciones posteriores:

```bash
git push origin main
# Railway despliega automáticamente ✅
```

---

## 🌐 Despliegue de Frontend (Ejemplo Vercel)

### Primera vez:

1. **Importar proyecto desde GitHub**
   - Selecciona el repositorio
   - Framework: Vite
   - Root Directory: `frontend`

2. **Configurar variables de entorno**
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

3. **Configuración de build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy!**

### Actualizaciones posteriores:

```bash
git push origin main
# Vercel despliega automáticamente ✅
```

---

## 🔍 Verificar que todo funciona

### Backend
```bash
curl https://tu-backend.railway.app/api/health
# Respuesta: {"status":"OK"}
```

### Frontend
```bash
curl https://tu-app.vercel.app
# Respuesta: HTML de tu app
```

### Base de datos
```bash
psql -h aws-1-sa-east-1.pooler.supabase.com \
     -U postgres.kufuepjztnwqocvrmtgf \
     -d postgres \
     -c "SELECT COUNT(*) FROM products"
```

---

## 🆘 Troubleshooting

### "Error al conectar a la base de datos"
- Verifica las credenciales en las variables de entorno
- Asegúrate que Supabase permite conexiones desde tu IP
- Revisa que el puerto 5432 está abierto

### "CORS error en producción"
- Actualiza `FRONTEND_URL` en backend con la URL real de Vercel
- Verifica que CORS esté configurado en `backend/src/index.js`

### "La migración falló"
- Lee el mensaje de error completo
- Verifica que la tabla/columna no exista ya
- Prueba primero en desarrollo local

### "Los cambios no se ven en producción"
- Verifica que el código se subió a GitHub: `git status`
- Revisa los logs de tu hosting
- Limpia caché del navegador (Ctrl + Shift + R)

---

## 📝 Checklist de Despliegue

Antes de hacer push a producción:

- [ ] ✅ Código probado localmente
- [ ] ✅ Tests pasando (si tienes)
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Migraciones de BD aplicadas en producción
- [ ] ✅ No hay credenciales hardcodeadas
- [ ] ✅ `.env` en `.gitignore`
- [ ] ✅ Build de frontend funciona: `npm run build`
- [ ] ✅ Backend responde: `npm run start:prod`

---

## 🎯 Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Servidor local
npm run copy-from-supabase     # Traer datos de producción a local
npm run add-images             # Agregar imágenes a productos

# Producción
npm run migrate-production     # Migrar base de datos
npm run dev:prod              # Probar con datos de producción localmente
npm run start:prod            # Servidor producción

# Git
git status                    # Ver cambios
git add .                     # Agregar todos los cambios
git commit -m "mensaje"       # Commit
git push origin main          # Subir a GitHub
```

---

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Railway](https://docs.railway.app)
- [Documentación Vercel](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
