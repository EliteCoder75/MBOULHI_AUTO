@echo off
echo ========================================
echo   MBOULHI AUTO - Serveur Local
echo ========================================
echo.
echo Demarrage du serveur...
echo.
echo Le site sera accessible a l'adresse :
echo http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
