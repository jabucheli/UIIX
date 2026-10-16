# Respaldo automático de `presentacion` + `tesis`

Proceso anti-pérdida: una sola orden deja todo guardado y con historial.

```bash
cd tools
respaldo.cmd              # verificación + commit git + zip rotativo
respaldo.cmd ahora        # lo mismo, nombre legible
respaldo.cmd estado       # qué hay sin commitear, respaldos, log y tarea
respaldo.cmd agendar      # tarea programada diaria a las 18:00
respaldo.cmd agendar 20:30   # idem, a la hora que se indique
respaldo.cmd quitar       # elimina la tarea programada
```

**La regla clave:** nunca se salta un respaldo porque las verificaciones
estén en rojo. Se avisa, se commitea lo que haya y se empaqueta igualmente.
Guardar trabajo malo es mejor que perder trabajo bueno.

---

## 1. Por qué van juntas las dos carpetas

`presentacion\` (esta presentación web) y `tesis\` (la app de evaluación NTP 330)
son carpetas hermanas: el **slide 7** embebe la app desde `..\..\tesis\0\index.html`.
Si una desaparece, la otra queda coja. Por eso el respaldo siempre las empaqueta
las dos en el mismo zip, con un `LEEME.txt` que lo explica.

## 2. Qué hace cada fase

| Fase | Qué pasa |
|---|---|
| 1. Verificación | `map_check.js` + `focus_check.js`. Si salen en rojo se avisa, **pero no se aborta**. |
| 2. Git | `git add -A` + commit en cada repo con cambios. Mensaje: `Respaldo automatico AAAAMMDD-HHMM (N archivo(s))`. |
| 3. Copia | `robocopy` de las dos carpetas a `%TEMP%\respaldo\tree`, **sin** `.git`, `node_modules`, `tools\out` ni temporales de Office. |
| 4. Empaque | `traspaso-empaquetar.ps1` → zip con raíces `presentacion\`, `tesis\`, `LEEME.txt`, los dos `historial-*.bundle` y `datos-respaldo\`. |
| 5. Rotación | Se conservan los últimos **14** zips; el resto se borra. Se escribe la línea de resumen en el log. |

Los dos `.bundle` son el historial git completo (`--all`): con ellos se puede
reclonar el repo entero en otro equipo sin necesitar GitHub.

## 3. Dónde se guardan

```text
D:\ejemplo\respaldos\
├── presentacion-tesis-20261016-1808.zip
├── presentacion-tesis-20261016-1813.zip
└── respaldo.log          una línea por ejecución
```

Está **fuera** de las carpetas del proyecto a propósito: si algo rompe
`presentacion\` o `tesis\`, los respaldos no se llevan por delante.

Para más seguridad se puede apuntar a un disco externo o a una carpeta
sincronizada, sin tocar el script:

```bash
set RESPALDO_DIR=E:\respaldos    (en la misma sesión, antes de respaldo.cmd)
```

## 4. Tarea programada

`respaldo.cmd agendar` crea la tarea **«Respaldo Presentacion Tesis»**, diaria
a las 18:00, que ejecuta `respaldo.cmd ahora`. Abre una ventana de consola unos
segundos y se cierra sola.

- Cambiar la hora: `respaldo.cmd agendar 20:30`
- Eliminarla: `respaldo.cmd quitar`
- Ver si está y cuándo corre: `respaldo.cmd estado`

## 5. Restaurar en este u otro equipo

Igual que un traspaso normal (`TRASPASO.md`), leyendo el `LEEME.txt` que lleva
el propio zip:

1. Instalar Node.js 22 o superior.
2. Descomprimir manteniendo `presentacion\` y `tesis\` en la **misma** carpeta madre.
3. `cd presentacion\tools` y `npm install`.
4. Doble clic en `presentacion\iniciar.cmd` (o `reanudar.cmd`).
5. Historial git: `git clone historial-presentacion.bundle presentacion`
   y `git clone historial-tesis.bundle tesis`.

## 6. Cómo saber que está funcionando

```bash
respaldo.cmd estado
```

Debe mostrar `cambios sin commitear: 0` en ambos repos, los zips ordenados por
fecha, las últimas líneas del log y `proxima ejecucion: …` de la tarea.

## 7. Reglas si se toca `respaldo.cmd`

- Los contadores son `for /f … do set /a N+=1`: **no usar `find /c /v ""`**,
  porque en esta máquina `find` puede resolverse al find de MSYS y barre todo el disco.
- No usar bloques parentizados `( … )` con saltos de línea dentro: son frágiles
  en `cmd` (convención ya heredada por `traspaso.cmd`).
- La identidad del commit va inline (`git -c user.name=… -c user.email=…`);
  **no** se toca la config global de git para esto.
- El commit nunca puede bloquear el empaquetado: si falla, se avisa y el zip se
  hace igualmente.
