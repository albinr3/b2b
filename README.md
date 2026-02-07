This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Notes

- The brand has been renamed to **Importadora Fidodido**, and every public-facing copy (header, footer, hero, metadata) now reflects that name.
- The contact form removes the previous "Empresa / Tienda" and "NIT / RUC" fields and now only asks for name, email, phone, province, and message, where the province dropdown lists all 32 Dominican provinces plus Distrito Nacional.
- Tailwind colors are centralized in `src/app/globals.css`: `#D00000` for primary actions, `#FFBA08` for accents, `#0d151c` for main text, `#4b779b` for muted text, and `#f8f5f5` for the global background. Update them there when you need brand tweaks.

## Acceso al Catálogo (Login por Código)

El catálogo (`/catalogo`) requiere autenticación por código de cliente. La contraseña se deriva del código así:

1. Normaliza el código a 4 dígitos agregando ceros a la izquierda.
2. Invierte el código.
3. Suma 8 a cada dígito y, si pasa de 9, usa el último dígito (módulo 10).

Ejemplo:

- Código: `1527`
- Normalizado: `1527`
- Invertido: `7251`
- +8 a cada dígito: `5 0 3 9`
- Contraseña: `5039`

Si el código tiene menos de 4 dígitos, se completa con ceros. Por ejemplo, código `23` → normalizado `0023` → invertido `3200` → contraseña `1088`.
