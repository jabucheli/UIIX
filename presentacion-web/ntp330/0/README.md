# Evaluación de riesgos laborales · NTP 330

Aplicación web (HTML + CSS + JavaScript, sin framework y sin build) para evaluar riesgos
laborales de proyectos de construcción con el método **NTP 330** (INSST, 1991), adaptada a la
normativa ecuatoriana. Forma parte del proyecto único `presentacion` y se abre
desde el bloque Riesgo del slide 7.

## Cómo ejecutarla

Opción 1 — abrir el archivo directamente:

```text
doble clic en 0/index.html
```

Opción 2 — servidor local (recomendado si el navegador restringe `file://`):

```bash
cd 0
npx serve .            # o: python -m http.server 8000
```

Requisitos: navegador moderno (Chrome/Edge/Firefox). Las bibliotecas jsPDF y
AutoTable están incluidas en `vendor/`, por lo que los PDF funcionan sin conexión.

## Qué hace

1. **Identificación del proyecto** — tipo (Estructura / Infraestructura), nombre y proceso
   constructivo. El identificador es `PROY-XXXX`.
2. **Matriz de evaluación NTP 330** — los riesgos se añaden uno a uno desde los
   desplegables del proceso y se pueden incluir o excluir con justificación.
3. **Evaluación por riesgo** — lista de chequeo (`nd.xlsx`) en un modal, con las
   respuestas Sí / No / No aplica / No verificado. ND, NP, NR y el nivel de intervención se
   calculan solos a partir de las respuestas, NE y NC. Incluye controles y evaluación residual.
4. **Estrategias de control (ART)** — descarga en A4 y A3 horizontal, vista previa y
   exportaciones a CSV, JSON y Excel.

Pestañas adicionales: *Matriz unificada y análisis* (tabla consolidada + 5 gráficos),
*ARTs generados*, *Catálogo* (administración de listas y procesos + **copia de seguridad**),
*Pruebas* (52 pruebas de validación del motor) y *Metodología NTP 330* (tablas de la norma).

## Dónde se guardan los datos

**En el navegador, no en los archivos.** Todo lo que crea el usuario (proyectos, evaluaciones,
respuestas, ediciones del catálogo) se guarda en el `localStorage` del equipo con el prefijo
`ntp330.`. Consecuencia: si se cambia de computador, de navegador o de perfil, esos datos
desaparecen salvo que se exporte un respaldo.

- Desde la interfaz: pestaña *Catálogo* → «Copia de seguridad de los datos».
- Desde la consola del navegador:

```js
BackupApp.exportar()      // descarga ntp330-respaldo-AAAAMMDD-HHMM.json
BackupApp.resumen()       // {claves, evaluaciones, proyectos}
```

El procedimiento completo de traspaso entre equipos está en `docs/continuidad.md`.

## Mapa de archivos

```text
index.html            estructura de la página y orden de carga de los scripts
css/style.css         estilos
js/
  app.data.*.js       datos generados desde nd.xlsx / legal.docx / script original
  app.metodologia.js  tablas y umbrales de la NTP 330
  app.motor.js        cálculo ND → NP → NR
  app.db.js           persistencia e identificadores
  app.controles.js    controles y evaluación residual
  app.ui.js           interfaz
  app.reportes.js     CSV / JSON / Excel / ART / listas de chequeo
  app.admin.js        administración del catálogo
  app.backup.js       copia de seguridad (export / import)
  app.pruebas.js      52 pruebas de validación
docs/
  adaptaciones.md     registro de decisiones metodológicas (trazabilidad con las fuentes)
  ESTADO.md           qué está hecho, qué falta
  continuidad.md      protocolo para cambiar de equipo sin perder datos
legacy/               versión original de un solo archivo (referencia, no editar)
vendor/               bibliotecas locales de PDF y licencias
```

## Reglas rápidas para quien modifique el código

- Las fórmulas son intocables: `NP = ND × NE`, `NR = NP × NC`, `NI = f(NR)`.
- Los archivos `app.data.*.js` son generados: no editarlos a mano.
- Cada archivo es un IIFE: lo que se define en uno **no** es visible en otro salvo que se
  publique en `window`.
- Antes de dar por buena una modificación, ejecutar la pestaña *Pruebas* (debe dar 52/52) y
  comprobar que no haya errores en la consola del navegador.
- El contexto completo para sesiones de trabajo está en `../AGENTS.md`.
