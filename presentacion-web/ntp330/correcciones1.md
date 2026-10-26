# Solicitud de correcciones para ordenar el flujo de evaluación de riesgos en la aplicación web NTP 330

## 1. Objetivo de la corrección

Corregir la aplicación web previamente desarrollada para que presente un flujo de trabajo más ordenado, secuencial e intuitivo, sin modificar la forma de calcular los niveles de riesgo.

Se debe mantener la lógica de evaluación basada en:

```text
Nivel de deficiencia — ND
Nivel de exposición — NE
Nivel de probabilidad — NP
Nivel de consecuencia — NC
Nivel de riesgo — NR
Nivel de intervención
```

La aplicación debe guiar al usuario paso a paso desde la selección del tipo de proyecto hasta la obtención del nivel de riesgo y del nivel de intervención.

---

## 2. Regla principal

No modificar el método de cálculo ya implementado.

Se debe mantener:

```text
NP = ND × NE
```

y:

```text
NR = NP × NC
```

También debe poder mostrarse la expresión completa:

```text
NR = ND × NE × NC
```

Los rangos, categorías, descripciones y niveles de intervención deben continuar ajustándose a la metodología NTP 330 y a los archivos de referencia del proyecto.

---

## 3. Archivos de referencia

La aplicación debe continuar utilizando:

### Metodología NTP 330

```text
D:\ejemplo\tesis\330.pdf
```

### Listas de chequeo para medir el nivel de deficiencia

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

No se deben inventar valores, escalas, fórmulas ni categorías.

---

## 4. Nueva organización general de la página web

La interfaz debe reorganizarse como un asistente secuencial.

El usuario debe completar las etapas en el siguiente orden:

```text
1. Tipo de proyecto
2. Riesgos identificados
3. Lista de chequeo y nivel de deficiencia
4. Nivel de exposición
5. Nivel de probabilidad
6. Nivel de consecuencia
7. Nivel de riesgo
8. Nivel de intervención
9. Resumen y guardado
```

Cada etapa debe mostrarse claramente y el usuario debe conocer en todo momento:

- En qué paso se encuentra.
- Qué información ya completó.
- Qué información falta.
- Qué resultados se calcularon automáticamente.

---

## 5. Barra de progreso

Incorporar una barra de progreso visible en la parte superior.

Ejemplo:

```text
[1 Tipo de proyecto]
[2 Riesgos]
[3 Deficiencia]
[4 Exposición]
[5 Probabilidad]
[6 Consecuencia]
[7 Riesgo]
[8 Intervención]
```

La barra debe utilizar estados visuales:

- Pendiente.
- En proceso.
- Completado.
- Con observaciones.
- Bloqueado.

El usuario no debe avanzar al siguiente paso cuando falte información obligatoria.

---

## 6. Paso 1: selección del tipo de proyecto

El primer paso debe permitir seleccionar únicamente una de las siguientes categorías generales:

- Estructura.
- Infraestructura.

### 6.1 Tipo de proyecto: estructura

Puede incluir, entre otros:

- Edificación.
- Estructuras de hormigón armado.
- Estructuras metálicas.
- Vivienda.
- Edificios institucionales.
- Naves industriales.
- Rehabilitación estructural.
- Demolición estructural.
- Otro.

### 6.2 Tipo de proyecto: infraestructura

Puede incluir, entre otros:

- Puentes.
- Vías.
- Obras hidráulicas.
- Obras sanitarias.
- Túneles.
- Obras eléctricas.
- Urbanizaciones.
- Movimiento de tierras.
- Infraestructura industrial.
- Otro.

El administrador debe poder editar y ampliar estas categorías.

---

## 7. Paso 2: menú de riesgos identificados

Después de seleccionar el tipo de proyecto, la aplicación debe desplegar un menú con los riesgos relacionados.

Los riesgos deben filtrarse automáticamente según:

```text
Tipo de proyecto seleccionado
+ procesos constructivos relacionados
+ actividades asociadas
```

El menú debe mostrar cada riesgo mediante una tarjeta, fila o casilla de selección.

Cada riesgo debe contener:

- Código.
- Nombre.
- Tipo de peligro.
- Descripción breve.
- Proceso asociado.
- Actividad asociada.
- Estado de evaluación.
- Indicador de lista de chequeo pendiente o completada.

El usuario debe poder:

- Seleccionar uno o varios riesgos presentes.
- Desmarcar riesgos que no correspondan.
- Agregar otros riesgos.
- Registrar una observación.
- Guardar la selección.

---

## 8. Opción para agregar riesgos

Incluir el botón:

```text
+ Agregar otro riesgo
```

Al seleccionar esta opción, solicitar:

- Nombre del riesgo.
- Tipo de peligro.
- Descripción.
- Proceso relacionado.
- Actividad relacionada.
- Fuente generadora.
- Posibles consecuencias.
- Lista de chequeo asociada.
- Justificación.

No permitir continuar con un riesgo nuevo si no tiene una lista de chequeo asignada o si no queda expresamente marcado como pendiente de configuración.

---

## 9. Paso 3: enlace a la lista de chequeo

Una vez seleccionado un riesgo, debe aparecer un enlace o botón claramente visible:

```text
Abrir lista de chequeo
```

También puede utilizarse:

```text
Evaluar nivel de deficiencia
```

Este enlace debe abrir una ventana auxiliar, modal o panel emergente.

La lista de chequeo no debe ocupar permanentemente toda la pantalla principal.

---

## 10. Ventana auxiliar de la lista de chequeo

La ventana auxiliar debe mostrar:

- Nombre del riesgo.
- Código del riesgo.
- Nombre de la lista de chequeo.
- Código de la lista.
- Número total de preguntas.
- Progreso de respuestas.
- Nivel de deficiencia calculado en tiempo real.

Cada pregunta debe permitir:

- Sí.
- No.
- No aplica.
- No verificado.
- Observación.
- Evidencia.
- Fotografía o archivo adjunto, cuando corresponda.

---

## 11. Cálculo del nivel de deficiencia

Se debe mantener la forma de calcular el nivel de deficiencia ya definida.

La lista de chequeo debe ser el mecanismo para determinar el ND de cada riesgo.

Cada respuesta “No” debe incrementar el nivel de deficiencia conforme a los criterios del archivo:

```text
D:\ejemplo\tesis\nd.xls
```

El ND debe permanecer en la escala:

```text
1 ≤ ND ≤ 10
```

La aplicación debe mostrar dentro de la ventana auxiliar:

- Número de respuestas “Sí”.
- Número de respuestas “No”.
- Número de respuestas “No aplica”.
- Número de respuestas “No verificadas”.
- Puntaje acumulado.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- ND calculado.
- Explicación del resultado.

No se debe asumir que cada respuesta “No” equivale necesariamente a un punto. Se deben respetar las ponderaciones y reglas del archivo Excel.

---

## 12. Cierre de la ventana auxiliar

La ventana auxiliar debe incluir los botones:

```text
Guardar y cerrar
Cancelar
```

El botón “Guardar y cerrar” solo debe habilitarse cuando:

- Todas las preguntas obligatorias estén respondidas.
- No existan errores de validación.
- El ND haya sido calculado.
- Se haya guardado la trazabilidad de respuestas.

Al guardar y cerrar:

1. Se almacena la lista.
2. Se almacena el ND.
3. Se cierra la ventana auxiliar.
4. Se regresa al flujo principal.
5. El riesgo debe aparecer como “ND completado”.
6. El valor de ND debe mostrarse en la pantalla principal.

---

## 13. Evaluación de varios riesgos

Cuando existan varios riesgos seleccionados, cada uno debe mostrar:

- Nombre.
- Estado de lista.
- ND obtenido.
- Botón para abrir o reabrir su lista.
- Estado de evaluación.

Ejemplo:

| Riesgo | Lista de chequeo | ND | Estado |
|---|---|---:|---|
| Caída a distinto nivel | Abrir lista | 8 | Completado |
| Contacto eléctrico | Abrir lista | — | Pendiente |
| Proyección de partículas | Revisar lista | 6 | Completado |

La aplicación debe impedir cerrar la evaluación general si existen riesgos obligatorios sin ND.

---

## 14. Paso 4: nivel de exposición

Después de completar el ND del riesgo, el flujo principal debe continuar con el nivel de exposición.

El sistema debe solicitar:

- Categoría de exposición.
- Valor numérico.
- Frecuencia.
- Duración.
- Número de trabajadores expuestos.
- Tiempo de permanencia.
- Justificación.
- Observaciones.

Las opciones y valores deben ajustarse a la NTP 330.

El NE debe seleccionarse individualmente para cada riesgo.

---

## 15. Paso 5: nivel de probabilidad

Una vez disponibles ND y NE, la aplicación debe calcular automáticamente:

```text
NP = ND × NE
```

Debe mostrar:

- ND utilizado.
- NE utilizado.
- Operación.
- Resultado de NP.
- Categoría.
- Interpretación.

Ejemplo:

```text
ND = 8
NE = 3

NP = 8 × 3
NP = 24
```

El NP debe ser de solo lectura.

No debe permitirse su edición manual.

Si cambia ND o NE, el NP debe recalcularse automáticamente.

---

## 16. Paso 6: nivel de consecuencia

Después de calcular NP, el usuario debe seleccionar el nivel de consecuencia.

La aplicación debe mostrar las opciones establecidas en la NTP 330.

Cada opción debe incluir:

- Nombre de la categoría.
- Valor numérico.
- Descripción.
- Ejemplos.
- Posibles daños.
- Justificación obligatoria.

El NC debe definirse individualmente para cada riesgo.

---

## 17. Paso 7: nivel de riesgo

Cuando estén disponibles NP y NC, el sistema debe calcular automáticamente:

```text
NR = NP × NC
```

También debe mostrar:

```text
NR = ND × NE × NC
```

La pantalla debe mostrar:

- ND.
- NE.
- NP.
- NC.
- NR.
- Categoría del riesgo.
- Interpretación.
- Prioridad.

El NR debe ser de solo lectura.

---

## 18. Paso 8: nivel de intervención

El sistema debe determinar automáticamente el nivel de intervención correspondiente al NR obtenido.

Debe mostrar:

- Nivel de intervención.
- Significado.
- Prioridad.
- Acción recomendada.
- Aceptabilidad.
- Necesidad de intervención inmediata, programada o de seguimiento.

Los niveles de intervención deben provenir de la NTP 330.

---

## 19. Diseño de la pantalla principal

La pantalla principal debe dividirse en cuatro zonas.

### 19.1 Encabezado

Debe mostrar:

- Nombre del proyecto.
- Tipo de proyecto.
- Fecha.
- Evaluador.
- Estado general.

### 19.2 Barra de progreso

Debe mostrar los pasos del proceso.

### 19.3 Área principal

Debe mostrar el contenido del paso actual.

### 19.4 Panel lateral de resumen

Debe mostrar en todo momento:

- Riesgo seleccionado.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Estado de la evaluación.

---

## 20. Resumen individual de cada riesgo

Al completar cada riesgo, mostrar una tarjeta resumen:

```text
Riesgo: Caída a distinto nivel
ND: 8
NE: 3
NP: 24
NC: 60
NR: 1440
Nivel de intervención: I
Estado: Evaluación completa
```

La tarjeta debe permitir:

- Revisar.
- Editar.
- Reabrir lista.
- Ver trazabilidad.
- Ver controles.
- Exportar.

---

## 21. Resumen general de la evaluación

Al finalizar, mostrar una tabla:

| Riesgo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|---|---:|---:|---:|---:|---:|---|---|

La tabla debe permitir:

- Ordenar por NR.
- Filtrar por nivel de intervención.
- Identificar los riesgos prioritarios.
- Abrir el detalle.
- Exportar a Excel.
- Exportar a PDF.
- Guardar la evaluación.

---

## 22. Reglas de navegación

La aplicación debe cumplir las siguientes reglas:

1. No permitir avanzar a NE sin completar ND.
2. No calcular NP sin ND y NE.
3. No solicitar NC antes de obtener NP.
4. No calcular NR sin NP y NC.
5. No determinar nivel de intervención sin NR.
6. Permitir volver a pasos anteriores.
7. Recalcular resultados si se modifica un dato previo.
8. Mostrar advertencias antes de perder cambios.
9. Guardar automáticamente borradores.
10. Mantener el estado de cada riesgo.

---

## 23. Reglas de recálculo

Cuando se modifique una respuesta de la lista de chequeo, el sistema debe recalcular:

```text
ND
↓
NP
↓
NR
↓
Nivel de intervención
```

Cuando se modifique NE, debe recalcular:

```text
NP
↓
NR
↓
Nivel de intervención
```

Cuando se modifique NC, debe recalcular:

```text
NR
↓
Nivel de intervención
```

Los cambios deben visualizarse inmediatamente.

---

## 24. Trazabilidad

Cada evaluación debe conservar:

- Tipo de proyecto.
- Proceso.
- Actividad.
- Riesgo.
- Lista de chequeo.
- Preguntas.
- Respuestas.
- Puntajes.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Usuario.
- Fecha.
- Versión.
- Fórmula aplicada.
- Archivo fuente.

Cada resultado debe poder explicarse desde la lista de chequeo hasta el nivel de intervención.

---

## 25. Validaciones obligatorias

La aplicación debe impedir:

- Continuar sin seleccionar tipo de proyecto.
- Continuar sin seleccionar al menos un riesgo.
- Calcular ND sin lista.
- Cerrar la ventana auxiliar con preguntas obligatorias pendientes.
- Mostrar ND fuera del rango de 1 a 10.
- Calcular NP sin ND y NE.
- Calcular NR sin NP y NC.
- Editar manualmente NP.
- Editar manualmente NR.
- Aprobar evaluaciones incompletas.
- Guardar un riesgo nuevo sin justificación.

---

## 26. Criterios de aceptación

La corrección estará completa cuando:

1. La interfaz funcione como un proceso secuencial.
2. El usuario seleccione estructura o infraestructura.
3. Se despliegue automáticamente el menú de riesgos.
4. Los riesgos puedan seleccionarse o agregarse.
5. Cada riesgo tenga un enlace a su lista de chequeo.
6. La lista se abra en una ventana auxiliar.
7. El ND se calcule dentro de la ventana auxiliar.
8. La ventana se cierre al guardar.
9. El flujo principal continúe con NE.
10. NP se calcule automáticamente.
11. El usuario seleccione NC.
12. NR se calcule automáticamente.
13. Se determine el nivel de intervención.
14. Los valores se recalculen al modificar datos.
15. Se mantenga la trazabilidad.
16. La aplicación sea visualmente ordenada.
17. Los cálculos continúen ajustados a la NTP 330.

---

## 27. Instrucción final para el desarrollador

Corrige la aplicación existente sin modificar la lógica de cálculo.

Mantén:

```text
NP = ND × NE
NR = NP × NC
```

Reorganiza la interfaz para que el usuario avance secuencialmente.

Primero debe seleccionar:

```text
Estructura
o
Infraestructura
```

Después, el sistema debe desplegar los riesgos identificados.

Cada riesgo seleccionado debe incluir un enlace para abrir su lista de chequeo en una ventana auxiliar.

Dentro de esta ventana debe medirse el nivel de deficiencia.

Al finalizar, la ventana debe guardar la información, cerrarse y devolver al usuario al flujo principal.

Posteriormente se debe:

1. Seleccionar NE.
2. Calcular NP.
3. Seleccionar NC.
4. Calcular NR.
5. Determinar el nivel de intervención.

Todos los valores, rangos, categorías e interpretaciones deben mantenerse ajustados a la metodología NTP 330 y a los archivos:

```text
D:\ejemplo\tesis\330.pdf
D:\ejemplo\tesis\nd.xls
D:\ejemplo\tesis\ER
D:\ejemplo\tesis\procesos.doc
```

No considerar terminada la corrección hasta que el flujo sea claro, secuencial, verificable y cada riesgo pueda evaluarse individualmente desde su lista de chequeo hasta su nivel de intervención.
