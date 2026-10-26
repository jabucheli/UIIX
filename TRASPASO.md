# Guardado y traspaso del proyecto único `presentacion`

Actualizado: **2026-10-25**. Para el trabajo diario en este computador:
**`iniciar.cmd`** al empezar y **`guardar.cmd`** al terminar.
El procedimiento de respaldo, automatización y recuperación está en
**`RESPALDO.md`**; el estado del trabajo en **`CONTINUIDAD.md`**.

## 1. Una sola carpeta contiene el trabajo

```text
presentacion\
├── iniciar.cmd
├── guardar.cmd
├── tools\
└── presentacion-web\
    ├── index.html
    └── ntp330\
        └── 0\index.html
```

El slide 7 abre la app NTP 330 incluida en `presentacion-web\ntp330`. El inventario
`tools\inventario.json` exige los archivos del proyecto único, sus fuentes,
imágenes, herramientas y documentación necesarios para continuar.

## 2. Cierre y paquete portable

Primero guardar los archivos abiertos en el editor/Office. Desde `tools`:

```bat
traspaso.cmd
traspaso.cmd paquete
traspaso.cmd todo
```

- Sin argumentos: inventario y estado Git.
- `paquete`: inventario y ZIP verificado en `tools\out\traspaso\`.
- `todo`: añade la verificación completa antes de construir el paquete.

El empaquetador es el mismo del respaldo diario. Conserva **archivos pendientes
de commit**, fuentes originales, imágenes, `.gitignore`, herramientas, el
historial Git principal y el historial de origen archivado del módulo, JSON ya exportados, `ESTADO.json`, informes,
`LEEME.txt` y un manifiesto SHA256. No depende de `%TEMP%` y cada nombre es único.
No exige crear commits para guardar los archivos actuales.

Se excluyen dependencias, capturas/salidas regenerables y temporales de Office.
Copiar **el ZIP y su `.zip.sha256`** al otro equipo. `tools\out` es regenerable:
para un respaldo permanente local usar `guardar.cmd`, que guarda fuera del
proyecto y conserva las 14 copias más recientes.

## 3. Apertura en este u otro computador

1. Instalar **Node.js 22+**, **Git** y **Chrome**.
2. Si hay un proyecto disponible, usar su recuperador:

   ```bat
   recuperar.cmd -Paquete "E:\copia\presentacion-tesis-FECHA-ID.zip" -Destino "D:\ejemplo\recuperacion-FECHA"
   ```

   El destino debe ser nuevo y su carpeta madre debe existir. Se comprueban
   integridad, archivos extraídos e inventario y se recupera el historial Git.
3. Si solo se dispone del ZIP, extraerlo en una carpeta nueva y, desde ella:

   ```bat
   powershell -NoProfile -ExecutionPolicy Bypass -File presentacion\tools\recuperar.ps1 -CarpetaExtraida "."
   ```

4. Doble clic en **`presentacion\iniciar.cmd`**. Instala las dependencias con
   `npm ci` si faltan, verifica **54/54 + 920/920 + `TODO OK`** y abre la presentación.
5. Leer **`CONTINUIDAD.md`**, especialmente el resumen y la última sección.
6. Programar el respaldo en el nuevo equipo con `guardar.cmd agendar`.

Si Chrome no está en la ruta habitual, ajustar `CHROME` en `iniciar.cmd`,
`tools\reanudar.cmd` y `tools\verify-all.cmd`. El historial se restaura con
`git clone --no-checkout` en un directorio auxiliar: nunca clonar directamente
sobre la carpeta de archivos ya extraídos.

## 4. Evaluaciones y proyectos del navegador

Los archivos de la app no contienen las evaluaciones del usuario: viven en
`localStorage`. Antes del traspaso, **exportar el respaldo JSON desde Catálogo**,
validarlo y guardarlo en `presentacion-web\ntp330\0\pruebas\out\respaldos\`; después crear el ZIP.
En el equipo de destino, importar el JSON propio de `datos-respaldo\` desde
Catálogo. Un JSON de ejemplo no sustituye el de los datos reales.

Detalle paso a paso: **`RESPALDO.md` §6** y `presentacion-web\ntp330\0\docs\continuidad.md`.

## 5. Documentación para continuar

| Documento | Contenido |
|---|---|
| `presentacion\AGENTS.md` | Reglas de trabajo y arquitectura de la presentación. |
| `presentacion\CONTINUIDAD.md` | Estado, cambios recientes, verificaciones y capturas. |
| `presentacion\RESPALDO.md` | Rutina diaria, tarea automática, comprobación y recuperación. |
| `presentacion\presentacion-web\ntp330\AGENTS.md` | Reglas de la app de evaluación. |
| `presentacion\presentacion-web\ntp330\0\docs\ESTADO.md` | Estado y pendientes de la app. |
