# Guardado, recuperación y continuidad en este computador

Actualizado: **2026-10-25**. Carpeta de trabajo: `D:\ejemplo\presentacion`.

## 1. Rutina de cada sesión

| Momento | Acción |
|---|---|
| Empezar o volver después de reiniciar | Doble clic en **`iniciar.cmd`**: comprueba Node.js 22+, dependencias, inventario y app integrada, verifica los 12 slides y abre la presentación. |
| Antes de terminar o de un cambio grande | Guardar los archivos abiertos en el editor/Office y hacer doble clic en **`guardar.cmd`**. Esperar `RESPALDO COMPLETADO` e `INTEGRIDAD OK`. |
| Consultar las copias | En una consola de esta carpeta: **`guardar.cmd estado`**. Muestra cambios Git, última copia, avisos, registro y próxima ejecución automática. |
| Comprobar de nuevo la última copia | **`guardar.cmd verificar`**. Relee todo el ZIP y contrasta los SHA256 de sus archivos. |
| Recuperar una versión anterior | **`recuperar.cmd`** muestra la ayuda. La recuperación siempre exige una **carpeta nueva**. Ver §5. |

Desde consola, `guardar.cmd ahora` guarda sin la pausa final. Desde `tools`,
`respaldo.cmd` ofrece las mismas operaciones. **El respaldo conserva también los
archivos nuevos y cambios pendientes de commit**, junto con el historial Git
existente. No altera el índice ni crea commits; esos se solicitan por separado.

## 2. Respaldo automático

```bat
guardar.cmd agendar
guardar.cmd agendar 20:30
guardar.cmd estado
guardar.cmd quitar
```

La tarea **«Respaldo Presentacion Tesis»** se ejecuta diariamente a las **18:00**
por defecto. Guarda las rutas de Node, Git y del destino, funciona con batería,
evita ejecuciones simultáneas y recupera el horario omitido cuando Windows vuelva
a estar disponible **con la sesión de este usuario iniciada**. No requiere
contraseña ni privilegios elevados. `agendar`/`quitar` devuelven error si Windows
rechaza la operación; no anuncian un éxito ficticio.

Una tarea diaria complementa el guardado manual al terminar. No puede copiar los
cambios que todavía estén únicamente en la memoria de un editor.

## 3. Qué se guarda y cómo se comprueba

Todo se guarda desde **`presentacion`**. El slide 7 abre la app incluida en
`presentacion-web\ntp330\0\index.html`. El ZIP contiene:

- `presentacion\`: presentación, app NTP 330, imágenes, fotos, originales Office,
  especificaciones, documentación y herramientas, incluidos archivos ocultos
  como `.gitignore` y archivos todavía sin seguimiento en Git.
- `presentacion\presentacion-web\ntp330\`: app, fuentes metodológicas y
  `historial-origen.bundle` con el historial anterior del módulo.
- `historial-presentacion.bundle`: historial del repositorio único,
  comprobado con `git bundle verify`.
- `datos-respaldo\`: JSON **ya exportados** que estén en
  `presentacion-web\ntp330\0\pruebas\out\respaldos\`.
- `ESTADO.json`: equipo, fecha UTC, commits de partida, cambios pendientes,
  resultados de las verificaciones, JSON disponibles y avisos.
- `comprobaciones\`: resultados de mapa, foco, inventario y copia.
- `LEEME.txt`: instrucciones autónomas de recuperación.
- `MANIFIESTO.json`: tamaño y **SHA256 de cada archivo**.

Se excluyen `.git` (se usa el bundle), `node_modules`, `presentacion\tools\out`,
`presentacion-web\ntp330\0\pruebas\out` (salvo los JSON citados), bloqueos de Office y temporales.
Las dependencias se regeneran con `npm ci`; las capturas con `reanudar.cmd shot`.

Cada ejecución usa un nombre con segundos, milisegundos e identificador único:
dos guardados en el mismo minuto **no se sobrescriben**. Primero se construye un
`.partial`, después se relee y se verifica todo el contenido, y solo entonces se
publican el `.zip` y su `.zip.sha256`. La copia se contrasta también con los
archivos de origen. Si un archivo cambia durante la copia, se informa para repetirla.

**Una prueba en rojo no impide guardar el trabajo.** Queda registrada como aviso
en el paquete. En cambio, un fallo de copia o integridad devuelve error,
conserva el material de trabajo en `tools\out\respaldo-*` y **no rota las copias
anteriores**. No se informa `RESPALDO COMPLETADO` ante un fallo de integridad.

Solo después de verificar la nueva copia se conservan los **14 ZIP más
recientes** y sus checksums. El registro `respaldo.log` y
`ultimo-respaldo.json` quedan en la carpeta de respaldos.

## 4. Destino de las copias

Por defecto se usa una carpeta **hermana**, calculada a partir del proyecto:

```text
D:\ejemplo\
├── presentacion\
└── respaldos\
    ├── presentacion-tesis-AAAAMMDD-HHMMSS-mmm-ID.zip
    ├── presentacion-tesis-AAAAMMDD-HHMMSS-mmm-ID.zip.sha256
    ├── ultimo-respaldo.json
    └── respaldo.log
```

Para cubrir también la pérdida o avería del disco `D:`, guardar el ZIP **y su
checksum** en una unidad externa o carpeta sincronizada. Puede configurarse el
destino desde `cmd` antes de guardar o programar la tarea:

```bat
set "RESPALDO_DIR=E:\respaldos-tesis"
guardar.cmd ahora
guardar.cmd agendar
```

La tarea conserva ese destino. Para consultar una ubicación personalizada, usar
la misma variable al ejecutar `guardar.cmd estado` o `guardar.cmd verificar`.
El destino de respaldo no puede estar dentro de las carpetas del proyecto.

## 5. Recuperación comprobada, sin sobrescribir

Con el proyecto actual disponible, en una consola de `D:\ejemplo\presentacion`:

```bat
recuperar.cmd -Paquete "D:\ejemplo\respaldos\presentacion-tesis-FECHA-ID.zip" -Destino "D:\ejemplo\recuperacion-FECHA"
```

Sustituir el nombre por un ZIP real. `recuperacion-FECHA` **no debe existir**;
su carpeta madre debe existir. El proceso:

1. Comprueba el checksum del ZIP si está disponible, todo el manifiesto y las
   rutas antes de crear el destino.
2. Extrae el proyecto integrado y vuelve a verificar sus archivos en disco.
3. Recupera el historial Git del bundle y carga el índice de `HEAD`
   **sin escribir sobre los archivos recuperados**. Los cambios del ZIP que no
   estaban commiteados siguen presentes como cambios pendientes.
4. Ejecuta el inventario de la copia recuperada.
5. Indica el `presentacion\iniciar.cmd` de la nueva copia para continuar.

Los JSON exportados se conservan también en la carpeta interna de respaldos de
la app, para incluirlos en el siguiente guardado. El recuperador sigue aceptando
los paquetes antiguos que contenían las dos carpetas de trabajo.

Se necesitan Git para recuperar el historial y Node.js 22+ para verificar y
continuar. `iniciar.cmd` instala las dependencias bloqueadas con `npm ci` si
faltan. Revisar primero la copia nueva; mantener las carpetas originales hasta
confirmar que contiene lo necesario.

**Si falta el proyecto original:** extraer el ZIP en una carpeta nueva desde
Windows, abrir una consola en ella y ejecutar:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File presentacion\tools\recuperar.ps1 -CarpetaExtraida "."
```

Esta modalidad verifica los archivos extraídos y recupera Git; se usa solo sobre
una extracción nueva, sin `.git`. **Copias antiguas** anteriores al manifiesto
(por ejemplo, `presentacion-tesis-20261024-1800.zip`): extraer manualmente en una
carpeta nueva, consultar su `LEEME.txt`, instalar dependencias y ejecutar
`reanudar.cmd`. No tienen la verificación SHA256 incorporada del proceso actual.

## 6. Datos reales de la app NTP 330

Las evaluaciones, proyectos y cambios de catálogo viven en el
**`localStorage` del navegador**, no en los archivos del proyecto. Para incluirlos:

1. Guardar la evaluación en la app.
2. Abrir **Catálogo → Copia de seguridad de los datos → Exportar respaldo (JSON)**.
3. Guardar/copiar el JSON descargado en
   `D:\ejemplo\presentacion\presentacion-web\ntp330\0\pruebas\out\respaldos\`.
4. Validarlo y hacer el respaldo del proyecto:

   ```bat
    node presentacion-web\ntp330\0\pruebas\verificar-respaldo.js "presentacion-web\ntp330\0\pruebas\out\respaldos\MI-RESPALDO.json"
   guardar.cmd ahora
   ```

Para recuperar esos datos: abrir la app desde la copia recuperada → **Catálogo
→ Restaurar respaldo**, seleccionando el JSON propio de `datos-respaldo\`.

`ntp330-respaldo-ejemplo.json` contiene datos ficticios. Para guardar los datos
reales se debe exportar el JSON del navegador utilizado. Una exportación puede
estar legítimamente vacía después de eliminar una prueba; se conserva ese estado
sin restaurar el ejemplo como si fueran datos reales.

## 7. Verificación de los procesos

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File tools\probar-respaldo.ps1
tools\reanudar.cmd
guardar.cmd verificar
```

La suite de respaldo utiliza carpetas aisladas bajo `tools\out`, prueba
recuperación, corrupción, sobrescritura, rutas con espacios/apóstrofes, bloqueo,
retención y guardado con verificaciones en rojo. El objetivo de la presentación
es **54/54 mapa + 920/920 foco + `TODO OK`**.
