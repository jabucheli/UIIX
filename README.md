# Presentación doctoral con NTP 330 integrado

Todo el trabajo se realiza en **esta carpeta `presentacion`**, con un único
repositorio Git: los 12 slides, la app de evaluación, las fuentes metodológicas,
las pruebas y las herramientas de guardado.

## Uso diario

- **Abrir y verificar:** doble clic en `iniciar.cmd`.
- **Verificar también toda la app:** `iniciar.cmd app` o `tools\reanudar.cmd app`.
- **Guardar:** doble clic en `guardar.cmd`.
- **Consultar respaldos:** `guardar.cmd estado`.
- **Recuperar:** `recuperar.cmd` muestra las instrucciones.

En el **slide 7**, el bloque **Riesgo** abre la app incluida en
`presentacion-web/ntp330/0/index.html`. También puede abrirse ese archivo
directamente. Las bibliotecas de PDF están incluidas y funcionan sin conexión.

```text
presentacion/
├── iniciar.cmd, guardar.cmd, recuperar.cmd
├── AGENTS.md, CONTINUIDAD.md, RESPALDO.md, TRASPASO.md
├── presentacion-web/
│   ├── index.html, css/, js/, assets/
│   └── ntp330/
│       ├── AGENTS.md, README.md, fuentes originales
│       ├── historial-origen.bundle, ORIGEN.json
│       └── 0/  → app, vendor/, docs/ y pruebas/
└── tools/      → verificadores, respaldo y recuperación
```

Las evaluaciones y cambios de catálogo se guardan en el navegador. Para incluir
el trabajo de evaluación en el respaldo: **Catálogo → Exportar respaldo JSON**
y guardar el archivo en `presentacion-web/ntp330/0/pruebas/out/respaldos/`.

## GitHub y publicación web

- Repositorio: **https://github.com/jabucheli/UIIX**.
- Presentación en GitHub Pages: **https://jabucheli.github.io/UIIX/**.
- App integrada: **https://jabucheli.github.io/UIIX/ntp330/0/index.html**.

El workflow `.github/workflows/pages.yml` verifica y publica el sitio al subir
cambios a `main`. `node tools/prepare-pages.js` prepara el sitio en
`tools/out/pages/`, con la presentación, las imágenes y la app integrada.

Las evaluaciones del navegador se trasladan mediante **Catálogo → Exportar /
Restaurar respaldo JSON**. La dirección HTTPS dispone de su propio almacenamiento.

Comprobación local del sitio preparado, incluidas las rutas bajo `/UIIX/`:

```bash
node tools/prepare-pages.js
node tools/integration_check.js --site=tools/out/pages --base-path=/UIIX/
```

Ver **`CONTINUIDAD.md`** para el estado actual, **`AGENTS.md`** para modificar
código y **`RESPALDO.md` / `TRASPASO.md`** para guardar o trasladar el proyecto.
