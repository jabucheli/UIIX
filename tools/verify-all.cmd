@echo off
REM ============================================================
REM Verificación rápida de los slides 5 (Metodología) y 6 (Resultados)
REM Uso:  verify-all.cmd   (sin Screenshot)
REM       verify-all.cmd shot   (con screenshot del mapa)
REM Requisitos: Node.js + npm install en tools/
REM ============================================================
setlocal
set CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe
cd /d "%~dp0"

echo [1/4] Node syntax check...
node --check "..\presentacion-web\js\slides\slide05Methodology.js" || goto :err
node --check "..\presentacion-web\js\data\methodologyData.js" || goto :err
node --check "..\presentacion-web\js\slides\slide06Results.js" || goto :err
node --check "..\presentacion-web\js\slides\slide07Results.js" || goto :err
node --check "..\presentacion-web\js\data\resultsData.js" || goto :err
node --check "..\presentacion-web\js\data\resultsData2.js" || goto :err
node --check "..\presentacion-web\js\data\resultsData3.js" || goto :err
node --check "..\presentacion-web\js\slides\slide08Results.js" || goto :err
node --check "..\presentacion-web\js\slides\slide08Zoom.js" || goto :err
node --check "..\presentacion-web\js\slides\slide08Photos.js" || goto :err
node --check "..\presentacion-web\js\slides\slide08Art.js" || goto :err
node --check "..\presentacion-web\js\data\transformationData.js" || goto :err
node --check "..\presentacion-web\js\slides\slide09EPT.js" || goto :err
node --check "..\presentacion-web\js\data\erTables.js" || goto :err
node --check "..\presentacion-web\js\app.js" || goto :err
echo OK

echo [2/4] jsdom map check (map_check.js)...
node map_check.js || goto :err
node focus_check.js || goto :err

echo [3/4] Generate map + heights harness html...
node gen_map_shot.js || goto :err
node gen_heights.js || goto :err
node gen_results_heights.js || goto :err
node gen_slide7_shot.js || goto :err
node gen_slide8_shot.js || goto :err
node gen_ept_shot.js || goto :err

if /I "%~1"=="shot" (
  echo [4/4] Screenshot con Chrome headless...
  if exist "%CHROME%" (
    call :shot slide05_map.png map_shot.html
    call :shot slide06.png results_shot.html
    call :shot slide06_foco1.png results_shot_f1.html
    call :shot slide06_foco1a.png results_shot_f1a.html
    call :shot slide06_foco1b.png results_shot_f1b.html
    call :shot slide06_foco2.png results_shot_f2.html
    call :shot slide06_foco3.png results_shot_f3.html
    call :shot slide06_foco2a.png results_shot_f2a.html
    call :shot slide06_foco2b.png results_shot_f2b.html
    call :shot slide06_foco3a.png results_shot_f3a.html
    call :shot slide06_foco3b.png results_shot_f3b.html
    call :shot slide06_foco3aimg.png results_shot_f3aimg.html
    call :shot slide06_foco3bimg.png results_shot_f3bimg.html
    call :shot slide07.png res2_shot.html
    call :shot slide07_fne.png res2_shot_fne.html
    call :shot slide07_fnp.png res2_shot_fnp.html
    call :shot slide07_fnc.png res2_shot_fnc.html
    call :shot slide07_fnr.png res2_shot_fnr.html
    call :shot slide07_fni.png res2_shot_fni.html
    call :shotapp slide07_ff1.png res2_shot_ff1.html
    call :shot slide08.png res3_shot.html
    call :shot slide08_fp1.png res3_shot_fp1.html
    call :shot slide08_fp2.png res3_shot_fp2.html
    call :shot slide08_fp3.png res3_shot_fp3.html
    call :shot slide08_fp4.png res3_shot_fp4.html
    call :shot slide08_fp5.png res3_shot_fp5.html
    call :shot slide08_fp6.png res3_shot_fp6.html
    call :shot slide08_fp1i.png res3_shot_fp1i.html
    call :shot slide08_fp2i.png res3_shot_fp2i.html
    call :shot slide08_fp3i.png res3_shot_fp3i.html
    call :shot slide08_fp4i.png res3_shot_fp4i.html
    call :shot slide08_fp5i.png res3_shot_fp5i.html
    call :shot slide08_fp6i.png res3_shot_fp6i.html
    call :shot slide08_fp1z.png res3_shot_f1z.html
    call :shot slide08_fp2z.png res3_shot_f2z.html
    call :shot slide08_foto1.png res3_shot_foto1.html
    call :shot slide08_foto2.png res3_shot_foto2.html
    call :shot slide08_art1.png res3_shot_art1.html
    call :shot slide08_art2.png res3_shot_art2.html
    call :shot md_shot.png md_shot.html
    call :shot md_shot_f1.png md_shot_f1.html
    call :shot md_shot_f2.png md_shot_f2.html
    call :shot md_shot_flt.png md_shot_flt.html
    call :shot md_shot_flb.png md_shot_flb.html
    call :shot md_shot_frt.png md_shot_frt.html
    call :shot md_shot_frb.png md_shot_frb.html
    call :shot md_shot_fcb.png md_shot_fcb.html
    call :shot slide09.png ept_shot.html
    echo Screenshots: out\slide05_map.png, out\slide06.png, out\slide06_foco1-3.png, out\slide06_foco1a-1b.png, out\slide06_foco2a-2b.png, out\slide06_foco3a-3b.png, out\slide06_foco3aimg.png, out\slide06_foco3bimg.png, out\slide07.png, out\slide07_fne-fni.png, out\slide07_ff1.png, out\slide08.png, out\slide08_fp1-fp6.png, out\slide08_fp1i-fp6i.png [nivel 2], out\slide08_fp1z.png, out\slide08_fp2z.png [acercado], out\slide08_foto1.png, out\slide08_foto2.png [galería], out\slide08_art1.png, out\slide08_art2.png [ART], out\slide09.png [EPT], out\md_shot*.png
  ) else (
    echo Chrome no encontrado en la ruta por defecto; omitiendo screenshot.
  )
) else (
  echo [4/4] omitido (usa: verify-all.cmd shot)
)

echo.
echo TODO OK
exit /b 0

:shot
"%CHROME%" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw --virtual-time-budget=5000 --force-device-scale-factor=2 --window-size=1408,720 "--user-data-dir=%TEMP%\openchromeshots_%RANDOM%" --screenshot="%~dp0out\%~1" "file:///%CD:\=/%/out/%~2"
goto :eof

rem La Fotografía 1 aloja la aplicación de tesis/0: sus 16 scripts tardan en
rem cargarse, así que esta captura necesita bastante más tiempo virtual que las
rem demás (si no, sale el marco vacío).
:shotapp
"%CHROME%" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw --virtual-time-budget=40000 --force-device-scale-factor=2 --window-size=1408,720 "--user-data-dir=%TEMP%\openchromeshots_%RANDOM%" --screenshot="%~dp0out\%~1" "file:///%CD:\=/%/out/%~2"
goto :eof

:err
echo.
echo ERROR en la verificacion - revise lo anterior.
exit /b 1