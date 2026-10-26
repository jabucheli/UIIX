# Solicitud de correcciones: nivel de intervención, PDF de campo y ART descargable

## 1. Objetivo

Corregir la aplicación web existente en tres aspectos:

1. Vincular correctamente el numeral **3.6 Determinación del nivel de intervención** con el resultado del numeral **3.5 Nivel de riesgo**.
2. Generar la lista de chequeo para levantamiento en campo con las celdas de **Sí**, **No** y **N/A** completamente vacías.
3. Corregir la visualización del ART descargable, utilizando formato horizontal para evitar cortes y superposición de contenido.

Mantener sin cambios las fórmulas ya implementadas para ND, NE, NP, NC y NR.

---

## 2. Corrección del numeral 3.6: Determinación del nivel de intervención

### 2.1 Problema identificado

Actualmente, el numeral:

```text
3.6 Determinación del nivel de intervención
```

no está correctamente vinculado con:

```text
3.5 Cálculo del nivel de riesgo NR
```

El nivel de intervención debe calcularse automáticamente a partir del valor de NR. No debe seleccionarse manualmente ni conservar un valor anterior cuando cambie el nivel de riesgo.

### 2.2 Secuencia correcta

Mantener la secuencia:

```text
ND = Nivel de deficiencia
NE = Nivel de exposición
NP = ND × NE
NC = Nivel de consecuencia
NR = NP × NC
```

Después de calcular NR, ejecutar automáticamente:

```text
NR
↓
Comparación con los rangos de la NTP 330
↓
Nivel de intervención
↓
Significado
↓
Prioridad de actuación
```

### 2.3 Vinculación obligatoria entre 3.5 y 3.6

El numeral 3.6 debe utilizar directamente el resultado calculado en el numeral 3.5.

Lógica conceptual:

```text
nivelRiesgo = resultadoNumeral35
nivelIntervencion = clasificarNivelIntervencion(nivelRiesgo)
```

No se debe:

- Volver a calcular NR mediante otra fórmula.
- Permitir el ingreso manual del nivel de intervención.
- Mantener un nivel de intervención desactualizado.
- Guardar NR y nivel de intervención incompatibles.
- Utilizar valores provenientes de otra evaluación o riesgo.

### 2.4 Actualización automática

El nivel de intervención debe actualizarse inmediatamente cuando cambie:

- Una respuesta de la lista de chequeo.
- El ND.
- El NE.
- El NP.
- El NC.
- El NR.

Secuencia de recálculo:

```text
Cambio de respuesta, NE o NC
↓
Recalcular ND, cuando corresponda
↓
Recalcular NP
↓
Recalcular NR
↓
Recalcular nivel de intervención
↓
Actualizar matriz parcial
↓
Actualizar matriz unificada
```

### 2.5 Información visible en el numeral 3.6

Mostrar automáticamente:

- NR utilizado.
- Rango aplicable.
- Nivel de intervención.
- Significado.
- Prioridad de actuación.
- Acción recomendada.
- Aceptabilidad del riesgo, cuando corresponda.
- Fuente metodológica.
- Fecha y hora del último cálculo.

Ejemplo:

```text
Nivel de riesgo calculado: 450
Nivel de intervención: II
Interpretación: corregir y adoptar medidas de control.
Prioridad: alta.
```

Los rangos y descripciones deben obtenerse de:

```text
D:\ejemplo\tesis\330.pdf
```

### 2.6 Configuración centralizada

Los rangos del nivel de intervención deben almacenarse en una sola tabla o configuración con:

- Rango mínimo.
- Rango máximo.
- Nivel de intervención.
- Significado.
- Prioridad.
- Acción recomendada.

No duplicar los rangos en varios componentes de la aplicación.

### 2.7 Registro en las matrices

Después de calcular el nivel de intervención, actualizar automáticamente:

```text
2. Matriz de evaluación de riesgos NTP 330
```

y:

```text
Matriz unificada y análisis
```

Registrar:

- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Significado.
- Estado de la evaluación.

### 2.8 Validaciones

La aplicación debe impedir:

- Mostrar un nivel de intervención sin NR.
- Editar manualmente el nivel de intervención.
- Guardar una evaluación con datos desincronizados.
- Mantener un nivel de intervención anterior después de cambiar NR.
- Actualizar la matriz sin actualizar el nivel de intervención.

---

## 3. Corrección del PDF de la lista de chequeo para campo

### 3.1 Problema identificado

El PDF generado para el levantamiento en campo no presenta correctamente las celdas de respuesta.

Las celdas destinadas a:

```text
Sí
No
N/A
```

deben estar completamente vacías.

No deben incluir:

- Respuestas precargadas.
- Marcas.
- Puntos.
- Círculos seleccionados.
- Sombras que parezcan una selección.
- Datos de evaluaciones anteriores.

### 3.2 Formato correcto

Cada pregunta debe incluir tres celdas independientes y vacías:

| N.° | Pregunta | Sí | No | N/A | Observaciones |
|---:|---|:---:|:---:|:---:|---|
| 1 | ¿Existe protección colectiva? |  |  |  | |
| 2 | ¿El área se encuentra señalizada? |  |  |  | |
| 3 | ¿Los equipos están en buen estado? |  |  |  | |

Las celdas deben:

- Tener bordes visibles.
- Tener suficiente alto y ancho.
- Permitir colocar manualmente una “X”, visto o marca.
- Permanecer vacías aunque existan respuestas guardadas en la aplicación.

### 3.3 Diferenciar las descargas

Mantener dos opciones separadas:

```text
1. Descargar lista de chequeo para campo
2. Descargar lista de chequeo completada
```

#### PDF para campo

Debe generarse:

- Sin respuestas.
- Sin ND calculado.
- Sin porcentajes.
- Sin marcas en Sí, No o N/A.
- Con espacios para observaciones y firmas.

#### PDF completado

Debe incluir:

- Respuestas registradas.
- Puntajes.
- ND.
- Porcentaje de cumplimiento.
- Observaciones.
- Evaluador.
- Fecha.
- Identificador de evaluación.

### 3.4 Regla para limpiar las respuestas

Antes de generar el PDF para campo, crear una copia temporal vacía de la lista:

```text
Para cada pregunta:
    respuesta = vacío
    puntaje = vacío
    observación = vacío
```

No modificar la evaluación almacenada.

### 3.5 Información que debe conservar el PDF de campo

Aunque las respuestas estén vacías, el PDF debe incluir:

- Nombre y código del proyecto.
- Tipo de proyecto.
- Proceso constructivo.
- Actividad o tarea.
- Riesgo.
- Código y nombre de la lista.
- Versión.
- Fuente.
- Fecha de generación.
- Espacios para fecha de inspección, ubicación, evaluador y firmas.

### 3.6 Prueba visual obligatoria

Antes de aprobar la corrección, generar un PDF de prueba y verificar:

- Todas las celdas de Sí, No y N/A están vacías.
- Los bordes son visibles.
- Existe espacio suficiente para llenado manual.
- Las preguntas no se cortan.
- No aparecen respuestas anteriores.
- El documento es legible en blanco y negro.
- Los encabezados se repiten en cada página.

---

## 4. Corrección del ART descargable

### 4.1 Problema identificado

El ART descargable no se visualiza correctamente. Deben corregirse posibles problemas como:

- Columnas cortadas.
- Texto superpuesto.
- Contenido fuera de los márgenes.
- Letra demasiado pequeña.
- Filas divididas incorrectamente.
- Encabezados incompletos.
- Tabla comprimida.

### 4.2 Orientación horizontal

Generar el ART por defecto en:

```text
Tamaño: A4
Orientación: horizontal
```

Cuando el contenido siga siendo demasiado ancho, permitir adicionalmente:

```text
A3 horizontal
```

### 4.3 Configuración recomendada

El PDF debe utilizar:

```text
Orientación: horizontal
Márgenes: reducidos, pero aptos para impresión
Escala: ajustar al ancho de la página
Encabezados: repetidos en cada página
Numeración: visible
```

No reducir la tipografía hasta volverla ilegible.

### 4.4 Distribución de columnas

Asignar mayor ancho a:

- Actividad o tarea.
- Peligro.
- Riesgo.
- Medidas de control.
- Observaciones.
- Responsable.

Asignar menor ancho a:

- N.°.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.

Permitir salto de línea dentro de las celdas.

### 4.5 Reglas de paginación

El ART debe:

- Repetir el encabezado en cada página.
- Evitar cortar una fila entre páginas, cuando sea posible.
- Mantener unido el contenido de cada riesgo.
- Mostrar el nombre del proyecto en todas las páginas.
- Mostrar el código de evaluación.
- Numerar las páginas.
- Mostrar fecha y versión.
- Mantener visibles los bordes de la tabla.

### 4.6 Encabezado del ART

Incluir:

- Título del ART.
- Nombre del proyecto.
- Tipo de proyecto.
- Proceso constructivo.
- Fecha.
- Evaluador.
- Código de evaluación.
- Versión.
- Estado.

### 4.7 Contenido mínimo

El ART debe mostrar:

- Actividad o tarea.
- Peligro.
- Riesgo.
- Trabajadores expuestos.
- Controles existentes.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Medidas de control.
- Responsable.
- Observaciones.

### 4.8 Vista previa

Incorporar una vista previa antes de descargar para comprobar:

- Orientación.
- Número de páginas.
- Columnas visibles.
- Tamaño del texto.
- Cortes de filas.
- Encabezados.
- Firmas.

Ofrecer:

```text
Descargar A4 horizontal
Descargar A3 horizontal
```

---

## 5. Pruebas obligatorias

### 5.1 Nivel de intervención

Probar:

- Valor mínimo de cada rango.
- Valor máximo de cada rango.
- Valores exactos en los límites.
- Cambio de NR.
- Actualización automática del nivel de intervención.
- Actualización de matrices.

Comprobar:

```text
Nivel de intervención mostrado
=
Nivel correspondiente al NR calculado
```

### 5.2 PDF de campo

Verificar:

- PDF sin respuestas precargadas.
- Celdas vacías.
- Bordes visibles.
- Sí, No y N/A claramente identificados.
- Espacio para observaciones.
- Identificación completa.
- Correcta impresión en blanco y negro.

### 5.3 ART

Probar con:

- Pocas y muchas filas.
- Textos cortos y extensos.
- Varias páginas.
- A4 horizontal.
- A3 horizontal.

Comprobar que no existan columnas cortadas, texto superpuesto, filas ilegibles ni encabezados ausentes.

---

## 6. Criterios de aceptación

La corrección estará completa cuando:

1. El numeral 3.6 reciba directamente el NR del numeral 3.5.
2. El nivel de intervención se calcule automáticamente.
3. El nivel de intervención cambie al cambiar NR.
4. NR y nivel de intervención no puedan quedar desincronizados.
5. Las matrices parcial y unificada se actualicen.
6. El PDF de campo tenga las celdas Sí, No y N/A completamente vacías.
7. El PDF de campo no incluya resultados anteriores.
8. El PDF completado mantenga las respuestas registradas.
9. El ART se genere en formato horizontal.
10. Todas las columnas del ART sean visibles.
11. El texto sea legible.
12. Los encabezados se repitan en cada página.
13. Exista vista previa antes de descargar.
14. Se mantengan las fórmulas de la NTP 330.

---

## 7. Instrucción final para el desarrollador

Corrige la aplicación existente sin modificar:

```text
NP = ND × NE
NR = NP × NC
```

Vincula obligatoriamente:

```text
3.5 Nivel de riesgo NR
↓
3.6 Nivel de intervención
```

El nivel de intervención debe obtenerse automáticamente del NR y de los rangos configurados conforme a la NTP 330.

Corrige el PDF para campo para que las columnas:

```text
Sí
No
N/A
```

aparezcan completamente vacías y puedan llenarse manualmente.

Corrige el ART descargable y genera por defecto:

```text
A4 horizontal
```

con ajuste adecuado de columnas, saltos de línea, encabezados repetidos y contenido completamente visible.

No considerar finalizada la corrección hasta comprobar visualmente los PDF y validar que el nivel de intervención corresponda exactamente al NR calculado.
