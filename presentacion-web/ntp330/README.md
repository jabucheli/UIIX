# NTP 330 — módulo integrado de la presentación

La aplicación de evaluación de riesgos forma parte del proyecto **presentacion**.
El bloque **Riesgo** del slide 7 abre `0/index.html` desde esta carpeta.

- **Trabajar y abrir:** `iniciar.cmd` en la raíz de `presentacion`.
- **Verificar presentación y app:** `iniciar.cmd app` o `tools\reanudar.cmd app`.
- **Guardar:** `guardar.cmd` en la raíz; incluye este módulo, sus fuentes y los
  respaldos JSON exportados.
- **App directamente:** abrir `0/index.html`.
- **Reglas y estado:** `AGENTS.md` y `0/docs/ESTADO.md`.

Los documentos originales de la app (`330.pdf`, `nd.xlsx`, `matriz.xlsx`, los
`.docx` y las correcciones) están en esta misma carpeta. `ORIGEN.json` registra
la incorporación y los hashes originales; `historial-origen.bundle` conserva
el historial anterior para consulta. El historial de trabajo actual es el del
repositorio principal `presentacion`.

Las evaluaciones y ajustes del catálogo se guardan en el navegador. Su respaldo
se exporta desde **Catálogo → Copia de seguridad** y se guarda en
`0/pruebas/out/respaldos/`. Ver `RESPALDO.md` en la raíz del proyecto.
