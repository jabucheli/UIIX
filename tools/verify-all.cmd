@echo off
REM ============================================================
REM Verificación completa de la presentación (12 slides):
REM   sintaxis + map_check (54) + focus_check (770) + harness + capturas.
REM Uso:  verify-all.cmd   (sin Screenshot)
REM       verify-all.cmd shot   (con screenshots en tools\out\)
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
node --check "..\presentacion-web\js\data\validationData.js" || goto :err
node --check "..\presentacion-web\js\slides\slide10Validation.js" || goto :err
node --check "..\presentacion-web\js\data\conclusionsData.js" || goto :err
node --check "..\presentacion-web\js\slides\slide11Conclusions.js" || goto :err
node --check "..\presentacion-web\js\data\recomendacionesData.js" || goto :err
node --check "..\presentacion-web\js\slides\slide12Recomendaciones.js" || goto :err
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
node gen_slide10_shot.js || goto :err
node gen_slide11_shot.js || goto :err
node gen_slide12_shot.js || goto :err

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
    call :shot slide09_f1.png ept_shot_f1.html
    call :shot slide09_f2.png ept_shot_f2.html
    call :shot slide09_f2img.png ept_shot_f2img.html
    call :shot slide09_f3.png ept_shot_f3.html
    call :shot slide09_frs.png ept_shot_frs.html
    call :shot slide10.png vl_shot.html
    call :shot slide10_fr1.png vl_shot_fr1.html
    call :shot slide10_fr2.png vl_shot_fr2.html
    call :shot slide10_fr3.png vl_shot_fr3.html
    call :shot slide10_frn.png vl_shot_frn.html
    call :shot slide11.png cn_shot.html
    call :shot slide11_zoom1.png cn_shot_fzb1.html
    call :shot slide11_zoom2.png cn_shot_fzb2.html
    call :shot slide11_zoom3.png cn_shot_fzb3.html
    call :shot slide11_zoom4.png cn_shot_fzb4.html
    call :shot slide11_zoom5.png cn_shot_fzb5.html
    call :shot slide11_zoom6.png cn_shot_fzb6.html
    call :shot slide11_fb1.png cn_shot_fb1.html
    call :shot slide11_fb2.png cn_shot_fb2.html
    call :shot slide11_fb3.png cn_shot_fb3.html
    call :shot slide11_fb4.png cn_shot_fb4.html
    call :shot slide11_fb5.png cn_shot_fb5.html
    call :shot slide11_fb6.png cn_shot_fb6.html
    call :shot slide12.png rc_shot.html
    call :shot slide12_frc1.png rc_shot_frc1.html
    call :shot slide12_frc2.png rc_shot_frc2.html
    call :shot slide12_frc3.png rc_shot_frc3.html
    call :shot slide12_frc4.png rc_shot_frc4.html
    call :shot slide12_frc5.png rc_shot_frc5.html
    call :shot slide12_frc6.png rc_shot_frc6.html
    echo Screenshots: out\slide05_map.png, out\slide06.png, out\slide06_foco1-3.png, out\slide06_foco1a-1b.png, out\slide06_foco2a-2b.png, out\slide06_foco3a-3b.png, out\slide06_foco3aimg.png, out\slide06_foco3bimg.png, out\slide07.png, out\slide07_fne-fni.png, out\slide07_ff1.png, out\slide08.png, out\slide08_fp1-fp6.png, out\slide08_fp1i-fp6i.png [nivel 2], out\slide08_fp1z.png, out\slide08_fp2z.png [acercado], out\slide08_foto1.png, out\slide08_foto2.png [galería], out\slide08_art1.png, out\slide08_art2.png [ART], out\slide09.png [EPT], out\slide09_f1-f2.png [pt1/pt2], out\slide09_f2img.png [riesgos en paralelo], out\slide09_f3.png [pt3+pt4 en paralelo], out\slide09_frs.png [resultado esperado], out\slide10.png [Validación], out\slide10_fr1-fr3.png, out\slide10_frn.png, out\slide11.png [Conclusiones], out\slide11_zoom1-6.png [bloque agrandado], out\slide11_fb1-fb6.png [conclusión], out\slide12.png [Recomendaciones], out\slide12_frc1-frc6.png [detalle ampliado], out\md_shot*.png
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