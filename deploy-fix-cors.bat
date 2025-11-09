@echo off
echo ========================================
echo DEPLOY FIX CORS - SOLUCION DEFINITIVA
echo ========================================
echo.

echo [1/4] Limpiando cambios locales...
git reset --hard HEAD
git clean -fd

echo.
echo [2/4] Descargando ultima version con fix CORS...
git fetch origin claude/revisa-todo-proyecto-ventasapp-011CUvnBdc5ijcMwnib3B8Bh
git checkout claude/revisa-todo-proyecto-ventasapp-011CUvnBdc5ijcMwnib3B8Bh
git reset --hard origin/claude/revisa-todo-proyecto-ventasapp-011CUvnBdc5ijcMwnib3B8Bh

echo.
echo [3/4] Verificando version correcta...
git log --oneline -3
echo.
echo DEBE aparecer: "FIX DEFINITIVO: Resolver error CORS de Tailwind CSS"
echo.

pause

echo.
echo [4/4] Desplegando a Firebase...
firebase deploy --only hosting

echo.
echo ========================================
echo DEPLOY COMPLETADO!
echo ========================================
echo.
echo IMPORTANTE: Ahora haz lo siguiente:
echo 1. Abre: https://distribuidor-autorizado-f08bf.web.app
echo 2. Presiona: Ctrl + Shift + R (hard refresh)
echo 3. Espera 5 segundos
echo 4. Presiona F12 y busca en Console
echo 5. Ya NO deberia aparecer error CORS de Tailwind
echo.
pause
