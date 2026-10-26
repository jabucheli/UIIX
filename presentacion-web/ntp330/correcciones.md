# Solicitud de correcciones para la aplicación web de evaluación de riesgos basada en la NTP 330

## 1. Objetivo de la corrección

Corregir la aplicación web previamente generada para que el flujo de identificación, evaluación y priorización de riesgos laborales se ajuste a la metodología NTP 330 y a la información contenida en los archivos de la investigación doctoral.

La aplicación debe permitir seleccionar el tipo de proyecto, identificar sus procesos constructivos, generar automáticamente los riesgos relacionados, aplicar una lista de chequeo específica para cada riesgo y calcular los niveles de deficiencia, exposición, probabilidad, consecuencia y riesgo.

---

## 2. Archivos de referencia obligatorios

La corrección debe realizarse utilizando los siguientes archivos:

### Metodología NTP 330

```text
D:\ejemplo\tesis\330.pdf
```

### Listas de chequeo para calcular el nivel de deficiencia

```text
D:\ejemplo\tesis\nd.xls
```

### Información complementaria de evaluación de riesgos

```text
D:\ejemplo\tesis\ER
```

### Procesos constructivos identificados

```text
D:\ejemplo\tesis\procesos.doc
```

Antes de modificar fórmulas, valores, escalas o clasificaciones, se debe revisar el contenido de estos archivos.

---

## 3. Flujo obligatorio de la aplicación

La aplicación debe seguir el siguiente orden:

```text
Tipo de proyecto
        ↓
Proceso constructivo
        ↓
Actividad o tarea
        ↓
Riesgos asociados
        ↓
Confirmación o adición de riesgos
        ↓
Lista de chequeo por cada riesgo
        ↓
Nivel de deficiencia
        ↓
Nivel de exposición
        ↓
Nivel de probabilidad
        ↓
Nivel de consecuencia
        ↓
Nivel de riesgo
        ↓
Nivel de intervención
```

Cada riesgo debe ser evaluado de manera independiente.

---

## 4. Selección del tipo de proyecto

El primer paso debe permitir seleccionar el tipo de proyecto.

El catálogo inicial podrá incluir:

- Edificación.
- Infraestructura vial.
- Puentes.
- Obras hidráulicas.
- Obras sanitarias.
- Obras eléctricas.
- Obras industriales.
- Urbanizaciones.
- Movimiento de tierras.
- Mantenimiento.
- Rehabilitación.
- Demolición.
- Otro.

El administrador debe poder agregar, editar, activar o desactivar tipos de proyecto.

La selección del tipo de proyecto debe filtrar automáticamente los procesos constructivos relacionados.

---

## 5. Selección del proceso constructivo

Después de elegir el tipo de proyecto, el usuario debe seleccionar:

- Proceso constructivo.
- Subproceso.
- Actividad.
- Tarea.

Los procesos iniciales deben obtenerse de:

```text
D:\ejemplo\tesis\procesos.doc
```

Ejemplo:

```text
Tipo de proyecto: Edificación
Proceso: Movimiento de tierras
Actividad: Excavación
Tarea: Excavación mecánica
```

El sistema debe permitir agregar nuevos procesos, actividades y tareas sin modificar el código fuente.

---

## 6. Generación automática de riesgos

Una vez seleccionados el tipo de proyecto, el proceso, la actividad y la tarea, la aplicación debe generar automáticamente los riesgos asociados.

La relación debe funcionar de la siguiente manera:

```text
Tipo de proyecto
+ Proceso constructivo
+ Actividad
+ Tarea
= Riesgos previsibles
```

Para cada riesgo generado se debe mostrar:

- Nombre del riesgo.
- Tipo de peligro.
- Descripción.
- Fuente generadora.
- Posibles consecuencias.
- Lista de chequeo asociada.
- Estado de evaluación.

El usuario debe poder:

- Confirmar que el riesgo está presente.
- Desmarcar riesgos que no correspondan.
- Agregar otros riesgos.
- Justificar la inclusión de un riesgo adicional.
- Relacionar un riesgo nuevo con una lista de chequeo existente.
- Crear una nueva lista de chequeo si no existe una adecuada.

---

## 7. Evaluación independiente por riesgo

Cada riesgo debe generar una evaluación individual.

La aplicación no debe calcular un único nivel de deficiencia para todo el proceso.

Cada combinación debe conservarse de forma independiente:

```text
Proyecto
+ Tipo de proyecto
+ Proceso
+ Actividad
+ Tarea
+ Riesgo
```

Cada riesgo debe tener:

- Su propia lista de chequeo.
- Su propio nivel de deficiencia.
- Su propio nivel de exposición.
- Su propio nivel de probabilidad.
- Su propio nivel de consecuencia.
- Su propio nivel de riesgo.
- Su propio nivel de intervención.
- Sus propios controles preventivos.

---

## 8. Despliegue automático de listas de chequeo

Al confirmar los riesgos presentes, el sistema debe desplegar automáticamente la lista de chequeo que corresponda a cada riesgo.

Las listas deben obtenerse de:

```text
D:\ejemplo\tesis\nd.xls
```

La relación debe ser:

```text
Riesgo
→ Lista de chequeo
→ Preguntas
→ Respuestas
→ Puntajes
→ Nivel de deficiencia
```

Cada lista debe mostrar:

- Código de la lista.
- Nombre.
- Riesgo asociado.
- Número de preguntas.
- Fuente.
- Versión.
- Fecha de vigencia.

Cuando existan varias listas relacionadas con un mismo riesgo, el sistema debe:

- Mostrar las listas disponibles.
- Permitir seleccionar una o varias.
- Explicar el criterio de selección.
- Evitar preguntas duplicadas.

---

## 9. Opciones de respuesta

Cada pregunta de la lista de chequeo debe permitir:

- **Sí**
- **No**
- **No aplica**
- **No verificado**

### Interpretación

#### Sí

La condición evaluada cumple.

#### No

La condición evaluada no cumple y debe aumentar el nivel de deficiencia.

#### No aplica

La pregunta no corresponde al riesgo, actividad o proceso evaluado.

No debe aumentar el nivel de deficiencia, salvo que el archivo `nd.xls` establezca expresamente otra regla.

#### No verificado

No existe evidencia suficiente para establecer el cumplimiento.

Debe quedar pendiente y no debe considerarse automáticamente como cumplimiento.

---

## 10. Corrección del nivel de deficiencia

El nivel de deficiencia debe expresarse en una escala de:

```text
ND mínimo = 1
ND máximo = 10
```

La determinación del ND debe realizarse mediante la lista de chequeo correspondiente a cada riesgo.

Cada vez que se marque una respuesta:

```text
No
```

el nivel de deficiencia debe aumentar, hasta alcanzar como máximo:

```text
ND = 10
```

La aplicación debe aplicar los puntajes, pesos, fórmulas y rangos establecidos en:

```text
D:\ejemplo\tesis\nd.xls
```

### Regla principal

```text
A mayor cantidad o importancia de respuestas “No”,
mayor debe ser el nivel de deficiencia.
```

### Límite máximo

```text
Si ND calculado > 10:
ND final = 10
```

### Límite mínimo

```text
Si no existen incumplimientos:
ND final = valor mínimo establecido en nd.xls
```

En la interfaz, el ND debe mostrarse siempre dentro del rango de 1 a 10.

No se debe asumir automáticamente que cada respuesta “No” equivale a un punto. El incremento puede depender de:

- Peso de la pregunta.
- Criticidad.
- Puntaje.
- Porcentaje de incumplimiento.
- Fórmula específica.
- Regla definida en el archivo Excel.

---

## 11. Información visible del cálculo de ND

Para cada riesgo, la aplicación debe mostrar:

- Total de preguntas.
- Preguntas aplicables.
- Respuestas “Sí”.
- Respuestas “No”.
- Respuestas “No aplica”.
- Respuestas “No verificadas”.
- Puntaje obtenido.
- Puntaje máximo aplicable.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- Nivel de deficiencia calculado.
- Fórmula aplicada.
- Explicación del resultado.
- Archivo, hoja y referencia de origen, cuando sea posible.

---

## 12. Nivel de exposición en paralelo

Mientras se responde la lista de chequeo, la aplicación debe solicitar paralelamente el nivel de exposición.

El usuario debe seleccionar el NE de acuerdo con la metodología NTP 330.

Se debe considerar:

- Frecuencia de exposición.
- Duración.
- Número de veces por jornada.
- Número de trabajadores expuestos.
- Tiempo de permanencia.
- Exposición diaria, semanal o mensual.
- Condición habitual, ocasional o eventual.

La aplicación debe mostrar los valores y descripciones definidos en la NTP 330 y en los archivos de la carpeta:

```text
D:\ejemplo\tesis\ER
```

El usuario debe registrar:

- Nivel de exposición.
- Valor numérico.
- Frecuencia.
- Duración.
- Número de trabajadores expuestos.
- Justificación.
- Observaciones.

---

## 13. Cálculo automático del nivel de probabilidad

Cuando se disponga del ND y del NE, el sistema debe calcular automáticamente:

```text
NP = ND × NE
```

Donde:

```text
NP = Nivel de probabilidad
ND = Nivel de deficiencia
NE = Nivel de exposición
```

La aplicación debe mostrar:

- ND utilizado.
- NE utilizado.
- Operación matemática.
- Resultado de NP.
- Rango.
- Categoría.
- Interpretación según NTP 330.

Ejemplo:

```text
ND = 6
NE = 3

NP = ND × NE
NP = 6 × 3
NP = 18
```

El NP no debe poder editarse manualmente.

Si se modifica una respuesta de la lista o el NE, el NP debe recalcularse inmediatamente.

---

## 14. Selección del nivel de consecuencia

Después de calcular el NP, el sistema debe solicitar el nivel de consecuencia.

El NC debe seleccionarse conforme a la NTP 330 y a los documentos de la carpeta `ER`.

La selección debe considerar:

- Gravedad de la lesión.
- Posible incapacidad.
- Posible fallecimiento.
- Número de personas afectadas.
- Daños materiales.
- Interrupción de actividades.
- Impacto operativo.
- Impacto legal.

La aplicación debe mostrar:

- Categoría.
- Valor numérico.
- Descripción.
- Ejemplos.
- Justificación obligatoria.

---

## 15. Cálculo automático del nivel de riesgo

Cuando estén disponibles NP y NC, el sistema debe calcular:

```text
NR = NP × NC
```

También debe mostrar la expresión completa:

```text
NR = ND × NE × NC
```

Donde:

```text
NR = Nivel de riesgo
NP = Nivel de probabilidad
NC = Nivel de consecuencia
```

Ejemplo:

```text
ND = 6
NE = 3
NP = 18
NC = 25

NR = NP × NC
NR = 18 × 25
NR = 450
```

La aplicación debe mostrar:

- ND.
- NE.
- NP.
- NC.
- NR.
- Clasificación del riesgo.
- Nivel de intervención.
- Interpretación.
- Prioridad de actuación.
- Aceptabilidad, cuando corresponda.

---

## 16. Recálculo automático

Los resultados deben actualizarse inmediatamente cuando cambie:

- Una respuesta de la lista.
- La aplicabilidad de una pregunta.
- El nivel de exposición.
- El nivel de consecuencia.
- La lista de chequeo.
- El riesgo seleccionado.

La secuencia automática debe ser:

```text
Cambio de respuesta
        ↓
Nuevo ND
        ↓
Nuevo NP
        ↓
Nuevo NR
        ↓
Nuevo nivel de intervención
```

No debe ser necesario ejecutar manualmente cada cálculo.

---

## 17. Vista individual por riesgo

Cada riesgo debe mostrarse en una sección independiente con:

1. Identificación del riesgo.
2. Lista de chequeo.
3. Resultado de ND.
4. Selección de NE.
5. Resultado de NP.
6. Selección de NC.
7. Resultado de NR.
8. Nivel de intervención.
9. Controles existentes.
10. Controles propuestos.

El estado debe indicar:

- Pendiente.
- Lista incompleta.
- ND calculado.
- NE pendiente.
- NP calculado.
- NC pendiente.
- NR calculado.
- Evaluación completa.
- Evaluación aprobada.

---

## 18. Resumen por proceso constructivo

Después de evaluar los riesgos, se debe mostrar una tabla:

| Riesgo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|---|---:|---:|---:|---:|---:|---|---|

La tabla debe permitir:

- Ordenar por NR.
- Filtrar por riesgo.
- Filtrar por nivel de intervención.
- Identificar registros incompletos.
- Abrir la lista de chequeo.
- Editar la evaluación.
- Exportar resultados.

---

## 19. Adición de otros riesgos

El usuario debe poder agregar riesgos que no hayan sido generados automáticamente.

Debe registrar:

- Nombre.
- Tipo de peligro.
- Descripción.
- Fuente generadora.
- Posibles consecuencias.
- Proceso.
- Actividad.
- Tarea.
- Lista de chequeo.
- Justificación.

Si no existe una lista adecuada, el sistema debe permitir:

- Crear una nueva.
- Copiar una lista similar.
- Importar una lista desde Excel.
- Dejar el riesgo pendiente de configuración.

No debe calcularse ND sin una lista validada.

---

## 20. Reglas de validación

La aplicación debe impedir:

- Calcular ND sin lista de chequeo.
- Calcular NP sin ND y NE.
- Calcular NR sin NP y NC.
- Cerrar una lista con preguntas obligatorias pendientes.
- Superar ND = 10.
- Mostrar ND menor que 1.
- Editar manualmente NP.
- Editar manualmente NR.
- Usar listas inactivas.
- Aprobar evaluaciones con respuestas “No verificadas”.
- Cambiar fórmulas sin crear una nueva versión metodológica.

---

## 21. Trazabilidad

Cada evaluación debe conservar:

- Tipo de proyecto.
- Proyecto.
- Proceso.
- Subproceso.
- Actividad.
- Tarea.
- Riesgo.
- Lista.
- Preguntas.
- Respuestas.
- Puntajes.
- Ponderaciones.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Usuario.
- Fecha.
- Versión metodológica.
- Fuente.
- Fórmula aplicada.

Cada resultado debe poder explicarse desde la respuesta original hasta el valor final.

---

## 22. Validación contra el archivo Excel

Antes de aprobar el módulo, se deben comparar varios casos con:

```text
D:\ejemplo\tesis\nd.xls
```

Se debe comprobar:

```text
Respuestas web = Respuestas Excel
ND web = ND Excel
```

La diferencia debe ser cero, salvo redondeos documentados.

Se deben probar:

- Cero respuestas “No”.
- Una respuesta “No”.
- Varias respuestas “No”.
- Todas las respuestas “No”.
- Preguntas con diferentes pesos.
- Preguntas “No aplica”.
- Preguntas “No verificadas”.
- Resultado máximo ND = 10.

---

## 23. Pruebas de cálculo

Crear pruebas automáticas para:

```text
1 ≤ ND ≤ 10
NP = ND × NE
NR = NP × NC
NR = ND × NE × NC
```

También deben probarse:

- Cambio de una respuesta.
- Cambio de NE.
- Cambio de NC.
- Cambio de lista.
- Adición de un nuevo riesgo.
- Eliminación de un riesgo no presente.
- Evaluación simultánea de varios riesgos.

---

## 24. Corrección de la interfaz

La pantalla principal debe dividirse en:

### Zona 1. Identificación

- Tipo de proyecto.
- Proyecto.
- Proceso.
- Actividad.
- Tarea.
- Fecha.
- Evaluador.

### Zona 2. Riesgos generados

- Riesgos automáticos.
- Confirmación de presencia.
- Opción para agregar riesgos.
- Estado.
- Lista asociada.

### Zona 3. Evaluación

Para cada riesgo:

- Lista de chequeo.
- Respuestas.
- ND calculado.
- NE.
- NP calculado.
- NC.
- NR calculado.
- Nivel de intervención.
- Controles.

---

## 25. Criterios de aceptación

La corrección estará completa cuando:

1. Se pueda seleccionar el tipo de proyecto.
2. Los procesos se filtren según el tipo de proyecto.
3. Los riesgos se generen automáticamente.
4. Se puedan agregar otros riesgos.
5. Cada riesgo despliegue su lista de chequeo.
6. Cada respuesta “No” aumente el ND conforme a `nd.xls`.
7. El ND permanezca entre 1 y 10.
8. Se pueda seleccionar el NE en paralelo.
9. Se calcule automáticamente `NP = ND × NE`.
10. Se pueda seleccionar el NC.
11. Se calcule automáticamente `NR = NP × NC`.
12. Se determine el nivel de intervención.
13. Los resultados se actualicen en tiempo real.
14. Cada riesgo se evalúe por separado.
15. Se mantenga la trazabilidad.
16. Los cálculos coincidan con Excel.
17. Las clasificaciones correspondan a la NTP 330.
18. No se utilicen valores inventados.

---

## 26. Instrucción final para el desarrollador

Corrige la aplicación existente. No construyas un flujo separado.

La versión corregida debe iniciar con la selección del tipo de proyecto, continuar con el proceso constructivo y generar automáticamente los riesgos asociados.

Para cada riesgo confirmado, debe desplegarse la lista de chequeo correspondiente.

Cada respuesta “No” debe incrementar el nivel de deficiencia conforme a las reglas de `nd.xls`, manteniendo el ND entre 1 y 10.

Paralelamente, el usuario debe seleccionar el nivel de exposición.

El sistema debe calcular automáticamente:

```text
NP = ND × NE
```

Posteriormente, debe solicitar el nivel de consecuencia y calcular:

```text
NR = NP × NC
```

Todos los valores, rangos, descripciones, categorías y niveles de intervención deben ajustarse a la metodología NTP 330 y verificarse contra:

```text
D:\ejemplo\tesis\330.pdf
D:\ejemplo\tesis\ER
D:\ejemplo\tesis\procesos.doc
D:\ejemplo\tesis\nd.xls
```

No considerar terminada la corrección hasta que los resultados de la aplicación coincidan con los resultados del archivo Excel y cada cálculo pueda rastrearse hasta su fuente.
