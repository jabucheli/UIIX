# Solicitud de correcciones: nuevo proyecto, matriz unificada, ND automático y PDF de campo

## 1. Objetivo

Corregir la aplicación web existente para incorporar:

1. La opción de crear un proyecto nuevo.
2. Un campo para asignar el nombre del proyecto.
3. Una matriz de riesgos unificada independiente para cada proyecto.
4. El cálculo automático y en tiempo real del nivel de deficiencia mientras se completa la lista de chequeo.
5. La descarga de la lista de chequeo en PDF para su aplicación manual en campo.
6. Casillas manuales para responder **Sí**, **No** o **N/A**.
7. La conservación de la metodología y las fórmulas NTP 330 ya implementadas.

---

## 2. Creación de un proyecto nuevo

Incorporar un botón visible:

```text
+ Crear nuevo proyecto
```

Debe estar disponible en las pestañas:

- Evaluación.
- Matriz unificada y análisis.
- Pantalla inicial de proyectos.

Al presionarlo, abrir un formulario con:

```text
Nombre del proyecto
Tipo de proyecto
```

El campo **Nombre del proyecto** debe ser obligatorio y permitir escribir libremente el nombre.

El campo **Tipo de proyecto** debe ser una lista desplegable con únicamente:

```text
Estructura
Infraestructura
```

Cada proyecto debe recibir automáticamente un identificador único, por ejemplo:

```text
PROY-0001
PROY-0002
PROY-0003
```

El sistema debe almacenar:

- Identificador.
- Nombre.
- Tipo de proyecto.
- Fecha de creación.
- Usuario creador.
- Estado.
- Número de procesos evaluados.
- Número de riesgos evaluados.
- Versión metodológica.

Debe impedirse guardar un proyecto sin nombre y advertir cuando exista otro proyecto con el mismo nombre.

---

## 3. Matriz de riesgos unificada por proyecto

Al guardar un proyecto nuevo, crear automáticamente una matriz de riesgos unificada vacía y exclusiva para ese proyecto.

La relación debe ser:

```text
Proyecto
    ├── Evaluación del proceso 1
    ├── Evaluación del proceso 2
    ├── Evaluación del proceso 3
    └── Evaluación del proceso n
                ↓
Matriz de riesgos unificada del proyecto
```

No deben mezclarse riesgos, procesos ni resultados de proyectos diferentes.

Incorporar un selector:

```text
Proyecto activo: [Seleccionar ▼]
```

Al seleccionar un proyecto, cargar únicamente:

- Sus procesos constructivos.
- Sus evaluaciones parciales.
- Sus riesgos.
- Sus listas de chequeo.
- Su matriz unificada.
- Sus análisis estadísticos.
- Sus reportes.

Cada evaluación parcial debe alimentar automáticamente la matriz unificada del proyecto activo con:

- Proceso constructivo.
- Riesgo.
- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.
- Estado.
- Fecha.
- Evaluador.

---

## 4. Cálculo automático del nivel de deficiencia

El nivel de deficiencia debe calcularse automáticamente mientras el usuario responde la lista de chequeo.

No debe ser necesario presionar:

```text
Guardar
Calcular
Procesar
Actualizar
```

para visualizar el ND.

Cada vez que se seleccione:

```text
Sí
No
No aplica
```

la aplicación debe recalcular inmediatamente:

- Total de preguntas.
- Respuestas “Sí”.
- Respuestas “No”.
- Respuestas “No aplica”.
- Puntaje acumulado.
- Porcentaje de cumplimiento.
- Porcentaje de incumplimiento.
- Nivel de deficiencia.

La secuencia debe ser:

```text
Seleccionar o cambiar una respuesta
        ↓
Recalcular ND inmediatamente
        ↓
Mostrar el resultado preliminar
        ↓
Recalcular NP y NR si ya existen NE y NC
```

El botón de guardar se utilizará únicamente para registrar definitivamente la evaluación.

Mientras existan cambios no registrados, mostrar:

```text
Cambios sin guardar
Resultado preliminar
```

Después de guardar, mostrar:

```text
Resultado registrado
```

Si el usuario cambia de pestaña, conservar temporalmente las respuestas durante la sesión.

Antes de cerrar o abandonar la evaluación, mostrar:

```text
Existen cambios sin guardar. ¿Desea guardarlos antes de salir?
```

Mantener la escala configurada:

```text
1 ≤ ND ≤ 10
```

Las respuestas “No” deben incrementar el ND conforme a las reglas, pesos y fórmulas de:

```text
D:\ejemplo\tesis\nd.xls
```

No asumir que cada respuesta “No” equivale exactamente a un punto, salvo que así esté definido en el archivo Excel.

Cuando cambie una respuesta, recalcular automáticamente:

```text
ND
↓
NP
↓
NR
↓
Nivel de intervención
```

siempre que ya se hayan seleccionado NE y NC.

Mantener:

```text
NP = ND × NE
NR = NP × NC
```

---

## 5. Descarga de la lista de chequeo para campo

Dentro de cada pestaña de riesgo, incorporar el botón:

```text
Descargar lista de chequeo para campo
```

El PDF debe diseñarse para:

- Imprimirse.
- Llevarse a campo.
- Ser llenado manualmente.
- Registrar observaciones.
- Registrar hallazgos.
- Transcribir posteriormente los resultados a la aplicación.

Cada pregunta debe incluir casillas vacías:

```text
☐ Sí
☐ No
☐ N/A
```

Ejemplo:

| N.° | Pregunta | Sí | No | N/A | Observaciones |
|---:|---|:---:|:---:|:---:|---|
| 1 | ¿Existe protección colectiva? | ☐ | ☐ | ☐ | |
| 2 | ¿El área está señalizada? | ☐ | ☐ | ☐ | |
| 3 | ¿Los equipos están en buen estado? | ☐ | ☐ | ☐ | |

Las casillas deben tener espacio suficiente para marcarse manualmente con bolígrafo.

---

## 6. PDF en blanco para inspección

La opción:

```text
Descargar lista de chequeo para campo
```

debe generar un PDF sin respuestas precargadas.

No debe marcar automáticamente ninguna opción ni incluir un ND calculado, porque su finalidad es realizar una nueva inspección.

Debe contener para cada pregunta:

```text
☐ Sí
☐ No
☐ N/A
```

---

## 7. PDF de evaluación completada

Mantener una segunda opción:

```text
Descargar lista de chequeo completada
```

Este PDF sí debe incluir:

- Respuestas registradas.
- Observaciones.
- Puntajes.
- Resultado de ND.
- Porcentaje de cumplimiento.
- Fecha.
- Evaluador.
- Identificador de la evaluación.

Las dos opciones deben mostrarse claramente:

```text
1. PDF en blanco para campo
2. PDF de evaluación completada
```

---

## 8. Información obligatoria del PDF de campo

### Encabezado

Incluir:

- Nombre de la aplicación.
- Metodología NTP 330.
- Título de la lista.
- Código de la lista.
- Versión.
- Número de página.

### Identificación del proyecto

Incluir campos para:

```text
Nombre del proyecto:
________________________________________

Código del proyecto:
________________________________________

Tipo de proyecto:
☐ Estructura
☐ Infraestructura

Proceso constructivo:
________________________________________

Actividad o tarea:
________________________________________

Riesgo:
________________________________________
```

### Datos de inspección

Incluir:

```text
Ubicación:
________________________________________

Fecha:
____ / ____ / ______

Hora:
____________

Evaluador:
________________________________________

Cargo:
________________________________________

Número de trabajadores expuestos:
____________
```

### Identificación de la lista

Incluir:

- Código.
- Nombre.
- Riesgo asociado.
- Proceso asociado.
- Versión.
- Fuente.
- Número total de preguntas.

### Tabla de preguntas

Incluir:

- Número.
- Pregunta.
- Sí.
- No.
- N/A.
- Observaciones.

### Cierre

Incluir:

```text
Observaciones generales:
____________________________________________________
____________________________________________________
____________________________________________________

Nombre y firma del evaluador:
____________________________________________________

Nombre y firma del responsable del área:
____________________________________________________
```

---

## 9. Formato del PDF

El PDF debe:

- Utilizar tamaño A4.
- Usar orientación vertical u horizontal según el contenido.
- Tener tipografía legible.
- Mantener márgenes adecuados para impresión.
- Repetir el encabezado de la tabla en cada página.
- Evitar cortar preguntas entre páginas.
- Numerar las páginas.
- Mostrar el código del proyecto.
- Mostrar el código de la lista.
- Mostrar la fecha de generación.
- Ser legible en blanco y negro.
- Mantener las casillas claramente visibles.

---

## 10. Flujo para la inspección en campo

El flujo previsto debe ser:

```text
Crear o seleccionar proyecto
        ↓
Seleccionar proceso y riesgo
        ↓
Descargar PDF en blanco
        ↓
Realizar inspección en campo
        ↓
Marcar manualmente Sí, No o N/A
        ↓
Abrir nuevamente la evaluación
        ↓
Transcribir las respuestas
        ↓
Calcular ND automáticamente
        ↓
Guardar la evaluación
        ↓
Actualizar matrices parcial y unificada
```

No se requiere reconocimiento automático del PDF en esta etapa.

---

## 11. Vinculación y trazabilidad del PDF

Cada PDF debe incluir:

- ID del proyecto.
- ID de la evaluación.
- ID del proceso.
- Código del riesgo.
- Código de la lista.
- Fecha de generación.
- Identificador alfanumérico o código QR, cuando sea posible.

Esto debe permitir identificar con precisión a qué proyecto, proceso, riesgo y evaluación pertenece la lista utilizada en campo.

---

## 12. Actualización de las matrices

Después de transcribir y guardar los resultados obtenidos en campo, la aplicación debe:

1. Calcular ND.
2. Registrar NE.
3. Calcular NP.
4. Registrar NC.
5. Calcular NR.
6. Determinar el nivel de intervención.
7. Actualizar la matriz parcial.
8. Actualizar la matriz unificada del proyecto.
9. Actualizar los análisis estadísticos.

---

## 13. Validaciones obligatorias

La aplicación debe impedir:

- Crear un proyecto sin nombre.
- Crear una matriz unificada sin proyecto.
- Mezclar evaluaciones de proyectos diferentes.
- Generar un PDF sin identificar el riesgo y la lista.
- Mostrar ND fuera del rango configurado.
- Perder respuestas al cambiar de pestaña durante la sesión.
- Registrar NP sin ND y NE.
- Registrar NR sin NP y NC.
- Incluir riesgos excluidos en la matriz unificada.
- Descargar una lista completada con información desactualizada.

---

## 14. Criterios de aceptación

La corrección estará completa cuando:

1. Exista el botón “Crear nuevo proyecto”.
2. Se pueda ingresar el nombre del proyecto.
3. Se pueda seleccionar Estructura o Infraestructura.
4. Cada proyecto tenga su propia matriz unificada.
5. Las evaluaciones de proyectos distintos no se mezclen.
6. El ND se calcule automáticamente al responder.
7. No sea necesario guardar para visualizar el ND.
8. Los cambios sin guardar se identifiquen claramente.
9. Se pueda descargar la lista para campo.
10. El PDF tenga casillas vacías para Sí, No y N/A.
11. El PDF incluya identificación completa.
12. El PDF sea apto para impresión y llenado manual.
13. Exista una descarga separada de la lista completada.
14. Los resultados guardados actualicen las matrices.
15. Se mantengan las fórmulas NTP 330.
16. Se preserve la trazabilidad completa.

---

## 15. Instrucción final para el desarrollador

Corrige la aplicación existente para incorporar:

```text
+ Crear nuevo proyecto
```

El formulario debe incluir:

```text
Nombre del proyecto
Tipo de proyecto
```

Cada proyecto nuevo debe crear automáticamente una matriz de riesgos unificada independiente.

Dentro de las listas de chequeo, el nivel de deficiencia debe calcularse automáticamente cada vez que se seleccione:

```text
Sí
No
No aplica
```

El cálculo debe actualizarse en tiempo real y no debe requerir guardar previamente.

Agregar dos opciones:

```text
1. Descargar lista de chequeo para campo
2. Descargar lista de chequeo completada
```

El PDF para campo debe estar en blanco y permitir marcar manualmente:

```text
☐ Sí
☐ No
☐ N/A
```

Debe contener toda la información necesaria para identificar:

- Proyecto.
- Proceso.
- Riesgo.
- Lista.
- Evaluador.
- Fecha.
- Ubicación.

Mantener:

```text
NP = ND × NE
NR = NP × NC
```

No considerar finalizada la corrección hasta que:

- Cada proyecto tenga su propia matriz unificada.
- El ND se calcule automáticamente sin guardar.
- La lista de campo pueda descargarse en PDF.
- El PDF pueda llenarse manualmente.
- Los resultados registrados alimenten correctamente las matrices parcial y unificada.
