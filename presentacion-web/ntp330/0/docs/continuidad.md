# Continuidad del trabajo

Este documento es el punto de partida para **retomar el proyecto más adelante**, en este
equipo o en otro. Existe por dos razones concretas:

**Desde 2026-10-25, la app está integrada en `presentacion`.** El punto de entrada
es `iniciar.cmd` en la raíz del proyecto único. `tools\reanudar.cmd app` verifica
la presentación y el recorrido completo de la app; `guardar.cmd` respalda todo.
Los comandos `node 0/...` que siguen se ejecutan desde la carpeta de este módulo,
`presentacion-web/ntp330/`, dentro del mismo repositorio principal.

1. **Los datos del usuario no están en los archivos del proyecto.** Viven en el navegador
   (localStorage, claves `ntp330.*`). Copiar la carpeta no copia las evaluaciones.
2. **El estado del avance está en tres sitios**: el código (git), la documentación
   (`AGENTS.md`, `docs/ESTADO.md`, `docs/adaptaciones.md`) y los datos (respaldo JSON).

---

## 1. Rutina de inicio: retomar en este equipo

Tarda menos de un minuto y evita perder el hilo.

```bash
cd D:\ejemplo\presentacion\presentacion-web\ntp330
git status                      # ¿hay cambios sin commit?
git log --oneline -5            # ¿dónde quedó el trabajo?
```

Después, en este orden:

| # | Paso | Para qué |
|---|---|---|
| 1 | Abrir `0/index.html` en Chrome | la app funciona con `file://` |
| 2 | Pestaña **Catálogo** → leer `#backup-resumen` | saber cuántas evaluaciones hay **en ese navegador** |
| 3 | Leer el último punto de `0/docs/ESTADO.md` (§4) | qué se hizo en la última tanda |
| 4 | Leer **Pendientes conocidos** en `AGENTS.md` §8 | qué quedó a medias |
| 5 | `node 0/pruebas/verificar.js` | confirmar que el árbol está sano antes de tocar nada |

Si el punto 5 falla, no se continúa: primero se averigua por qué. Un árbol que no pasa sus
pruebas hace imposible saber si el fallo es de lo que se está tocando.

## 2. Rutina de cierre: dejar el equipo listo para volver

Al terminar una tanda de trabajo, aunque sea media hora:

```bash
node 0/pruebas/verificar.js     # 1. la suite debe dar 52/52 y 0 errores de consola
..\..\guardar.cmd              # respaldo del proyecto integrado, sin crear commits
```

Y, si hubo trabajo de evaluación con datos (**esto no lo hace git**):

1. Pestaña **Catálogo** → **Exportar respaldo (JSON)**.
2. Mover el archivo a `0/pruebas/out/respaldos/`.
3. Comprobar que sirve:
   ```bash
   node 0/pruebas/verificar-respaldo.js
   ```

El paso 3 no es opcional en la práctica: un respaldo que nunca se validó es una suposición.
El comando avisa si el JSON está vacío, corrupto, si no tiene evaluaciones o si su resumen
no cuadra con el contenido.

### Qué commitear y qué no

| Va a git | No va a git |
|---|---|
| `0/` (código, CSS, HTML, docs, `0/pruebas/*.js`) | `0/pruebas/out/` (capturas, informes, respaldos) |
| `AGENTS.md`, `0/docs/*.md` | `~$*.xlsx`, `~$*.docx` (bloqueos de Office) |
|Fuentes (`nd.xlsx`, `330.pdf`, `*.docx`) | El `localStorage` del navegador |

`0/pruebas/out/` ya está en `.gitignore`: son archivos de trabajo que se regeneran.

## 3. Verificación reproducible

Las herramientas de prueba viven **dentro del repositorio**, en `0/pruebas/`, para que no
dependan de nada de este equipo concreto. No usan npm: solo módulos nativos de Node y el
WebSocket global de Node 22.

```bash
# Todo lo de AGENTS.md §7, en el orden que lo fija
node 0/pruebas/verificar.js

# Solo sintaxis + suite de 52 pruebas (rápido)
node 0/pruebas/verificar.js --rapido

# Recorrido del bloque 2: agregar riesgos, cuestionario, NE, NC, exclusión,
# aislamiento de proyectos y medidas de la fila de identificación
node 0/pruebas/prueba-bloque2.js

# Captura y auditoría del DOM de cualquier pestaña
node 0/pruebas/verificar-cdp.js 0/pruebas/out/x.png --tab=pruebas --run

# Respaldo de ejemplo, para probar el validador sin tocar los datos reales
node 0/pruebas/generar-respaldo-ejemplo.js
node 0/pruebas/verificar-respaldo.js
```

Si Chrome está instalado en otro sitio:

```bash
set NTP330_CHROME=C:\Ruta\Alternativa\chrome.exe
```

Notas importantes de estas herramientas:

- Cada ejecución usa un **perfil desechable** y una copia de la app bajo
  `tools/out/` del proyecto principal. Nunca tocan los datos del navegador del usuario.
- jsPDF y AutoTable están incluidos en `0/vendor/` y los PDF funcionan sin red.
- Las imágenes las revisa una persona: el script mide geometría del DOM, no «ve».

## 4. Dónde vive cada cosa

| Dato | Ubicación | ¿Se copia con la carpeta? |
|---|---|---|
| Código (HTML/CSS/JS) | `0/` | **sí** |
| Herramientas de verificación | `0/pruebas/*.js` | **sí** |
| Metodología y fuentes | `330.pdf`, `nd.xlsx`, `matriz.xlsx`, `*.docx`, `correcciones*.md` | **sí** |
| Proyectos creados | localStorage `ntp330.proyectos` | **no** |
| Evaluaciones (respuestas, NE, NC, controles, aprobación) | localStorage `ntp330.evaluaciones` | **no** |
| Ediciones del catálogo (texto y NDR) | localStorage `ntp330.catalogo.override` | **no** |
| Tipos/procesos/actividades/tareas | localStorage `ntp330.proyectos.override` | **no** |
| Configuración (perfil de NI) | localStorage `ntp330.config` | **no** |

## 5. Cambiar de equipo

1. En el equipo de origen: **Exportar respaldo (JSON)** y validarlo con
   `node 0/pruebas/verificar-respaldo.js <archivo>`.
2. Copiar la carpeta del proyecto (el respaldo incluido) por USB, red o repositorio.
3. En el equipo nuevo: abrir `0/index.html` → **Catálogo** → **Restaurar respaldo
   (reemplaza todo)** → seleccionar el JSON → aceptar el recargado.
4. Comprobar en **Matriz unificada y análisis** que aparecen los proyectos y evaluaciones.

Variantes:

- **Restaurar y combinar con lo actual**: no borra lo que ya hubiera; las claves del
  archivo sobrescriben las suyas. Útil si el destino ya tiene datos.
- **Antes de restaurar**, exportar también un respaldo del equipo destino por si hubiera
  que deshacer.
- Si el destino usa otro navegador o perfil, el respaldo es la única vía: el
  `localStorage` de `file://` no se comparte entre navegadores.

## 6. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| No aparece ningún proyecto en la lista | el respaldo se restauró en otro prefijo o el archivo no es un respaldo | `node 0/pruebas/verificar-respaldo.js <archivo>` antes de restaurarlo |
| Los datos desaparecieron | se cambió de navegador, de perfil o de equipo | restaurar el JSON de respaldo |
| «No hay procesos definidos para este tipo de proyecto» | no se ha elegido todavía el nombre del proyecto | elegir el tipo y luego abrir la lista del desplegable del nombre |
| El PDF no se genera y se abre una vista imprimible | sin internet (jsPDF se carga desde CDN) | conectar a internet; la aplicación sigue funcionando |
| Las 52 pruebas no dan 52/52 | se modificó motor, catálogo o umbrales sin actualizar las pruebas | revisar `0/js/app.pruebas.js` y `docs/adaptaciones.md` antes de cambiar el cálculo |
| `Cannot copy ... to a subdirectory of self` | una herramienta dejó la copia de trabajo dentro de `0/` | las copias van al temporal del sistema; es lo que hacen las de `0/pruebas/` |
| Chrome no responde en el puerto de depuración | se agotaron los reintentos antes de que arrancara | las herramientas esperan con pausas; si persiste, comprobar `NTP330_CHROME` |
