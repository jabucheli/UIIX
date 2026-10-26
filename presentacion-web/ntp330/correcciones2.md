# Solicitud de correcciones para la estructura y el despliegue de la evaluación NTP 330

## 1. Objetivo de la corrección

Corregir la aplicación web previamente generada para que la navegación, el despliegue de las listas de chequeo y el análisis de riesgos se realicen de manera ordenada, secuencial y conforme a la metodología NTP 330.

La aplicación debe organizarse únicamente a partir de:

1. Tipo de proyecto.
2. Proceso constructivo.
3. Pestañas por cada tipo de riesgo.
4. Evaluación de las variables de la NTP 330.
5. Registro automático de resultados en la página principal.

---

## 2. Corrección de la selección del tipo de proyecto

En el primer campo de la aplicación deben existir únicamente las siguientes opciones:

```text
Estructura
Infraestructura
```

No incluir otros tipos de proyecto en este primer menú.

El campo debe mostrarse como una lista desplegable obligatoria.

Ejemplo:

```text
Tipo de proyecto: [Seleccionar ▼]

- Estructura
- Infraestructura
```

---

## 3. Menú desplegable de procesos constructivos

Después de seleccionar el tipo de proyecto, debe habilitarse un segundo menú desplegable con los procesos constructivos correspondientes.

La relación debe ser:

```text
Tipo de proyecto
        ↓
Procesos constructivos asociados
```

Los procesos deben obtenerse del archivo:

```text
D:\ejemplo\tesis\procesos.doc
```

### 3.1 Procesos para proyectos de estructura

El menú podrá incluir, según el contenido real del archivo:

- Trabajos preliminares.
- Movimiento de tierras.
- Cimentaciones.
- Estructuras de hormigón armado.
- Estructuras metálicas.
- Mampostería.
- Cubiertas.
- Instalaciones.
- Acabados.
- Demoliciones.
- Otros procesos aplicables.

### 3.2 Procesos para proyectos de infraestructura

El menú podrá incluir, según el contenido real del archivo:

- Movimiento de tierras.
- Excavaciones.
- Rellenos y compactación.
- Construcción vial.
- Construcción de puentes.
- Obras hidráulicas.
- Obras sanitarias.
- Túneles.
- Muros de contención.
- Instalaciones eléctricas.
- Montajes industriales.
- Otros procesos aplicables.

No se deben inventar procesos. Los procesos definitivos deben extraerse y validarse con el archivo `procesos.doc`.

---

## 4. Generación de pestañas por cada tipo de riesgo

Una vez seleccionado el proceso constructivo, la aplicación debe generar automáticamente una pestaña independiente para cada riesgo relacionado con ese proceso.

La estructura debe ser:

```text
Tipo de proyecto
        ↓
Proceso constructivo
        ↓
Riesgos identificados
        ↓
Una pestaña por cada riesgo
```

Ejemplo:

```text
[Caída a distinto nivel]
[Caída al mismo nivel]
[Contacto eléctrico]
[Proyección de partículas]
[Sobreesfuerzo]
[Ruido]
```

Cada pestaña debe representar un riesgo específico.

No se debe mezclar la evaluación de varios riesgos dentro de una misma pestaña.

El usuario debe poder:

- Abrir cada pestaña.
- Completar la evaluación del riesgo.
- Revisar los valores calculados.
- Guardar los resultados.
- Identificar si la pestaña está pendiente o completada.
- Agregar un riesgo adicional cuando no aparezca automáticamente.

---

## 5. Contenido obligatorio de cada pestaña de riesgo

Cada pestaña debe contener las siguientes secciones, en este orden:

1. Identificación del riesgo.
2. Lista de chequeo.
3. Nivel de deficiencia.
4. Nivel de exposición.
5. Nivel de probabilidad.
6. Nivel de consecuencia.
7. Nivel de riesgo.
8. Nivel de intervención.
9. Observaciones.
10. Resultado guardado.

---

## 6. Identificación del riesgo

En la parte superior de cada pestaña se debe mostrar:

- Nombre del riesgo.
- Código del riesgo.
- Tipo de peligro.
- Proceso constructivo asociado.
- Descripción.
- Posibles consecuencias.
- Lista de chequeo asociada.
- Estado de la evaluación.

Ejemplo:

```text
Riesgo: Caída a distinto nivel
Proceso: Estructuras de hormigón armado
Estado: Pendiente
```

---

## 7. Corrección del despliegue de la lista de chequeo

La lista de chequeo debe mostrarse directamente dentro de la pestaña del riesgo.

No debe desplegarse en una ventana independiente que dificulte la continuidad de la evaluación.

La lista inicialmente cargada debe obtenerse de:

```text
D:\ejemplo\tesis\nd.xls
```

La relación debe ser:

```text
Riesgo
→ Lista de chequeo correspondiente
→ Preguntas
→ Respuestas
→ Nivel de deficiencia
```

Cada riesgo debe utilizar su propia lista de chequeo.

---

## 8. Respuestas de la lista de chequeo

Cada pregunta debe permitir únicamente las siguientes respuestas:

```text
Sí
No
```

Ejemplo:

| N.° | Pregunta | Sí | No |
|---:|---|:---:|:---:|
| 1 | ¿Existe protección colectiva? | ○ | ○ |
| 2 | ¿Se encuentra señalizada el área? | ○ | ○ |
| 3 | ¿Los equipos están en buen estado? | ○ | ○ |

Cada pregunta debe permitir seleccionar una sola respuesta.

El sistema debe impedir que una pregunta quede marcada simultáneamente como “Sí” y “No”.

Cuando sea necesario excluir una pregunta que no corresponda, se debe utilizar una función administrativa para configurar su aplicabilidad, pero la evaluación ordinaria debe mantener las respuestas “Sí” o “No”.

---

## 9. Determinación del nivel de deficiencia

El nivel de deficiencia debe calcularse automáticamente a partir de las respuestas de la lista de chequeo.

Las reglas, puntajes, ponderaciones y límites deben obtenerse del archivo:

```text
D:\ejemplo\tesis\nd.xls
```

Cada respuesta:

```text
No
```

debe incrementar el nivel de deficiencia según la regla definida en la lista.

El resultado debe mantenerse dentro de la escala establecida para la aplicación:

```text
1 ≤ ND ≤ 10
```

No se debe asumir que cada respuesta “No” aumenta exactamente un punto, salvo que así esté establecido en el archivo Excel.

La aplicación debe mostrar:

- Total de preguntas.
- Respuestas “Sí”.
- Respuestas “No”.
- Puntaje obtenido.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- Nivel de deficiencia calculado.
- Explicación del resultado.

---

## 10. Nivel de exposición

En la misma pestaña del riesgo se debe solicitar el nivel de exposición.

El nivel de exposición debe presentarse mediante una lista desplegable.

Los valores, categorías y descripciones deben obtenerse de la metodología NTP 330 contenida en:

```text
D:\ejemplo\tesis\330.pdf
```

Ejemplo de presentación:

```text
Nivel de exposición: [Seleccionar ▼]
```

Cada opción debe mostrar:

- Nombre de la categoría.
- Valor numérico.
- Descripción.
- Frecuencia o duración de la exposición.

El usuario debe seleccionar un nivel de exposición para cada riesgo.

---

## 11. Cálculo del nivel de probabilidad

Una vez calculado el nivel de deficiencia y seleccionado el nivel de exposición, el sistema debe calcular automáticamente:

```text
NP = ND × NE
```

Donde:

```text
NP = Nivel de probabilidad
ND = Nivel de deficiencia
NE = Nivel de exposición
```

Ejemplo:

```text
ND = 6
NE = 3

NP = 6 × 3
NP = 18
```

El resultado debe mostrarse en modo de solo lectura.

La aplicación debe indicar:

- Valor de ND.
- Valor de NE.
- Operación realizada.
- Valor de NP.
- Categoría de probabilidad.
- Interpretación según la NTP 330.

---

## 12. Nivel de consecuencia

Después de obtener el nivel de probabilidad, la aplicación debe solicitar el nivel de consecuencia.

Debe mostrarse mediante una lista desplegable.

Los valores, categorías y descripciones deben obtenerse de:

```text
D:\ejemplo\tesis\330.pdf
```

y, cuando corresponda, de:

```text
D:\ejemplo\tesis\ER
```

Ejemplo:

```text
Nivel de consecuencia: [Seleccionar ▼]
```

Cada opción debe mostrar:

- Categoría.
- Valor numérico.
- Descripción.
- Tipo de daño posible.
- Ejemplos de consecuencias.

---

## 13. Corrección de la fórmula del nivel de riesgo

La fórmula correcta que debe mantenerse es:

```text
NR = NP × NC
```

Donde:

```text
NR = Nivel de riesgo
NP = Nivel de probabilidad
NC = Nivel de consecuencia
```

También debe mostrarse la fórmula completa:

```text
NR = ND × NE × NC
```

No se debe multiplicar nuevamente el nivel de probabilidad por el nivel de exposición, porque el nivel de exposición ya está incluido en el cálculo de NP.

La secuencia correcta es:

```text
NP = ND × NE
NR = NP × NC
```

Ejemplo:

```text
ND = 6
NE = 3
NP = 18
NC = 25

NR = 18 × 25
NR = 450
```

---

## 14. Nivel de intervención

Después de calcular el nivel de riesgo, el sistema debe determinar automáticamente el nivel de intervención correspondiente.

Debe mostrar:

- Valor de NR.
- Nivel de intervención.
- Categoría.
- Interpretación.
- Prioridad de actuación.
- Acción recomendada.
- Aceptabilidad del riesgo, cuando corresponda.

Los rangos deben ajustarse a la NTP 330.

---

## 15. Orden de evaluación dentro de cada pestaña

La pestaña debe seguir exactamente este orden:

```text
1. Lista de chequeo
2. Cálculo de ND
3. Selección de NE
4. Cálculo de NP
5. Selección de NC
6. Cálculo de NR
7. Determinación del nivel de intervención
8. Guardado del resultado
```

El sistema no debe permitir avanzar cuando falte un dato obligatorio.

---

## 16. Actualización automática

Los resultados deben actualizarse en tiempo real.

### Si cambia una respuesta de la lista

Recalcular:

```text
ND
NP
NR
Nivel de intervención
```

### Si cambia el nivel de exposición

Recalcular:

```text
NP
NR
Nivel de intervención
```

### Si cambia el nivel de consecuencia

Recalcular:

```text
NR
Nivel de intervención
```

No debe ser necesario presionar botones independientes para ejecutar cada cálculo.

---

## 17. Registro de resultados en la página principal

Todos los datos calculados en las pestañas deben registrarse automáticamente en la página principal.

La página principal debe mostrar una tabla resumen.

| Tipo de proyecto | Proceso | Riesgo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|---|---|---|---:|---:|---:|---:|---:|---|---|

Cada fila debe corresponder a un riesgo evaluado.

La tabla debe actualizarse cuando:

- Se complete una lista.
- Se cambie ND.
- Se cambie NE.
- Se recalculen NP o NR.
- Se cambie NC.
- Se modifique el nivel de intervención.
- Se agregue un riesgo.

---

## 18. Indicadores visuales en la página principal

Cada riesgo debe mostrar un estado:

- Pendiente.
- Lista incompleta.
- ND calculado.
- NE pendiente.
- NP calculado.
- NC pendiente.
- NR calculado.
- Evaluación completa.

La página principal debe permitir:

- Abrir la pestaña del riesgo.
- Editar la evaluación.
- Revisar la lista de chequeo.
- Ver la trazabilidad.
- Ordenar los riesgos por NR.
- Filtrar por proceso.
- Filtrar por nivel de intervención.
- Exportar resultados.

---

## 19. Navegación propuesta

La estructura principal debe ser:

```text
Tipo de proyecto: [Estructura / Infraestructura]

Proceso constructivo: [Lista desplegable]

Riesgos identificados:

[ Riesgo 1 ] [ Riesgo 2 ] [ Riesgo 3 ] [ + Agregar riesgo ]

Contenido de la pestaña seleccionada:

- Lista de chequeo
- ND
- NE
- NP
- NC
- NR
- Nivel de intervención
```

Debajo de las pestañas debe mostrarse la tabla general de resultados.

---

## 20. Validaciones obligatorias

La aplicación debe impedir:

- Seleccionar un proceso sin elegir el tipo de proyecto.
- Mostrar procesos que no correspondan al tipo de proyecto.
- Crear una pestaña sin un riesgo asociado.
- Calcular ND sin completar la lista.
- Seleccionar simultáneamente “Sí” y “No”.
- Calcular NP sin ND y NE.
- Calcular NR sin NP y NC.
- Editar manualmente NP.
- Editar manualmente NR.
- Guardar una evaluación incompleta como finalizada.
- Mostrar valores fuera de los rangos establecidos.

---

## 21. Trazabilidad

Cada resultado debe conservar:

- Tipo de proyecto.
- Proceso constructivo.
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
- Versión de la lista.
- Versión de la metodología.
- Fórmula utilizada.
- Archivo de origen.

---

## 22. Criterios de aceptación

La corrección se considerará completa cuando:

1. Solo existan las opciones “Estructura” e “Infraestructura”.
2. Los procesos se desplieguen según el tipo de proyecto.
3. Cada proceso genere pestañas por riesgo.
4. Cada pestaña tenga su lista de chequeo.
5. Las preguntas se respondan con “Sí” o “No”.
6. El ND se calcule automáticamente.
7. El NE se seleccione desde una lista desplegable.
8. El NP se calcule como `ND × NE`.
9. El NC se seleccione desde una lista desplegable.
10. El NR se calcule como `NP × NC`.
11. Se determine el nivel de intervención.
12. Los resultados se registren en la página principal.
13. Los cambios se actualicen en tiempo real.
14. Cada riesgo se evalúe de manera independiente.
15. Los cálculos se ajusten a la NTP 330.
16. La página sea clara, ordenada y fácil de utilizar.

---

## 23. Instrucción final para el desarrollador

Corrige la aplicación existente y reorganiza la interfaz de la siguiente manera:

```text
Tipo de proyecto
→ Proceso constructivo
→ Pestañas por riesgo
→ Lista de chequeo
→ ND
→ NE
→ NP
→ NC
→ NR
→ Nivel de intervención
```

Mantén únicamente:

```text
Estructura
Infraestructura
```

como tipos generales de proyecto.

Los procesos deben desplegarse según el tipo seleccionado.

Cada proceso debe generar una pestaña por cada riesgo identificado.

Dentro de cada pestaña se debe:

1. Completar la lista de chequeo con respuestas “Sí” o “No”.
2. Calcular el nivel de deficiencia.
3. Seleccionar el nivel de exposición.
4. Calcular el nivel de probabilidad.
5. Seleccionar el nivel de consecuencia.
6. Calcular el nivel de riesgo.
7. Determinar el nivel de intervención.
8. Registrar automáticamente los resultados en la página principal.

La secuencia matemática obligatoria es:

```text
NP = ND × NE
NR = NP × NC
```

Todos los valores, rangos, categorías e interpretaciones deben verificarse con:

```text
D:\ejemplo\tesis\330.pdf
D:\ejemplo\tesis\nd.xls
D:\ejemplo\tesis\ER
D:\ejemplo\tesis\procesos.doc
```

No considerar terminada la corrección hasta que cada resultado calculado en las pestañas se refleje correctamente en la página principal y pueda rastrearse hasta la lista de chequeo y la metodología NTP 330.
