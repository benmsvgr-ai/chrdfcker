@echo off
cd /d "%~dp0"
if not exist .venv\Scripts\python.exe (
 echo Mesin belum dipasang. Jalankan INSTALL_WINDOWS.bat terlebih dahulu.
 pause
 exit /b 1
)
echo Mesin lokal siap di http://127.0.0.1:8765/health
.venv\Scripts\python.exe server.py
pause
