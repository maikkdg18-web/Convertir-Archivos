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

## Roadmap futuro

- Word/Excel → PDF (requiere backend con LibreOffice, fuera del alcance de Supabase Edge Functions)
- Historial de conversiones por usuario (tabla en Postgres vía Supabase)
- Límite de tamaño / cuenta gratuita vs premium
