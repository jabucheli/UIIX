# Instrucciones para desarrollar una aplicación web interactiva de evaluación de riesgos laborales basada en la NTP 330

## 1. Rol que debe asumir el desarrollador o asistente de programación

Actúa como un equipo multidisciplinario integrado por:

- Un experto en prevención de riesgos laborales y Seguridad y Salud en el Trabajo.
- Un especialista en gestión de proyectos de construcción.
- Un investigador doctoral en Dirección de Proyectos.
- Un desarrollador de aplicaciones web.
- Un analista de datos.
- Un especialista en la metodología española NTP 330.
- Un conocedor de la normativa ecuatoriana de Seguridad y Salud en el Trabajo vigente entre 2024 y 2026.

La aplicación debe desarrollarse con rigurosidad técnica, trazabilidad de la información, claridad metodológica y facilidad de uso.

---

## 2. Contexto de la investigación doctoral

La aplicación forma parte del procesamiento interactivo de información de la tesis doctoral titulada:

> **“Estrategia metodológica de gestión de proyectos basada en controles de ingeniería, orientada a la mejora de las condiciones de seguridad laboral y la prevención de riesgos en proyectos de construcción de la ciudad de Quito, en conformidad con la normativa ecuatoriana vigente entre 2024 y 2026”.**

La herramienta debe apoyar la identificación, evaluación, clasificación y priorización de riesgos laborales asociados a procesos constructivos, utilizando como fundamento principal la metodología de evaluación de riesgos contenida en la **NTP 330**.

La aplicación no debe sustituir el criterio profesional del técnico de prevención. Debe funcionar como una herramienta de apoyo metodológico, cálculo, registro y trazabilidad.

---

## 3. Objetivo general de la aplicación

Desarrollar una página web interactiva que permita:

1. Seleccionar un proceso constructivo.
2. Seleccionar una actividad o tarea asociada.
3. Identificar uno o varios peligros o riesgos laborales.
4. Relacionar cada riesgo con la lista de chequeo correspondiente.
5. Registrar respuestas de cumplimiento mediante opciones **Sí / No / No aplica**.
6. Calcular automáticamente el nivel de deficiencia.
7. Registrar o calcular el nivel de exposición.
8. Calcular el nivel de probabilidad.
9. Registrar el nivel de consecuencia.
10. Calcular el nivel de riesgo e intervención.
11. Clasificar y priorizar los riesgos.
12. Registrar controles de ingeniería existentes y propuestos.
13. Generar reportes, tablas, gráficos y archivos exportables.
14. Mantener trazabilidad entre proceso, actividad, riesgo, lista de chequeo, respuestas, cálculos y medidas preventivas.

---

## 4. Archivos fuente

La aplicación debe utilizar como fuentes principales los siguientes archivos locales:

### 4.1 Metodología NTP 330

```text
D:\ejemplo\tesis\330.pdf
```

Este documento contiene la metodología, definiciones, tablas, niveles, criterios de valoración y reglas de cálculo.

### 4.2 Información complementaria para evaluación de riesgos

```text
D:\ejemplo\tesis\ER
```

Revisar todos los archivos contenidos en esta carpeta. Extraer las variables, criterios, tablas y relaciones utilizadas para:

- Nivel de deficiencia.
- Nivel de exposición.
- Nivel de probabilidad.
- Nivel de consecuencia.
- Nivel de riesgo.
- Nivel de intervención.
- Aceptabilidad o prioridad de actuación.

No asumir valores cuando exista información expresa en estos archivos.

### 4.3 Procesos constructivos

```text
D:\ejemplo\tesis\procesos.doc
```

Este archivo debe utilizarse para construir el catálogo inicial de:

- Procesos constructivos.
- Subprocesos.
- Actividades.
- Tareas.
- Etapas de obra.
- Riesgos asociados, cuando estén incluidos.

### 4.4 Listas de chequeo para el nivel de deficiencia

```text
D:\ejemplo\tesis\nd.xls
```

Este archivo debe utilizarse como fuente principal para:

- Listas de chequeo.
- Preguntas o ítems de verificación.
- Riesgo al que pertenece cada lista.
- Criterios de respuesta.
- Puntajes.
- Ponderaciones.
- Fórmulas.
- Rangos.
- Clasificación final del nivel de deficiencia.

Se deben respetar las fórmulas y reglas del archivo Excel. La aplicación debe reproducir sus cálculos y validar que los resultados obtenidos sean equivalentes.

---

## 5. Regla principal de implementación

Antes de programar los cálculos:

1. Leer y analizar todos los archivos fuente.
2. Identificar las tablas y reglas metodológicas.
3. Documentar la correspondencia entre cada dato de entrada y su archivo de origen.
4. Crear una matriz de trazabilidad.
5. Validar cualquier fórmula contra los resultados existentes en el archivo Excel.
6. No inventar escalas, valores, rangos ni clasificaciones.
7. En caso de contradicción entre archivos, utilizar como referencia principal la NTP 330 y documentar la diferencia.
8. Cuando el archivo `nd.xls` utilice una adaptación específica, mantenerla claramente identificada como adaptación de la investigación.

---

## 6. Alcance funcional

### 6.1 Módulo de administración de catálogos

Debe permitir administrar los siguientes catálogos:

- Proyectos.
- Obras.
- Frentes de trabajo.
- Etapas constructivas.
- Procesos constructivos.
- Subprocesos.
- Actividades.
- Tareas.
- Peligros.
- Riesgos.
- Factores de riesgo.
- Listas de chequeo.
- Preguntas de chequeo.
- Niveles de deficiencia.
- Niveles de exposición.
- Niveles de probabilidad.
- Niveles de consecuencia.
- Niveles de riesgo.
- Niveles de intervención.
- Controles existentes.
- Controles de ingeniería propuestos.
- Responsables.
- Fechas de evaluación.
- Evaluadores.

Los catálogos deben poder editarse sin modificar el código fuente.

---

## 7. Estructura jerárquica de la información

La estructura mínima debe ser:

```text
Proyecto
└── Etapa constructiva
    └── Proceso constructivo
        └── Subproceso
            └── Actividad
                └── Tarea
                    └── Peligro
                        └── Riesgo
                            └── Lista de chequeo
                                └── Preguntas
                                    └── Respuestas
```

Cada evaluación debe conservar esta relación completa.

---

## 8. Flujo principal de evaluación

### Paso 1. Identificación del proyecto

El usuario debe ingresar o seleccionar:

- Nombre del proyecto.
- Ubicación.
- Empresa.
- Contratista.
- Fiscalización.
- Fecha.
- Etapa de obra.
- Frente de trabajo.
- Evaluador.
- Cargo del evaluador.

### Paso 2. Selección del proceso constructivo

La aplicación debe mostrar los procesos obtenidos desde:

```text
D:\ejemplo\tesis\procesos.doc
```

El usuario seleccionará:

- Proceso.
- Subproceso.
- Actividad.
- Tarea.

Debe existir la opción de crear nuevos registros.

### Paso 3. Identificación del peligro y riesgo

Para cada actividad o tarea, el usuario debe poder:

- Seleccionar un riesgo previamente relacionado.
- Agregar un riesgo no registrado.
- Describir la fuente generadora.
- Describir las posibles consecuencias.
- Identificar personas expuestas.
- Registrar número de trabajadores expuestos.
- Registrar observaciones.
- Adjuntar fotografías o evidencias.

### Paso 4. Selección automática de la lista de chequeo

Cuando se seleccione un riesgo, la aplicación debe buscar y mostrar la lista de chequeo que le corresponda según:

```text
D:\ejemplo\tesis\nd.xls
```

La relación debe ser:

```text
Proceso → Actividad → Riesgo → Lista de chequeo
```

Cuando existan varias listas posibles, el sistema debe:

- Mostrar todas las listas relacionadas.
- Explicar el criterio de selección.
- Permitir elegir una o varias.
- Evitar duplicar preguntas idénticas.

### Paso 5. Registro de respuestas

Cada pregunta debe permitir las siguientes opciones:

- **Sí cumple**
- **No cumple**
- **No aplica**
- **No verificado**, cuando no exista evidencia suficiente

Cada respuesta debe permitir:

- Comentario.
- Evidencia.
- Fotografía.
- Documento adjunto.
- Responsable.
- Fecha.
- Acción correctiva propuesta.

### Paso 6. Cálculo del nivel de deficiencia

El nivel de deficiencia debe calcularse automáticamente con base en:

- Las respuestas registradas.
- Los puntajes definidos en `nd.xls`.
- Las ponderaciones definidas en `nd.xls`.
- Los criterios establecidos en la NTP 330.
- Las reglas específicas de cada lista de chequeo.

La aplicación debe mostrar:

- Número total de preguntas.
- Número de preguntas aplicables.
- Número de respuestas “Sí”.
- Número de respuestas “No”.
- Número de respuestas “No aplica”.
- Número de respuestas “No verificadas”.
- Puntaje obtenido.
- Puntaje máximo aplicable.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- Nivel de deficiencia resultante.
- Explicación del resultado.

Las respuestas “No aplica” no deben afectar el puntaje máximo, salvo que el archivo Excel indique expresamente otra regla.

Las respuestas “No verificadas” deben quedar pendientes y no deben considerarse automáticamente como cumplimiento. El tratamiento matemático debe definirse según la metodología de la investigación.

---

## 9. Variables de la NTP 330

La aplicación debe administrar las siguientes variables.

### 9.1 Nivel de deficiencia — ND

Representa la magnitud de la relación esperable entre:

- El conjunto de factores de riesgo considerados.
- Su relación causal directa con el posible accidente.
- La eficacia de las medidas preventivas existentes.

El ND debe obtenerse preferentemente de la lista de chequeo.

El sistema debe almacenar:

- Código.
- Nombre.
- Valor numérico.
- Descripción.
- Rango.
- Fuente.
- Justificación.
- Lista de chequeo utilizada.

No se debe permitir modificar manualmente el ND calculado sin:

- Justificación escrita.
- Identificación del usuario.
- Fecha.
- Registro del valor original.
- Registro del valor modificado.

### 9.2 Nivel de exposición — NE

El usuario debe seleccionar o registrar la frecuencia y duración de exposición al riesgo.

La aplicación debe mostrar las categorías definidas en la NTP 330 y en los archivos de la carpeta `ER`.

El NE debe considerar, cuando corresponda:

- Exposición continua.
- Exposición frecuente.
- Exposición ocasional.
- Exposición esporádica.
- Duración de la jornada.
- Número de veces por jornada.
- Número de trabajadores expuestos.
- Tiempo de permanencia.
- Frecuencia semanal o mensual.

Debe existir un campo de justificación obligatoria.

### 9.3 Nivel de probabilidad — NP

Debe calcularse automáticamente mediante la relación definida por la NTP 330:

```text
NP = ND × NE
```

La aplicación debe:

- Mostrar el valor numérico.
- Identificar el rango.
- Asignar la categoría correspondiente.
- Mostrar la interpretación.
- Indicar los valores de ND y NE usados.

No permitir edición manual directa del NP.

### 9.4 Nivel de consecuencia — NC

El usuario debe seleccionar la consecuencia potencial más razonable, considerando:

- Daños personales.
- Severidad de las lesiones.
- Posible número de personas afectadas.
- Daños materiales, cuando sean pertinentes.
- Interrupción de la actividad.
- Impacto operacional.
- Impacto legal.

La selección debe seguir los niveles establecidos en la NTP 330 y en los documentos de la carpeta `ER`.

Debe incluir:

- Valor.
- Categoría.
- Descripción.
- Justificación.
- Evidencia.

### 9.5 Nivel de riesgo — NR

Debe calcularse automáticamente mediante:

```text
NR = NP × NC
```

También debe mostrarse como:

```text
NR = ND × NE × NC
```

La aplicación debe mostrar:

- Valor numérico de ND.
- Valor numérico de NE.
- Valor numérico de NP.
- Valor numérico de NC.
- Valor numérico de NR.
- Categoría del riesgo.
- Nivel de intervención.
- Significado.
- Prioridad de actuación.
- Aceptabilidad, cuando corresponda.

---

## 10. Controles de ingeniería

La aplicación debe dar especial importancia a los controles de ingeniería debido al objeto de la tesis.

Para cada riesgo se debe registrar:

### 10.1 Controles existentes

- Eliminación.
- Sustitución.
- Aislamiento.
- Encapsulamiento.
- Guardas.
- Barreras.
- Ventilación.
- Extracción localizada.
- Automatización.
- Mecanización.
- Sistemas de enclavamiento.
- Sistemas de detección.
- Sistemas de alarma.
- Protecciones colectivas.
- Rediseño del proceso.
- Modificación de equipos.
- Cambios físicos en el entorno.
- Otros controles técnicos.

### 10.2 Evaluación de eficacia

Cada control existente debe calificarse según:

- Existencia.
- Estado.
- Cobertura.
- Adecuación.
- Mantenimiento.
- Uso real.
- Evidencia.
- Eficacia.
- Cumplimiento normativo.

### 10.3 Controles propuestos

La aplicación debe permitir registrar:

- Control de ingeniería propuesto.
- Riesgo que controla.
- Objetivo.
- Descripción técnica.
- Responsable.
- Costo estimado.
- Plazo.
- Prioridad.
- Estado de implementación.
- Evidencia de implementación.
- Riesgo residual esperado.

### 10.4 Evaluación residual

Después de implementar un control, debe realizarse una nueva evaluación:

```text
ND residual
NE residual
NP residual
NC residual
NR residual
```

La aplicación debe comparar:

```text
Riesgo inicial vs. riesgo residual
```

y calcular:

- Reducción absoluta.
- Reducción porcentual.
- Cambio de categoría.
- Cambio de nivel de intervención.
- Eficacia estimada del control.

---

## 11. Reglas para las listas de chequeo

Cada lista debe contener como mínimo:

- Código de lista.
- Nombre.
- Riesgo asociado.
- Proceso asociado.
- Actividad asociada.
- Fuente documental.
- Versión.
- Fecha de vigencia.
- Preguntas.
- Tipo de respuesta.
- Puntaje por respuesta.
- Peso.
- Criterio de aplicabilidad.
- Fórmula.
- Rango de clasificación.
- Observaciones.

Cada pregunta debe contener:

- Código único.
- Texto completo.
- Tipo de riesgo.
- Requisito técnico.
- Fuente normativa.
- Peso.
- Puntaje.
- Evidencia requerida.
- Estado.
- Observación.

---

## 12. Importación de información

La aplicación debe permitir importar:

- `.xls`
- `.xlsx`
- `.csv`
- `.doc`
- `.docx`
- `.pdf`

La importación debe incluir un proceso de revisión previa:

1. Mostrar una vista previa.
2. Detectar encabezados.
3. Identificar columnas.
4. Permitir relacionar columnas del archivo con campos de la aplicación.
5. Detectar duplicados.
6. Detectar registros incompletos.
7. Validar tipos de datos.
8. Generar un reporte de errores.
9. Confirmar antes de guardar.

No se debe depender exclusivamente de OCR para documentos Word o PDF cuando exista texto digital accesible.

---

## 13. Matriz de trazabilidad

Debe existir una matriz de trazabilidad que relacione:

| Elemento | Fuente |
|---|---|
| Proceso constructivo | `procesos.doc` |
| Riesgo | Catálogo de riesgos y documentos de investigación |
| Lista de chequeo | `nd.xls` |
| Pregunta | `nd.xls` |
| Puntaje | `nd.xls` |
| Nivel de deficiencia | `nd.xls` y NTP 330 |
| Nivel de exposición | NTP 330 y carpeta `ER` |
| Nivel de probabilidad | NTP 330 |
| Nivel de consecuencia | NTP 330 y carpeta `ER` |
| Nivel de riesgo | NTP 330 |
| Nivel de intervención | NTP 330 |
| Control de ingeniería | Propuesta metodológica de la tesis |
| Norma ecuatoriana relacionada | Base normativa de la investigación |

Cada cálculo debe poder rastrearse hasta el dato de origen.

---

## 14. Normativa ecuatoriana

La aplicación debe permitir relacionar cada riesgo, pregunta y control con la normativa ecuatoriana vigente aplicable entre 2024 y 2026.

El sistema debe permitir registrar:

- Nombre de la norma.
- Número.
- Institución emisora.
- Fecha.
- Artículo.
- Numeral.
- Requisito.
- Estado de vigencia.
- Enlace o archivo.
- Observación.

La base normativa debe mantenerse editable para incorporar cambios.

No se debe afirmar que una norma está vigente sin verificarla previamente.

---

## 15. Diseño de la interfaz

La interfaz debe ser:

- Profesional.
- Académica.
- Técnica.
- Responsive.
- Accesible.
- Intuitiva.
- Compatible con computadoras y tabletas.

### 15.1 Menú principal

Debe incluir:

1. Inicio.
2. Proyectos.
3. Procesos constructivos.
4. Identificación de riesgos.
5. Listas de chequeo.
6. Evaluación NTP 330.
7. Controles de ingeniería.
8. Evaluación residual.
9. Resultados.
10. Reportes.
11. Catálogos.
12. Normativa.
13. Usuarios.
14. Auditoría.
15. Configuración.

### 15.2 Tablero principal

Debe mostrar:

- Total de proyectos.
- Total de procesos evaluados.
- Total de riesgos identificados.
- Riesgos por nivel.
- Riesgos críticos.
- Riesgos sin tratamiento.
- Controles pendientes.
- Controles implementados.
- Cumplimiento promedio de listas.
- Distribución de ND.
- Distribución de NE.
- Distribución de NP.
- Distribución de NC.
- Distribución de NR.
- Riesgo inicial vs. residual.

---

## 16. Visualizaciones

Incluir como mínimo:

- Gráfico de barras por nivel de riesgo.
- Matriz de calor.
- Distribución por proceso.
- Distribución por tipo de peligro.
- Gráfico de cumplimiento.
- Gráfico de incumplimiento.
- Comparación de riesgo inicial y residual.
- Ranking de riesgos.
- Ranking de procesos críticos.
- Ranking de preguntas con mayor incumplimiento.
- Estado de implementación de controles.

Los gráficos deben permitir filtros por:

- Proyecto.
- Fecha.
- Proceso.
- Actividad.
- Riesgo.
- Evaluador.
- Nivel de riesgo.
- Estado del control.

---

## 17. Reportes

La aplicación debe generar:

### 17.1 Reporte individual de evaluación

Debe incluir:

- Datos del proyecto.
- Proceso.
- Actividad.
- Tarea.
- Peligro.
- Riesgo.
- Lista de chequeo.
- Respuestas.
- Evidencias.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Controles existentes.
- Controles propuestos.
- Responsable.
- Plazo.
- Observaciones.
- Firma o identificación del evaluador.

### 17.2 Matriz general de riesgos

Debe incluir todas las evaluaciones y permitir exportar a:

- Excel.
- CSV.
- PDF.

### 17.3 Reporte de incumplimientos

Debe mostrar:

- Preguntas con respuesta “No”.
- Riesgo asociado.
- Proceso.
- Acción requerida.
- Responsable.
- Fecha límite.
- Estado.

### 17.4 Reporte de controles de ingeniería

Debe mostrar:

- Riesgo.
- Control.
- Prioridad.
- Costo.
- Responsable.
- Estado.
- Fecha.
- Eficacia.
- Riesgo residual.

### 17.5 Reporte metodológico

Debe explicar:

- Fórmulas utilizadas.
- Valores asignados.
- Fuente.
- Criterios.
- Adaptaciones.
- Versiones de los archivos usados.

---

## 18. Modelo de datos mínimo

Crear las siguientes entidades:

```text
Usuario
Rol
Proyecto
Obra
FrenteTrabajo
EtapaConstructiva
Proceso
Subproceso
Actividad
Tarea
Peligro
Riesgo
RelacionProcesoRiesgo
ListaChequeo
PreguntaChequeo
OpcionRespuesta
Evaluacion
Respuesta
Evidencia
NivelDeficiencia
NivelExposicion
NivelProbabilidad
NivelConsecuencia
NivelRiesgo
NivelIntervencion
ControlExistente
ControlPropuesto
EvaluacionResidual
Norma
RequisitoNormativo
Responsable
PlanAccion
Auditoria
VersionMetodologia
```

Todas las tablas deben incluir, cuando sea pertinente:

- Identificador único.
- Fecha de creación.
- Fecha de modificación.
- Usuario creador.
- Usuario modificador.
- Estado activo o inactivo.
- Versión.
- Fuente.

---

## 19. Perfiles de usuario

Crear al menos los siguientes roles:

### Administrador

- Configura el sistema.
- Administra usuarios.
- Administra catálogos.
- Importa archivos.
- Modifica escalas.
- Consulta auditoría.

### Investigador

- Crea proyectos.
- Ejecuta evaluaciones.
- Revisa resultados.
- Genera reportes.
- Analiza datos.

### Evaluador

- Registra procesos.
- Responde listas.
- Registra evidencias.
- Propone controles.

### Revisor

- Revisa evaluaciones.
- Aprueba o devuelve registros.
- Registra observaciones.

### Consulta

- Solo visualiza información autorizada.

---

## 20. Auditoría

Registrar obligatoriamente:

- Inicio de sesión.
- Creación.
- Edición.
- Eliminación lógica.
- Importación.
- Exportación.
- Cambio de respuesta.
- Modificación manual de valores.
- Aprobación.
- Rechazo.
- Cambio de metodología.
- Cambio de versión de lista.

No eliminar físicamente evaluaciones aprobadas.

---

## 21. Validaciones

La aplicación debe impedir:

- Calcular NP sin ND y NE.
- Calcular NR sin NP y NC.
- Aprobar una evaluación con preguntas obligatorias sin responder.
- Modificar una evaluación aprobada sin generar una nueva versión.
- Utilizar una lista inactiva.
- Utilizar una fórmula no validada.
- Guardar controles sin responsable cuando sean obligatorios.
- Cerrar una acción sin evidencia.
- Modificar manualmente un resultado sin justificación.

---

## 22. Pruebas obligatorias

### 22.1 Pruebas de cálculo

Crear casos de prueba para comprobar:

```text
ND
NE
NP = ND × NE
NC
NR = NP × NC
Nivel de intervención
```

### 22.2 Comparación con Excel

Seleccionar ejemplos completos de `nd.xls` y verificar que:

```text
Resultado web = Resultado Excel
```

La diferencia permitida debe ser cero, salvo redondeos documentados.

### 22.3 Pruebas de respuestas

Validar:

- Todas “Sí”.
- Todas “No”.
- Combinación de “Sí” y “No”.
- Existencia de “No aplica”.
- Existencia de “No verificado”.
- Lista incompleta.
- Lista sin preguntas aplicables.
- Cambio de ponderaciones.

### 22.4 Pruebas de trazabilidad

Verificar que cada resultado permita identificar:

- Pregunta.
- Respuesta.
- Puntaje.
- Fórmula.
- Fuente.
- Usuario.
- Fecha.

---

## 23. Requerimientos técnicos recomendados

Se puede utilizar una arquitectura moderna como:

### Frontend

- React.
- Next.js.
- TypeScript.
- Tailwind CSS.
- Componentes accesibles.
- Gráficos interactivos.

### Backend

- Python con FastAPI, o Node.js con NestJS.
- API REST.
- Validación de datos.
- Documentación automática de endpoints.

### Base de datos

- PostgreSQL.

### Procesamiento de archivos

- Python.
- `pandas`.
- `openpyxl`.
- Librerías para lectura de Word y PDF.
- Validación manual posterior a la importación.

### Exportación

- Excel.
- CSV.
- PDF.

### Seguridad

- Autenticación.
- Autorización por roles.
- Contraseñas cifradas.
- Copias de seguridad.
- Registro de auditoría.
- Protección de datos.
- Sesiones seguras.

La selección final de tecnologías puede cambiar, pero debe mantenerse la separación entre interfaz, lógica de negocio, base de datos y cálculos metodológicos.

---

## 24. Reglas de programación

1. No codificar valores metodológicos directamente en múltiples componentes.
2. Centralizar escalas, valores y fórmulas.
3. Permitir versionar la metodología.
4. Mantener separada la lógica de cálculo de la interfaz.
5. Crear pruebas unitarias.
6. Documentar cada función de cálculo.
7. Usar nombres claros.
8. Evitar cálculos únicamente en el navegador.
9. Recalcular resultados en el servidor.
10. Guardar los datos originales y los resultados calculados.
11. No sobrescribir resultados históricos.
12. Registrar la versión de metodología usada en cada evaluación.

---

## 25. Versionamiento metodológico

Cada evaluación debe guardar:

- Versión de la NTP 330 utilizada.
- Versión del archivo `nd.xls`.
- Fecha de importación.
- Versión de los catálogos.
- Fórmula aplicada.
- Usuario responsable.
- Fecha de cálculo.

Si se cambia una fórmula, las evaluaciones anteriores deben conservar su resultado original.

---

## 26. Criterios de aceptación

La aplicación se considerará funcional cuando:

1. Importe los procesos del archivo `procesos.doc`.
2. Importe las listas y preguntas del archivo `nd.xls`.
3. Relacione procesos, actividades, riesgos y listas.
4. Permita responder Sí, No, No aplica y No verificado.
5. Calcule correctamente el ND.
6. Permita seleccionar y justificar el NE.
7. Calcule correctamente el NP.
8. Permita seleccionar y justificar el NC.
9. Calcule correctamente el NR.
10. Determine el nivel de intervención.
11. Registre controles de ingeniería.
12. Calcule el riesgo residual.
13. Genere reportes.
14. Exporte información.
15. Mantenga trazabilidad.
16. Registre auditoría.
17. Reproduzca los resultados del Excel.
18. Permita revisar y aprobar evaluaciones.
19. Mantenga histórico de versiones.
20. Muestre un tablero interactivo.

---

## 27. Resultado esperado

Entregar:

1. Código fuente completo.
2. Base de datos.
3. Script de creación de tablas.
4. Módulo de importación.
5. Motor de cálculo.
6. Interfaz web.
7. Panel administrativo.
8. Módulo de reportes.
9. Pruebas.
10. Manual técnico.
11. Manual de usuario.
12. Matriz de trazabilidad.
13. Diccionario de datos.
14. Documentación de fórmulas.
15. Registro de adaptaciones metodológicas.

---

## 28. Instrucción final para el desarrollo

Construye la aplicación por fases.

### Fase 1. Análisis documental

- Leer los archivos.
- Extraer procesos.
- Extraer riesgos.
- Extraer listas.
- Extraer fórmulas.
- Crear matriz de trazabilidad.

### Fase 2. Modelo de datos

- Diseñar entidades.
- Diseñar relaciones.
- Crear base de datos.
- Crear catálogos.

### Fase 3. Motor de cálculo

- Implementar ND.
- Implementar NE.
- Implementar NP.
- Implementar NC.
- Implementar NR.
- Implementar nivel de intervención.
- Crear pruebas comparativas.

### Fase 4. Interfaz

- Crear formularios.
- Crear listas de chequeo.
- Crear flujo de evaluación.
- Crear panel de resultados.

### Fase 5. Controles de ingeniería

- Registrar controles.
- Crear plan de acción.
- Evaluar riesgo residual.

### Fase 6. Reportes y análisis

- Crear gráficos.
- Crear filtros.
- Crear exportaciones.
- Crear reportes metodológicos.

### Fase 7. Validación

- Comparar con Excel.
- Revisar cálculos.
- Revisar trazabilidad.
- Corregir inconsistencias.
- Documentar resultados.

No iniciar la implementación definitiva de las fórmulas hasta haber leído y validado el contenido de:

```text
D:\ejemplo\tesis\330.pdf
D:\ejemplo\tesis\ER
D:\ejemplo\tesis\procesos.doc
D:\ejemplo\tesis\nd.xls
```

El sistema debe reflejar fielmente la metodología usada en la investigación doctoral y permitir demostrar cómo se obtiene cada resultado.
