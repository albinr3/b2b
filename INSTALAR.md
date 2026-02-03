# Si npm install se cuelga o tarda mucho

## Paso 1: Limpiar caché de npm
En PowerShell o CMD, **fuera** de la carpeta del proyecto:

```powershell
npm cache clean --force
```

## Paso 2: Instalar en este proyecto
Abre una terminal **nueva**, ve al proyecto e instala:

```powershell
cd "F:\stitch (1)\stitch\b2b-auto-parts"
npm install
```

Si a los 2–3 minutos no aparece ningún progreso, **cancela con Ctrl+C** y prueba el Paso 3.

---

## Paso 3: Probar con Yarn (suele ir más rápido en Windows)
Instala Yarn una vez (en cualquier carpeta):

```powershell
npm install -g yarn
```

Luego en la carpeta del proyecto:

```powershell
cd "F:\stitch (1)\stitch\b2b-auto-parts"
yarn
```

Para arrancar el proyecto:

```powershell
yarn dev
```

---

## Paso 4: Ruta sin espacios (si sigue fallando)
La ruta `F:\stitch (1)\stitch` tiene espacio y paréntesis y a veces da problemas.

1. Copia toda la carpeta `b2b-auto-parts` a una ruta simple, por ejemplo:
   - `F:\b2b-auto-parts`
   o
   - `C:\proyectos\b2b-auto-parts`

2. Abre terminal en esa nueva carpeta y ejecuta:

```powershell
npm cache clean --force
npm install
npm run dev
```

---

## Paso 5: Antivirus / Windows Defender
Si nada de lo anterior funciona:

1. Abre **Seguridad de Windows** → **Protección contra virus y amenazas** → **Configuración**.
2. En “Exclusiones”, añade la carpeta del proyecto (ej. `F:\stitch (1)\stitch\b2b-auto-parts`).
3. Vuelve a intentar `npm install` o `yarn` en esa carpeta.

---

## Resumen rápido
1. `npm cache clean --force`
2. `npm install` (o `yarn` si lo instalaste).
3. Si se cuelga: probar **Yarn** o **mover el proyecto** a una ruta sin espacios y repetir.
4. Si sigue igual: **excluir la carpeta del proyecto** en el antivirus y repetir.
