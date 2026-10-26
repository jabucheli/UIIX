# Solicitud de correcciones para reorganizar la pestaña “Evaluación” de la aplicación web NTP 330

## 1. Objetivo de la corrección

Corregir la estructura interna de la pestaña principal denominada **“Evaluación”**, sin eliminar ni modificar la programación ya desarrollada para calcular los niveles de deficiencia, exposición, probabilidad, consecuencia, riesgo e intervención conforme a la metodología NTP 330.

La corrección debe:

- Reordenar los numerales internos de la pestaña “Evaluación”.
- Convertir el apartado de resultados en una matriz principal consolidada.
- Mantener las subpestañas por cada riesgo asociado al proceso constructivo.
- Mantener la aplicación de listas de chequeo para determinar el ND.
- Incorporar la descarga de cada lista de chequeo en formato PDF.
- Alimentar automáticamente la matriz con los resultados obtenidos en cada riesgo.
- Conservar las fórmulas y reglas de cálculo ya implementadas.

---

## 2. Estructura definitiva de la pestaña “Evaluación”

La pestaña **“Evaluación”** debe quedar organizada de la siguiente manera:

```text
1. Identificación del proyecto

2. Matriz de evaluación de riesgos NTP 330

3. Evaluación por riesgo del proceso
   3.1 Determinación de los niveles de deficiencia ND:
       aplicación de listas de chequeo
   3.2 Determinación del nivel de exposición NE
   3.3 Cálculo del nivel de probabilidad NP
   3.4 Determinación del nivel de consecuencia NC
   3.5 Cálculo del nivel de riesgo NR
   3.6 Determinación del nivel de intervención
```

Se debe reemplazar la organización anterior:

```text
1. Identificación del proyecto
2. Evaluación por riesgo del proceso
3. Resultados de la evaluación (página principal)
```

por la nueva estructura indicada.

---

# 1. Identificación del proyecto

## 1.1 Mantener el numeral existente

El numeral 1 debe mantenerse con el título:

```text
1. Identificación del proyecto
```

No modificar su funcionalidad, salvo ajustes de orden visual.

Debe conservar como mínimo:

- Nombre del proyecto.
- Código del proyecto.
- Tipo de proyecto.
- Proceso constructivo.
- Ubicación.
- Empresa o contratista.
- Responsable de la evaluación.
- Cargo del evaluador.
- Fecha de evaluación.
- Frente de trabajo.
- Etapa de obra.
- Número de trabajadores expuestos.
- Observaciones generales.

## 1.2 Tipo de proyecto

Mantener únicamente las categorías generales:

```text
Estructura
Infraestructura
```

Una vez seleccionado el tipo de proyecto, deben desplegarse los procesos constructivos relacionados.

## 1.3 Proceso constructivo

El proceso seleccionado debe utilizarse para generar automáticamente:

- Los riesgos asociados.
- Las subpestañas de evaluación.
- Las listas de chequeo aplicables.
- Las filas iniciales de la matriz de evaluación de riesgos NTP 330.

---

# 2. Matriz de evaluación de riesgos NTP 330

## 2.1 Cambio de nombre y numeración

El apartado anteriormente denominado:

```text
3. Resultados de la evaluación (página principal)
```

debe pasar a ser:

```text
2. Matriz de evaluación de riesgos NTP 330
```

Este apartado debe funcionar como la matriz principal y consolidada de toda la evaluación.

No debe limitarse a mostrar resultados. Debe registrar, organizar y actualizar automáticamente los valores obtenidos en el numeral 3.

## 2.2 Ubicación

La matriz debe mostrarse inmediatamente después de “Identificación del proyecto” y antes de “Evaluación por riesgo del proceso”.

La secuencia debe ser:

```text
1. Identificación del proyecto
        ↓
2. Matriz de evaluación de riesgos NTP 330
        ↓
3. Evaluación por riesgo del proceso
```

## 2.3 Alimentación automática de la matriz

La matriz debe alimentarse automáticamente con los resultados obtenidos dentro de cada subpestaña de riesgo.

Cada riesgo evaluado debe generar o actualizar una fila.

No se debe solicitar al usuario volver a ingresar manualmente los valores calculados.

La relación debe ser:

```text
Subpestaña del riesgo
        ↓
Lista de chequeo
        ↓
ND calculado
        ↓
NE seleccionado
        ↓
NP calculado
        ↓
NC seleccionado
        ↓
NR calculado
        ↓
Nivel de intervención
        ↓
Actualización automática de la matriz
```

## 2.4 Columnas mínimas

La matriz debe incluir como mínimo:

| N.° | Tipo de proyecto | Proceso constructivo | Actividad o tarea | Peligro | Riesgo | Lista de chequeo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|---:|---|---|---|---|---|---|---:|---:|---:|---:|---:|---|---|

También puede incluir:

- Código del riesgo.
- Fuente generadora.
- Posibles consecuencias.
- Número de trabajadores expuestos.
- Controles existentes.
- Controles propuestos.
- Responsable.
- Fecha.
- Observaciones.
- Riesgo residual.
- Estado de implementación.

## 2.5 Actualización en tiempo real

La matriz debe actualizarse cuando cambie cualquiera de los siguientes datos:

- Una respuesta de la lista de chequeo.
- La aplicabilidad de una pregunta.
- El ND.
- El NE.
- El NP.
- El NC.
- El NR.
- El nivel de intervención.
- Un riesgo agregado o eliminado.
- El proceso constructivo seleccionado.

Cuando cambie una respuesta de la lista, la secuencia de actualización debe ser:

```text
Nuevo ND
↓
Nuevo NP
↓
Nuevo NR
↓
Nuevo nivel de intervención
↓
Actualización de la fila de la matriz
```

## 2.6 Estado de la evaluación

La columna “Estado” debe mostrar, según corresponda:

- Pendiente.
- Lista de chequeo sin iniciar.
- Lista de chequeo incompleta.
- ND calculado.
- NE pendiente.
- NP calculado.
- NC pendiente.
- NR calculado.
- Evaluación completa.
- Evaluación revisada.
- Evaluación aprobada.

## 2.7 Acciones desde la matriz

Cada fila debe permitir:

- Abrir la subpestaña del riesgo.
- Revisar la lista de chequeo.
- Editar la evaluación.
- Ver el detalle del cálculo.
- Descargar la lista de chequeo en PDF.
- Ver la trazabilidad.
- Exportar el resultado.
- Registrar controles.
- Revisar el nivel de intervención.

---

# 3. Evaluación por riesgo del proceso

## 3.1 Cambio de numeración

El apartado anteriormente identificado como:

```text
2. Evaluación por riesgo del proceso
```

debe pasar a ser:

```text
3. Evaluación por riesgo del proceso
```

Se debe mantener la funcionalidad ya desarrollada.

## 3.2 Subpestañas por riesgo

Dentro del numeral 3 deben mantenerse las subpestañas correspondientes a cada riesgo asociado al proceso constructivo seleccionado.

Ejemplo:

```text
[Caídas a distinto nivel]
[Caídas al mismo nivel]
[Contacto eléctrico]
[Golpes por objetos]
[Proyección de partículas]
[Ruido]
[Sobreesfuerzos]
```

Cada subpestaña debe corresponder a un solo riesgo.

No se deben mezclar varios riesgos en una misma subpestaña.

## 3.3 Generación de riesgos

Los riesgos deben generarse automáticamente según:

```text
Tipo de proyecto
+ Proceso constructivo
+ Actividad o tarea
= Riesgos asociados
```

El usuario debe poder:

- Seleccionar los riesgos presentes.
- Desactivar riesgos que no correspondan.
- Agregar riesgos adicionales.
- Justificar la inclusión de nuevos riesgos.
- Relacionar un riesgo adicional con una lista de chequeo.

## 3.4 Contenido de cada subpestaña

Cada subpestaña debe contener, en este orden:

```text
3.1 Determinación de los niveles de deficiencia ND:
    aplicación de listas de chequeo

3.2 Determinación del nivel de exposición NE

3.3 Cálculo del nivel de probabilidad NP

3.4 Determinación del nivel de consecuencia NC

3.5 Cálculo del nivel de riesgo NR

3.6 Determinación del nivel de intervención
```

---

# 3.1 Determinación de los niveles de deficiencia ND: aplicación de listas de chequeo

## 3.1.1 Título obligatorio

El primer apartado dentro de cada subpestaña debe denominarse:

```text
3.1 Determinación de los niveles de deficiencia ND:
aplicación de listas de chequeo
```

## 3.1.2 Forma de despliegue

Mantener la forma de despliegue previamente desarrollada.

La lista de chequeo debe mostrarse directamente dentro de la subpestaña del riesgo y conservar:

- Encabezado de identificación.
- Datos del proyecto.
- Datos del proceso.
- Identificación del riesgo.
- Identificación de la lista.
- Tabla de preguntas.
- Opciones de respuesta.
- Resultado del ND.
- Observaciones.
- Estado de avance.

## 3.1.3 Información de identificación

Antes de las preguntas se debe mostrar:

- Código de la lista.
- Nombre de la lista.
- Tipo de proyecto.
- Proceso constructivo.
- Actividad o tarea.
- Peligro.
- Riesgo evaluado.
- Nombre del proyecto.
- Ubicación.
- Evaluador.
- Fecha.
- Versión de la lista.
- Fuente de la lista.
- Número total de preguntas.
- Estado de la evaluación.

## 3.1.4 Opciones de respuesta

Mantener las opciones:

```text
Sí
No
No aplica
```

Cada pregunta debe permitir seleccionar una sola opción.

Ejemplo:

| N.° | Pregunta | Sí | No | No aplica | Observación |
|---:|---|:---:|:---:|:---:|---|
| 1 | ¿Existe protección colectiva? | ○ | ○ | ○ | |
| 2 | ¿El área se encuentra señalizada? | ○ | ○ | ○ | |
| 3 | ¿Los equipos se encuentran en buen estado? | ○ | ○ | ○ | |

La aplicación debe impedir:

- Seleccionar más de una respuesta por pregunta.
- Dejar preguntas obligatorias sin responder.
- Considerar “No aplica” como incumplimiento, salvo que la fórmula del archivo Excel establezca otra regla.

## 3.1.5 Cálculo del ND

El ND debe calcularse automáticamente a partir de las respuestas.

Las reglas deben obtenerse de:

```text
D:\ejemplo\tesis\nd.xls
```

Cada respuesta “No” debe incrementar el nivel de deficiencia conforme a:

- Puntaje.
- Peso.
- Criticidad.
- Porcentaje de incumplimiento.
- Fórmula definida.
- Rango establecido.

El resultado debe mantenerse dentro de la escala configurada:

```text
1 ≤ ND ≤ 10
```

No asumir que cada respuesta “No” equivale automáticamente a un punto, salvo que así esté definido en el archivo fuente.

## 3.1.6 Información visible del resultado

Mostrar:

- Total de preguntas.
- Preguntas respondidas.
- Respuestas “Sí”.
- Respuestas “No”.
- Respuestas “No aplica”.
- Puntaje obtenido.
- Puntaje máximo aplicable.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- ND calculado.
- Interpretación.
- Fórmula aplicada.
- Fuente del cálculo.

## 3.1.7 Descarga de la lista de chequeo en PDF

Al visualizar la lista, debe aparecer una opción visible:

```text
Descargar lista de chequeo en PDF
```

También puede utilizarse el texto:

```text
Exportar lista a PDF
```

El PDF debe contener toda la información de identificación y evaluación.

### Contenido mínimo del PDF

#### Encabezado

- Nombre de la aplicación.
- Nombre de la metodología.
- Título: “Lista de chequeo para determinación del nivel de deficiencia”.
- Logotipo institucional, cuando esté configurado.

#### Identificación del proyecto

- Nombre del proyecto.
- Código.
- Tipo de proyecto.
- Ubicación.
- Empresa.
- Evaluador.
- Fecha.

#### Identificación del proceso y riesgo

- Proceso constructivo.
- Actividad.
- Tarea.
- Peligro.
- Riesgo.
- Código del riesgo.

#### Identificación de la lista

- Código.
- Nombre.
- Versión.
- Fuente.
- Fecha de vigencia.
- Número de preguntas.

#### Respuestas

- Número de pregunta.
- Texto completo.
- Respuesta seleccionada.
- Puntaje.
- Observación.
- Evidencia registrada, cuando corresponda.

#### Resultado

- Respuestas “Sí”.
- Respuestas “No”.
- Respuestas “No aplica”.
- Puntaje obtenido.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- ND calculado.
- Interpretación.
- Fórmula aplicada.

#### Cierre

- Observaciones generales.
- Nombre del evaluador.
- Espacio para firma.
- Fecha de generación.
- Código o identificador de la evaluación.
- Versión metodológica utilizada.

## 3.1.8 Reglas para generar el PDF

El PDF debe:

- Generarse con la información guardada.
- Mantener una presentación profesional y legible.
- Incluir todas las preguntas.
- Evitar cortes incorrectos de filas.
- Numerar las páginas.
- Mostrar encabezado en cada página.
- Mostrar el identificador de la evaluación.
- Registrar la fecha y hora de generación.
- Reflejar exactamente las respuestas guardadas.
- Incluir el ND vigente al momento de la descarga.

Si la evaluación cambia posteriormente, una nueva descarga debe reflejar la información actualizada.

## 3.1.9 Alimentación de la matriz

Al guardar las respuestas de la lista:

1. Calcular el ND.
2. Guardar el resultado.
3. Actualizar el estado de la subpestaña.
4. Registrar el ND en el numeral 2.
5. Actualizar la fila correspondiente en la matriz.
6. Mantener la trazabilidad entre la matriz y la lista.

---

# 3.2 Determinación del nivel de exposición NE

Mantener la programación existente.

El NE debe seleccionarse mediante una lista desplegable basada en:

```text
D:\ejemplo\tesis\330.pdf
```

Cada opción debe mostrar:

- Categoría.
- Valor.
- Descripción.
- Frecuencia.
- Duración de exposición.

El NE seleccionado debe registrarse automáticamente en la matriz del numeral 2.

---

# 3.3 Cálculo del nivel de probabilidad NP

Mantener la fórmula:

```text
NP = ND × NE
```

El cálculo debe ser automático y de solo lectura.

Mostrar:

- ND.
- NE.
- Operación.
- NP.
- Categoría.
- Interpretación.

El NP calculado debe registrarse automáticamente en la matriz del numeral 2.

---

# 3.4 Determinación del nivel de consecuencia NC

Mantener la lista desplegable ya programada.

Los valores deben obtenerse de:

```text
D:\ejemplo\tesis\330.pdf
```

y de:

```text
D:\ejemplo\tesis\ER
```

El NC seleccionado debe registrarse automáticamente en la matriz.

---

# 3.5 Cálculo del nivel de riesgo NR

Mantener la programación existente para calcular:

```text
NR = NP × NC
```

También mostrar:

```text
NR = ND × NE × NC
```

El NR debe ser de solo lectura.

No permitir su edición manual.

El valor debe actualizarse automáticamente en la matriz del numeral 2.

---

# 3.6 Determinación del nivel de intervención

Mantener la programación existente.

El nivel de intervención debe determinarse automáticamente según el NR.

Mostrar:

- Nivel de intervención.
- Rango.
- Significado.
- Prioridad.
- Acción recomendada.
- Aceptabilidad, cuando corresponda.

Este resultado también debe registrarse automáticamente en la matriz.

---

## 4. Sincronización entre los numerales 2 y 3

Debe existir sincronización permanente entre:

```text
2. Matriz de evaluación de riesgos NTP 330
```

y:

```text
3. Evaluación por riesgo del proceso
```

La subpestaña del riesgo será la fuente del cálculo.

La matriz será el registro consolidado.

No se debe duplicar el ingreso de información.

### Regla de sincronización

```text
Datos ingresados o calculados en el numeral 3
        ↓
Actualización automática del numeral 2
```

### Regla de navegación inversa

Desde una fila de la matriz, el usuario debe poder abrir directamente la subpestaña del riesgo correspondiente.

---

## 5. Navegación corregida

La interfaz debe permitir:

```text
1. Completar la identificación del proyecto.
2. Visualizar la matriz inicial.
3. Abrir la evaluación por riesgo.
4. Completar la lista de chequeo.
5. Descargar la lista en PDF.
6. Calcular ND.
7. Seleccionar NE.
8. Calcular NP.
9. Seleccionar NC.
10. Calcular NR.
11. Determinar el nivel de intervención.
12. Ver los resultados actualizados en la matriz.
```

---

## 6. Validaciones obligatorias

La aplicación debe impedir:

- Abrir una evaluación sin identificar el proyecto.
- Crear una fila de matriz sin un riesgo.
- Calcular ND sin lista de chequeo.
- Marcar simultáneamente “Sí”, “No” y “No aplica”.
- Guardar una lista incompleta.
- Generar un PDF con datos no guardados sin advertirlo.
- Calcular NP sin ND y NE.
- Calcular NR sin NP y NC.
- Editar manualmente NP o NR.
- Desvincular una fila de la matriz de su subpestaña.
- Mostrar resultados desactualizados.

---

## 7. Trazabilidad

Cada fila de la matriz debe vincularse con:

- Proyecto.
- Proceso.
- Actividad.
- Riesgo.
- Lista de chequeo.
- Preguntas.
- Respuestas.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- PDF generado.
- Usuario.
- Fecha.
- Versión.

Cada PDF debe incluir un identificador que permita relacionarlo con la evaluación almacenada.

---

## 8. Criterios de aceptación

La corrección estará completa cuando:

1. Se mantenga el numeral 1 como “Identificación del proyecto”.
2. El antiguo numeral 3 pase a ser el numeral 2.
3. El numeral 2 se denomine “Matriz de evaluación de riesgos NTP 330”.
4. La evaluación por riesgo pase a ser el numeral 3.
5. Se mantengan las subpestañas por riesgo.
6. El numeral 3.1 corresponda a la determinación del ND.
7. Las listas se desplieguen como actualmente.
8. Se mantengan las opciones “Sí”, “No” y “No aplica”.
9. Cada lista pueda descargarse en PDF.
10. El PDF contenga toda la identificación y los resultados.
11. El ND alimente automáticamente la matriz.
12. NE, NP, NC, NR y nivel de intervención alimenten la matriz.
13. Se mantenga la programación del nivel de riesgo.
14. La matriz se actualice en tiempo real.
15. Cada fila permita abrir su evaluación.
16. Exista trazabilidad entre lista, cálculo, matriz y PDF.

---

## 9. Instrucción final para el desarrollador

Corrige la aplicación existente sin eliminar la programación ya desarrollada para la metodología NTP 330.

Dentro de la pestaña:

```text
Evaluación
```

la estructura definitiva debe ser:

```text
1. Identificación del proyecto

2. Matriz de evaluación de riesgos NTP 330

3. Evaluación por riesgo del proceso
   3.1 Determinación de los niveles de deficiencia ND:
       aplicación de listas de chequeo
   3.2 Nivel de exposición NE
   3.3 Nivel de probabilidad NP
   3.4 Nivel de consecuencia NC
   3.5 Nivel de riesgo NR
   3.6 Nivel de intervención
```

Mantener las subpestañas por cada riesgo asociado al proceso constructivo.

Dentro del numeral 3.1:

- Mostrar la lista de chequeo.
- Mantener las respuestas “Sí”, “No” y “No aplica”.
- Calcular el ND.
- Incorporar la descarga de la lista en formato PDF.
- Incluir en el PDF toda la identificación, preguntas, respuestas, resultados y trazabilidad.

Los resultados obtenidos en cada subpestaña deben actualizar automáticamente:

```text
2. Matriz de evaluación de riesgos NTP 330
```

Mantener las fórmulas:

```text
NP = ND × NE
NR = NP × NC
```

y conservar la determinación automática del nivel de intervención.

No considerar finalizada la corrección hasta que la matriz, las subpestañas, las listas de chequeo, los archivos PDF y los cálculos estén completamente vinculados y sincronizados.
