# Solicitud de correcciones para identificación del proyecto, evaluaciones múltiples y matriz unificada NTP 330

## 1. Objetivo de la corrección

Corregir la aplicación web existente para:

1. Simplificar el numeral **1. Identificación del proyecto**.
2. Permitir varias evaluaciones correspondientes a diferentes procesos constructivos dentro de un mismo proyecto.
3. Crear una nueva pestaña principal para consolidar todas las matrices parciales.
4. Incorporar análisis estadístico por proceso constructivo y nivel de riesgo.
5. Añadir un botón de retorno automático al numeral 2 después de completar una evaluación por riesgo.
6. Permitir incluir o excluir riesgos mediante una casilla de selección en la matriz del numeral 2.
7. Mantener sin cambios la programación ya desarrollada para calcular:
   - Nivel de deficiencia.
   - Nivel de exposición.
   - Nivel de probabilidad.
   - Nivel de consecuencia.
   - Nivel de riesgo.
   - Nivel de intervención.

---

# 2. Estructura general de las pestañas principales

Actualmente existen las pestañas principales:

```text
Evaluación
Catálogo
Pruebas
Metodología
```

Se debe crear una pestaña adicional denominada:

```text
Matriz unificada y análisis
```

La estructura definitiva del menú principal debe ser:

```text
Evaluación
Matriz unificada y análisis
Catálogo
Pruebas
Metodología
```

La nueva pestaña debe consolidar la información de todas las evaluaciones parciales realizadas en los distintos procesos constructivos.

---

# 3. Corrección del numeral 1: Identificación del proyecto

## 3.1 Campos que deben mantenerse

En el numeral:

```text
1. Identificación del proyecto
```

deben mostrarse únicamente los siguientes campos:

1. Tipo de proyecto.
2. Nombre del proyecto.
3. Proceso constructivo.

No deben mostrarse otros campos dentro de este numeral.

---

## 3.2 Tipo de proyecto

El campo debe denominarse:

```text
Tipo de proyecto
```

Debe ser una lista desplegable obligatoria con únicamente estas opciones:

```text
Estructura
Infraestructura
```

Ejemplo:

```text
Tipo de proyecto: [Seleccionar ▼]

- Estructura
- Infraestructura
```

---

## 3.3 Nombre del proyecto

El campo debe denominarse:

```text
Nombre del proyecto
```

Debe permitir:

- Escribir un proyecto nuevo.
- Seleccionar un proyecto previamente creado.
- Evitar duplicar proyectos con el mismo nombre.
- Mantener vinculadas todas las evaluaciones realizadas para ese proyecto.

El nombre del proyecto será el identificador principal para agrupar las evaluaciones parciales.

---

## 3.4 Proceso constructivo

El campo debe denominarse:

```text
Proceso constructivo
```

La lista desplegable existente está funcionando correctamente y debe mantenerse.

Los procesos deben continuar filtrándose de acuerdo con el tipo de proyecto seleccionado.

La relación debe ser:

```text
Tipo de proyecto
        ↓
Proceso constructivo
```

No modificar la lógica actual de carga de procesos, salvo para permitir varias evaluaciones.

---

# 4. Evaluaciones múltiples por proceso constructivo

## 4.1 Regla general

La aplicación debe permitir que un mismo proyecto tenga varias evaluaciones, correspondientes a diferentes procesos constructivos.

Ejemplo:

```text
Proyecto: Edificio Administrativo Quito

Evaluación 1:
Proceso constructivo: Movimiento de tierras

Evaluación 2:
Proceso constructivo: Cimentaciones

Evaluación 3:
Proceso constructivo: Estructura de hormigón armado

Evaluación 4:
Proceso constructivo: Instalaciones eléctricas
```

Cada evaluación debe conservar su propia matriz parcial de riesgos.

---

## 4.2 Creación de una nueva evaluación

Dentro de la pestaña:

```text
Evaluación
```

debe incorporarse un botón:

```text
+ Nueva evaluación de proceso
```

Al seleccionar este botón, el usuario debe poder:

1. Mantener el tipo de proyecto.
2. Mantener o seleccionar el nombre del proyecto.
3. Elegir otro proceso constructivo.
4. Generar los riesgos asociados.
5. Crear una nueva matriz parcial.
6. Completar la evaluación NTP 330.

---

## 4.3 Identificador de evaluación

Cada evaluación debe tener un identificador único.

Ejemplo:

```text
EVAL-0001
EVAL-0002
EVAL-0003
```

Cada registro debe conservar:

- Identificador de evaluación.
- Nombre del proyecto.
- Tipo de proyecto.
- Proceso constructivo.
- Fecha de creación.
- Fecha de modificación.
- Estado.
- Usuario responsable.
- Versión metodológica.

---

## 4.4 Acceso a evaluaciones anteriores

Dentro de la pestaña “Evaluación” debe mostrarse una sección denominada:

```text
Evaluaciones del proyecto
```

Debe incluir una tabla como la siguiente:

| ID | Proyecto | Tipo | Proceso constructivo | Riesgos incluidos | Estado | Fecha | Acción |
|---|---|---|---|---:|---|---|---|
| EVAL-0001 | Proyecto A | Estructura | Movimiento de tierras | 8 | Completa | 2026-08-04 | Abrir |
| EVAL-0002 | Proyecto A | Estructura | Cimentaciones | 6 | En proceso | 2026-08-04 | Continuar |

Cada evaluación debe poder:

- Abrirse.
- Editarse.
- Continuarse.
- Duplicarse.
- Archivarse.
- Consultarse en modo de solo lectura.
- Vincularse con la matriz unificada.

---

# 5. Numeral 2: Matriz de evaluación de riesgos NTP 330

## 5.1 Mantener la matriz parcial

Dentro de cada evaluación por proceso constructivo se debe mantener:

```text
2. Matriz de evaluación de riesgos NTP 330
```

Esta matriz representa únicamente los riesgos del proceso constructivo seleccionado.

Cada proceso debe tener su propia matriz parcial.

---

## 5.2 Casilla para incluir o excluir riesgos

En el numeral 2 aparecen los riesgos asociados al proceso constructivo.

Se debe agregar una columna inicial denominada:

```text
Incluir
```

Cada riesgo debe mostrar una casilla de selección:

```text
☑ Incluido
☐ Excluido
```

Ejemplo:

| Incluir | Riesgo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|:---:|---|---:|---:|---:|---:|---:|---|---|
| ☑ | Caída a distinto nivel | 8 | 3 | 24 | 60 | 1440 | I | Completo |
| ☐ | Exposición a ruido | — | — | — | — | — | — | Excluido |

---

## 5.3 Funcionamiento de la casilla

Cuando la casilla esté marcada:

```text
☑
```

el riesgo debe:

- Incluirse en el procesamiento.
- Generar su subpestaña en el numeral 3.
- Permitir completar la lista de chequeo.
- Calcular ND, NE, NP, NC, NR y nivel de intervención.
- Registrarse en la matriz parcial.
- Registrarse en la matriz unificada.

Cuando la casilla no esté marcada:

```text
☐
```

el riesgo debe:

- Permanecer visible en la matriz.
- Mostrar estado “Excluido”.
- No generar una evaluación activa.
- No incluirse en cálculos estadísticos.
- No registrarse como riesgo evaluado en la matriz unificada.
- Permitir ser activado posteriormente.

---

## 5.4 Justificación de exclusión

Cuando el usuario desmarque un riesgo inicialmente propuesto, debe aparecer un campo opcional o configurable:

```text
Justificación de exclusión
```

Puede incluir:

- El riesgo no está presente.
- La actividad no se ejecuta.
- El riesgo corresponde a otra fase.
- No existen trabajadores expuestos.
- Otro.

La justificación debe quedar registrada para trazabilidad.

---

## 5.5 Selección masiva

Incorporar opciones:

```text
Seleccionar todos
Desmarcar todos
```

También debe permitirse:

```text
Incluir únicamente riesgos seleccionados
```

No permitir avanzar al numeral 3 si no existe al menos un riesgo incluido.

---

# 6. Numeral 3: Evaluación por riesgo del proceso

Se debe mantener la estructura y programación existentes.

Cada riesgo incluido en el numeral 2 debe generar una subpestaña independiente.

Ejemplo:

```text
[Caída a distinto nivel]
[Contacto eléctrico]
[Proyección de partículas]
[Ruido]
```

Cada subpestaña debe mantener:

```text
3.1 Determinación del nivel de deficiencia ND
3.2 Nivel de exposición NE
3.3 Nivel de probabilidad NP
3.4 Nivel de consecuencia NC
3.5 Nivel de riesgo NR
3.6 Nivel de intervención
```

---

# 7. Botón de retorno automático al numeral 2

## 7.1 Ubicación

Al final de cada subpestaña de evaluación por riesgo, después de completar:

- ND.
- NE.
- NP.
- NC.
- NR.
- Nivel de intervención.

debe aparecer un botón visible denominado:

```text
Guardar y volver a la matriz
```

También puede utilizarse:

```text
Finalizar riesgo y regresar al numeral 2
```

---

## 7.2 Funcionamiento del botón

Al presionar el botón, la aplicación debe:

1. Validar que la evaluación esté completa.
2. Guardar las respuestas de la lista de chequeo.
3. Guardar ND.
4. Guardar NE.
5. Calcular y guardar NP.
6. Guardar NC.
7. Calcular y guardar NR.
8. Determinar y guardar el nivel de intervención.
9. Actualizar la fila correspondiente en el numeral 2.
10. Actualizar la matriz unificada.
11. Marcar la subpestaña como “Completada”.
12. Desplazar automáticamente la pantalla al numeral 2.
13. Resaltar temporalmente la fila del riesgo actualizado.

---

## 7.3 Validaciones

El botón no debe finalizar la evaluación cuando:

- Existan preguntas obligatorias sin responder.
- No exista ND calculado.
- No se haya seleccionado NE.
- No exista NP.
- No se haya seleccionado NC.
- No exista NR.
- No se haya determinado el nivel de intervención.

En estos casos debe mostrar los campos pendientes.

---

# 8. Nueva pestaña: Matriz unificada y análisis

## 8.1 Objetivo

La pestaña:

```text
Matriz unificada y análisis
```

debe consolidar las matrices parciales generadas para los diferentes procesos constructivos de un mismo proyecto.

La relación debe ser:

```text
Proyecto
    ├── Evaluación del proceso 1
    ├── Evaluación del proceso 2
    ├── Evaluación del proceso 3
    └── Evaluación del proceso n
                ↓
Matriz unificada de riesgos
```

---

## 8.2 Selección del proyecto

En la parte superior debe existir una lista desplegable:

```text
Proyecto: [Seleccionar ▼]
```

Al seleccionar un proyecto, la aplicación debe cargar:

- Todas sus evaluaciones.
- Todos los procesos constructivos evaluados.
- Todos los riesgos incluidos.
- Todos los resultados NTP 330.
- Todos los niveles de intervención.

---

## 8.3 Matriz unificada

La matriz unificada debe incluir como mínimo:

| ID evaluación | Tipo de proyecto | Proyecto | Proceso constructivo | Riesgo | ND | NE | NP | NC | NR | Nivel de intervención | Estado |
|---|---|---|---|---|---:|---:|---:|---:|---:|---|---|

También puede incluir:

- Actividad.
- Tarea.
- Peligro.
- Fuente generadora.
- Posibles consecuencias.
- Lista de chequeo.
- Fecha.
- Evaluador.
- Controles existentes.
- Controles propuestos.
- Riesgo residual.

---

## 8.4 Reglas de consolidación

La matriz unificada debe:

- Incluir únicamente riesgos marcados como incluidos.
- Vincular cada fila con su evaluación parcial.
- Evitar duplicados.
- Mantener el identificador de evaluación.
- Actualizarse automáticamente.
- Conservar el proceso constructivo de origen.
- Permitir abrir la evaluación parcial.
- Mostrar la última versión vigente.
- Mantener el histórico de cambios.

---

## 8.5 Actualización automática

La matriz unificada debe actualizarse cuando:

- Se cree una nueva evaluación.
- Se complete un riesgo.
- Se modifique ND.
- Se modifique NE.
- Se recalcule NP.
- Se modifique NC.
- Se recalcule NR.
- Cambie el nivel de intervención.
- Se incluya o excluya un riesgo.
- Se archive una evaluación.
- Se elimine lógicamente una evaluación.

---

# 9. Análisis estadístico por proceso constructivo

## 9.1 Objetivo

Dentro de la pestaña “Matriz unificada y análisis” debe existir un apartado:

```text
Análisis estadístico
```

El análisis debe utilizar los riesgos consolidados del proyecto seleccionado.

---

## 9.2 Agrupación principal

Los resultados deben agruparse principalmente por:

```text
Proceso constructivo
```

Para cada proceso se debe calcular:

- Número total de riesgos incluidos.
- Número de riesgos evaluados.
- Número de riesgos pendientes.
- Promedio de ND.
- Promedio de NE.
- Promedio de NP.
- Promedio de NC.
- Promedio de NR.
- NR mínimo.
- NR máximo.
- Mediana de NR.
- Distribución por nivel de intervención.
- Porcentaje de riesgos por categoría.
- Riesgo más crítico.
- Riesgo con menor valoración.

---

## 9.3 Tabla estadística por proceso

Mostrar una tabla como:

| Proceso constructivo | Riesgos evaluados | NR promedio | NR máximo | Nivel I | Nivel II | Nivel III | Nivel IV |
|---|---:|---:|---:|---:|---:|---:|---:|

Los niveles deben ajustarse a la clasificación configurada en la NTP 330.

---

## 9.4 Gráficos mínimos

Incorporar como mínimo:

### Gráfico 1. Riesgos por proceso constructivo

Mostrar la cantidad de riesgos evaluados en cada proceso.

### Gráfico 2. Nivel de riesgo promedio por proceso

Comparar el NR promedio entre procesos.

### Gráfico 3. Distribución de niveles de intervención

Mostrar cuántos riesgos pertenecen a cada nivel de intervención.

### Gráfico 4. Riesgos críticos por proceso

Mostrar los riesgos con mayor NR dentro de cada proceso.

### Gráfico 5. Matriz de calor

Relacionar:

```text
Proceso constructivo
vs.
Nivel de riesgo o nivel de intervención
```

---

## 9.5 Filtros

El análisis debe permitir filtrar por:

- Proyecto.
- Tipo de proyecto.
- Proceso constructivo.
- Riesgo.
- Nivel de intervención.
- Estado.
- Fecha.
- Evaluador.
- Rango de NR.

---

## 9.6 Reglas estadísticas

Para los análisis:

- No incluir riesgos excluidos.
- No incluir evaluaciones incompletas en promedios finales, salvo que se indique.
- Identificar claramente datos pendientes.
- No mezclar proyectos.
- Mantener la relación con la evaluación de origen.
- Mostrar el número de observaciones utilizadas.
- Permitir exportar los resultados.

---

# 10. Exportación de la matriz unificada

La pestaña debe permitir exportar:

- Matriz unificada a Excel.
- Matriz unificada a CSV.
- Matriz unificada a PDF.
- Resumen estadístico a PDF.
- Gráficos como imágenes.
- Reporte por proceso constructivo.

El reporte debe incluir:

- Nombre del proyecto.
- Tipo de proyecto.
- Procesos evaluados.
- Número de evaluaciones.
- Número de riesgos.
- Distribución de niveles de riesgo.
- Distribución de niveles de intervención.
- Fecha de generación.
- Versión metodológica.

---

# 11. Navegación entre matrices

Debe permitirse:

```text
Matriz unificada
        ↓
Abrir evaluación parcial
        ↓
Abrir subpestaña del riesgo
```

Y también:

```text
Subpestaña del riesgo
        ↓
Guardar y volver a matriz parcial
        ↓
Acceder a matriz unificada
```

No se deben duplicar datos entre pantallas.

---

# 12. Conservación de la lógica de cálculo

No modificar las fórmulas existentes:

```text
NP = ND × NE
```

```text
NR = NP × NC
```

También puede mostrarse:

```text
NR = ND × NE × NC
```

Mantener:

- Cálculo automático de ND.
- Selección de NE.
- Cálculo automático de NP.
- Selección de NC.
- Cálculo automático de NR.
- Determinación automática del nivel de intervención.
- Actualización en tiempo real.
- Trazabilidad.

---

# 13. Modelo de datos requerido

Para permitir varias evaluaciones se debe conservar una estructura similar a:

```text
Proyecto
└── Evaluación de proceso
    ├── Proceso constructivo
    ├── Riesgos propuestos
    ├── Riesgos incluidos
    ├── Riesgos excluidos
    ├── Listas de chequeo
    ├── Resultados NTP 330
    └── Estado
```

Cada fila de la matriz unificada debe conservar:

- ID del proyecto.
- ID de la evaluación.
- ID del proceso.
- ID del riesgo.
- Estado de inclusión.
- Resultados.
- Versión.
- Fecha.

---

# 14. Validaciones obligatorias

La aplicación debe impedir:

- Crear una evaluación sin proyecto.
- Crear una evaluación sin tipo de proyecto.
- Crear una evaluación sin proceso.
- Duplicar accidentalmente la misma evaluación.
- Evaluar un riesgo excluido.
- Incluir en estadísticas un riesgo excluido.
- Guardar una evaluación incompleta como final.
- Mostrar datos de otro proyecto en la matriz unificada.
- Perder la vinculación entre matrices.
- Modificar resultados consolidados directamente sin editar la evaluación parcial.

---

# 15. Criterios de aceptación

La corrección estará completa cuando:

1. El numeral 1 contenga únicamente:
   - Tipo de proyecto.
   - Nombre del proyecto.
   - Proceso constructivo.
2. Tipo de proyecto permita únicamente:
   - Estructura.
   - Infraestructura.
3. Se puedan crear varias evaluaciones para diferentes procesos.
4. Se puedan abrir evaluaciones anteriores.
5. Cada evaluación tenga una matriz parcial.
6. El numeral 2 tenga una casilla de inclusión por riesgo.
7. Los riesgos excluidos no se procesen.
8. Cada evaluación completada vuelva automáticamente al numeral 2.
9. Exista la pestaña “Matriz unificada y análisis”.
10. La matriz unificada consolide todas las evaluaciones del proyecto.
11. Se mantenga el vínculo con las matrices parciales.
12. Exista análisis estadístico por proceso constructivo.
13. Se generen gráficos de niveles de riesgo.
14. Los resultados se actualicen automáticamente.
15. Se mantengan las fórmulas NTP 330.
16. Se preserve la trazabilidad completa.

---

# 16. Instrucción final para el desarrollador

Corrige la aplicación existente sin eliminar la programación ya implementada.

Dentro del numeral:

```text
1. Identificación del proyecto
```

mantener únicamente:

```text
Tipo de proyecto
Nombre del proyecto
Proceso constructivo
```

Permitir que un mismo proyecto contenga varias evaluaciones para diferentes procesos constructivos.

Agregar la pestaña principal:

```text
Matriz unificada y análisis
```

Esta pestaña debe consolidar las matrices parciales de todos los procesos evaluados y permitir análisis estadístico de los niveles de riesgo agrupados por proceso constructivo.

En el numeral:

```text
2. Matriz de evaluación de riesgos NTP 330
```

agregar una casilla para incluir o excluir cada riesgo del procesamiento.

Al final de cada evaluación por riesgo, agregar:

```text
Guardar y volver a la matriz
```

Este botón debe guardar los resultados, actualizar las matrices y regresar automáticamente al numeral 2.

Mantener las fórmulas:

```text
NP = ND × NE
NR = NP × NC
```

No considerar finalizada la corrección hasta que:

- Se puedan crear varias evaluaciones por proyecto.
- Las matrices parciales se consoliden correctamente.
- Los riesgos puedan incluirse o excluirse.
- El análisis estadístico funcione por proceso constructivo.
- La navegación entre evaluación parcial y matriz unificada sea completa.
