# Traspaso y guardado de la carpeta `presentacion`

Procedimiento para garantizar que la carpeta `presentacion` **contiene guardado todo lo
necesario** para retomar el trabajo en este u otro computador. Es el complemento
práctico de `CONTINUIDAD.md`: aquí se describe el **proceso de cierre**
(dejar la carpeta lista para guardar/llevar) y el de **apertura** (ponerla en
marcha en un equipo nuevo).

Herramientas:

| Archivo | Qué hace |
|---|---|
| `tools/inventario.json` | Manifiesto: archivos y carpetas que DEBEN existir en `presentacion` (más la hermana `tesis`). |
| `tools/verificar-inventario.js` | Comprueba el manifiesto y avisa de lo que git tiene sin commitear. `node tools/verificar-inventario.js`. |
| `tools/traspaso.cmd` | Orquestador: inventario → (opcional verificación completa) → **genera el `.zip` portable** en `tools\out\traspaso\`. |
| `tools/traspaso-empaquetar.ps1` | Empaquetador (lo llama `traspaso.cmd`): comprime `tes` + `tesis` + respaldos. |

---

## 1. Qué debe quedar guardado en la carpeta

Todo el árbol de `tes` **excepto** lo que se regenera y la basura:

| Va | No va (se regenera / basura) |
|---|---|
| `presentacion-web\` (código, `assets\`, `css\`, `js\`) | `tools\node_modules\` (se crea con `npm install`) |
| `tools\` (harness de verificación, `.cmd`, `.js`) | `tools\out\` (capturas e informes; se recrean con `verify-all.cmd shot`) |
| `CONTINUIDAD.md`, `TRASPASO.md`, especificaciones `*.md` | `~$*.docx` / `~$*.pptx` / `~WRL*.tmp` (bloqueos de Office) |
| Fuentes: `Ejemplo.pptx`, `*.docx`, `*.md`, imágenes, `fotos\` | dump temporal `f`, `*.out`, `*.tmp` |
| `tesis\` (carpeta **hermana**): la app `0\` de evaluación NTP 330 | `tesis\0\pruebas\out\` (se regenera) |

> **Regla de oro:** `presentacion` y `tesis` son **carpetas hermanas** y viajan juntas. La
> presentación embebe la app del slide 7 desde `tesis\0`, y `reanudar.cmd`
> comprueba que exista. Si se copia `presentacion` sola, falta la app.

El verificador (`inventario.json` + `verificar-inventario.js`) es quien da fe de
que todo lo de la columna «Va» está físicamente presente.

---

## 2. Proceso de cierre (cada vez que se deje de trabajar)

Tarda menos de un minuto. Se puede encadenar; los pasos 1 y 2 son el mínimo.

```bash
cd tools
traspaso.cmd               # 1. inventario + estado git
```

1. **Inventario**: `traspaso.cmd` comprueba que existen todos los archivos y
   carpetas requeridos. Si informa `INVENTARIO INCOMPLETO`, falta algo: no seguir.
2. **Estado git**: el mismo comando lista lo que git todavía no guarda. Mientras
   haya archivos «sin commitear», cópialos a git (el código es lo que viaja en el
   historial y lo que permite `git bundle`):

   ```bash
   cd ..\..\tesis      # (solo si hay cambios en la app)
   git add -A && git commit -m "Descripción breve en español"
   cd ..\presentacion\tools
   git -C .. add -A && git -C .. commit -m "Descripción breve en español"
   ```

3. **Paquete portable** (cuando se vaya a guardar o llevar el trabajo):

   ```bash
   traspaso.cmd paquete     # o: traspaso.cmd todo  (agrega verify-all completo)
   ```

   Genera `tools\out\traspaso\presentacion-tesis-AAAAMMDD-HHMM.zip` que contiene:

   - `presentacion\` — todo el árbol (sin `.git`, sin `node_modules`, sin `tools\out`, sin basura).
   - `tesis\` — la app hermana completa (sin `.git`, sin `0\pruebas\out`).
   - `datos-respaldo\` — copias JSON de las evaluaciones si existen en
     `..\..\tesis\0\pruebas\out\respaldos`.
   - `historial-presentacion.bundle` / `historial-tesis.bundle` — historial git completo.
   - `LEEME.txt` — instrucciones de restauración.

4. Opcional, para asegurar que el zip sirve: extraerlo en una carpeta temporal
   y volver a pasar el inventario:

   ```bash
   node tools/verificar-inventario.js     # en la copia extraída
   ```

---

## 3. Proceso de apertura (en otro computador)

Con el `presentacion-tesis-*.zip` en el equipo nuevo:

1. Instalar **Node.js 22 o superior** (npm incluido). Chrome solo hace falta si
   se quieren capturas/verificación visual.
2. Descomprimir el zip en la carpeta donde vayan a vivir las dos carpetas,
   **habiendo `presentacion\` y `tesis\` al mismo nivel** (ej. `D:\ejemplo\presentacion` y
   `D:\ejemplo\tesis`).
3. Primera vez, instalar las dependencias de verificación y comprobar:

   ```bash
   cd presentacion\tools
   npm install
   reanudar.cmd            # entorno + verificación completa (54/54 + 770/770)
   ```

   Si Chrome no está en `C:\Program Files\Google\Chrome\Application\chrome.exe`,
   editar la línea `set CHROME=...` en `verify-all.cmd` y `reanudar.cmd`.
4. Abrir la presentación: doble clic en `presentacion-web\index.html`, o
   `npx serve presentacion-web -l 8080`. La app de riesgos se abre desde el
   bloque Riesgo del slide 7 y vive en `tesis\0`.
5. Si el paquete trae `datos-respaldo\*.json` (evaluaciones de la app): abrir
   `tesis\0\index.html` → pestaña **Catálogo** → **Restaurar respaldo**.
6. Historial git (opcional, para recuperar los commits): en una carpeta vacía,
   `git bundle unbundle historial-presentacion.bundle` / `historial-tesis.bundle`, o
   `git clone historial-presentacion.bundle presentacion`.

Documentación de referencia una vez dentro:

| Doc | Qué es |
|---|---|
| `presentacion\CONTINUIDAD.md` | Cómo retomar el trabajo en este u otro equipo. |
| `presentacion\TRASPASO.md` | Este documento. |
| `presentacion\EPTransf.md` | Especificación de la propuesta de transformación (EPT). |
| `tesis\AGENTS.md` | Reglas de la aplicación de evaluación de riesgos. |
| `tesis\0\docs\ESTADO.md` | Estado y pendientes de la app NTP 330. |

---

## 4. Datos del usuario (lo que NO está en los archivos)

Las evaluaciones y proyectos de la app **no viven en los archivos**: viven en el
`localStorage` de cada navegador (claves `ntp330.*`). Solo viajan como respaldo
JSON explícito:

- Pestaña **Catálogo** → **Exportar respaldo (JSON)** en la app.
- Validarlo con `node tesis\0\pruebas\verificar-respaldo.js <archivo>`.
- El paquete de `traspaso.cmd paquete` lo copia a `datos-respaldo\` si está en
  `tesis\0\pruebas\out\respaldos\`.

Sin ese respaldo, cambiar de equipo o de navegador pierde las evaluaciones.