# B2B Auto Parts

Aplicación Next.js + Prisma para catálogo B2B de productos automotrices.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Deploy (Vercel + Supabase)

El build de Vercel usa:

```bash
npm run vercel-build
```

Ese script ejecuta:
1. `prisma generate`
2. `prisma migrate deploy`
3. `next build --webpack`

Variables mínimas en Vercel:
- `DATABASE_URL` (Supabase pooler 6543)
- `DIRECT_URL` (Supabase pooler/session 5432 con `?sslmode=require`)
- `ADMIN_AUTH_SECRET`
- `CATALOG_AUTH_SECRET`
- `SYNC_API_TOKEN`
- variables de R2 (`R2_*` y `NEXT_PUBLIC_R2_PUBLIC_URL`)
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY` (envío de correos desde `/contacto`)
- `CONTACT_TO_EMAIL` (correo que recibe los mensajes de contacto)
- `CONTACT_FROM_EMAIL` (remitente verificado en Resend; opcional, default: `onboarding@resend.dev`)

## Sincronización diaria (PostgreSQL local -> Vercel -> Supabase)

### Arquitectura

1. El sistema origen mantiene su PostgreSQL en red local.
2. Un script en la PC local lee cambios por `updated_at`.
3. El script hace `POST` a una API privada en Vercel.
4. La API hace `upsert` en Supabase por `sku`.

Flujo:
`PostgreSQL local -> scripts/sync-products-to-vercel.js -> /api/sync/products -> Supabase`

### Modelo de datos usado para sync

En `Product`:
- `sku` es `@unique` (clave estable de sincronización).
- `updatedAt` (`@updatedAt`) para auditoría en destino.
- `sourceUpdatedAt` para control de frescura del dato origen.
- `isActive` para borrado lógico (no físico).

### API privada de sync

Ruta:
- `POST /api/sync/products`

Archivo:
- `src/app/api/sync/products/route.ts`

Autenticación:
- Header `x-sync-token`
- Debe coincidir con `SYNC_API_TOKEN` en Vercel

Payload:

```json
{
  "products": [
    {
      "sku": "ABC123",
      "descripcion": "Filtro de aceite",
      "referencia": "REF-001",
      "textoDescripcion": "Detalle opcional",
      "imageUrl": "/no-photo.avif",
      "categoryName": "Filtros",
      "sourceUpdatedAt": "2026-02-08T12:00:00.000Z",
      "isActive": true
    }
  ],
  "deactivateSkus": ["SKU-OLD-1"]
}
```

Respuesta incluye resumen:
- `created`
- `updated`
- `skipped`
- `deactivated`
- `errors`

### Script local de sincronización

Archivo:
- `scripts/sync-products-to-vercel.js`

Comando:

```bash
npm run sync:products-to-vercel
```

Variables requeridas en la PC local:
- `SOURCE_DB_URL` o `SOURCE_DATABASE_URL` (PostgreSQL origen local)
- `SYNC_API_URL` (`https://tu-dominio.com/api/sync/products`)
- `SYNC_API_TOKEN` (mismo valor que Vercel)

Variables opcionales:
- `SYNC_STATE_FILE` (default: `scripts/sync-state.json`)
- `SYNC_LOG_FILE` (default: `scripts/sync.log`)
- `SYNC_BATCH_SIZE` (default: `200`)
- `SYNC_RETRIES` (default: `3`)
- `SOURCE_PRODUCTS_QUERY` (query personalizada de extracción)
- `SOURCE_DEACTIVATE_QUERY` (query personalizada de desactivaciones)

Comportamiento:
1. Lee `lastSync` del state file.
2. Extrae cambios `updated_at > lastSync`.
3. Envía lotes a la API.
4. Si todo sale bien, actualiza `lastSync`.
5. Si falla, mantiene `lastSync` anterior para reintento seguro.

### Tarea programada (Windows)

Configurar en Task Scheduler (PC con DB local):
1. Trigger: diario, hora fija.
2. Acción: ejecutar `node` con `scripts/sync-products-to-vercel.js`.
3. Reintentos recomendados: 3 intentos cada 15 minutos.

## Migración inicial de datos a Supabase

Script:
- `scripts/migrate-dev-to-supabase.js`

Comando:

```bash
npm run migrate:dev-to-supabase -- --force
```

Variables:
- `SOURCE_DATABASE_URL` (origen)
- `DIRECT_URL` o `TARGET_DATABASE_URL` (destino)

Este script reemplaza datos destino en:
- `Category`
- `Product`
- `Distributor`
- `AdminUser`

## Notes

- The brand has been renamed to **Importadora Fidodido**, and every public-facing copy (header, footer, hero, metadata) now reflects that name.
- The contact form removes the previous "Empresa / Tienda" and "NIT / RUC" fields and now only asks for name, email, phone, province, and message, where the province dropdown lists all 32 Dominican provinces plus Distrito Nacional.
- Tailwind colors are centralized in `src/app/globals.css`: `#D00000` for primary actions, `#FFBA08` for accents, `#0d151c` for main text, `#4b779b` for muted text, and `#f8f5f5` for the global background. Update them there when you need brand tweaks.

## Acceso al Catálogo (Login por Código)

El catálogo (`/catalogo`) requiere autenticación por código de cliente. La contraseña se deriva del código así:

1. Normaliza el código a 4 dígitos agregando ceros a la izquierda.
2. Invierte el código.
3. Suma 8 a cada dígito y conserva el resultado completo (si pasa de 9, se conservan ambos dígitos).

Ejemplo:

- Código: `1527`
- Normalizado: `1527`
- Invertido: `7251`
- +8 a cada dígito: `15 10 13 9`
- Contraseña: `1510139`

Si el código tiene menos de 4 dígitos, se completa con ceros. Por ejemplo, código `23` → normalizado `0023` → invertido `3200` → contraseña `111088`.
