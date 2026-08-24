# Conversor de Archivos

Proyecto tipo iLovePDF: página web + app móvil para convertir y manipular archivos (PDFs, imágenes) de forma rápida y gratuita.

## Stack

- **Web:** Next.js (React)
- **Mobile:** React Native (Expo)
- **Backend:** Supabase (Storage + Edge Functions)
- **Compartido:** paquete `shared` con tipos y utilidades comunes a web y mobile

## Estructura

```
conversor-app/
├── apps/
│   ├── web/          # Next.js
│   └── mobile/       # React Native (Expo)
├── packages/
│   └── shared/        # tipos, constantes, utils compartidos
└── supabase/
    ├── functions/     # Edge Functions (lógica de conversión)
    └── migrations/    # esquema de base de datos (historial, etc.)
```

## Funcionalidades del MVP

- [ ] Unir PDFs
- [ ] Comprimir PDF
- [ ] PDF → imágenes (JPG/PNG)
- [ ] Imágenes → PDF
- [ ] Word → PDF
- [ ] PDF → Word

## Cómo correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

```bash
npx supabase init      # si no está inicializado
npx supabase start     # levanta Supabase local (requiere Docker)
```

Copia `.env.example` a `.env.local` en `apps/web` y `apps/mobile`, y llena las variables con los datos que te da `supabase start`.

### 3. Levantar la web

```bash
npm run dev:web
```

### 4. Levantar la app móvil

```bash
npm run dev:mobile
```

### 5. Deploy de las Edge Functions

```bash
npm run supabase:deploy
```

Para activar Word → PDF y PDF → Word, crea una cuenta en CloudConvert y configura su clave como secreto de Supabase:

```bash
npx supabase secrets set CLOUDCONVERT_API_KEY=tu_clave_de_cloudconvert
```

Después vuelve a desplegar las funciones. La clave solo se usa dentro de las Edge Functions y no se expone en la aplicación web.

### Limpieza automática de archivos

Como el sitio no tiene cuentas de usuario, los archivos subidos y los resultados generados
se borran solos del bucket `conversions` pasada 1 hora, vía una Edge Function
(`cleanup-old-files`) programada con `pg_cron`. Para activarla:

```bash
npx supabase functions deploy cleanup-old-files
npx supabase db push
```

Y una sola vez, desde el SQL Editor del panel de Supabase (con tu URL y anon key reales,
los mismos que usas en `.env.local`):

```sql
select vault.create_secret('https://tu-project-ref.supabase.co', 'project_url');
select vault.create_secret('tu-anon-key', 'anon_key');
```

Sin esos dos secretos en Vault, el cron queda programado pero las llamadas fallarán.

## Roadmap futuro

- Historial de conversiones por usuario (tabla en Postgres vía Supabase)
- Límite de tamaño / cuenta gratuita vs premium
