@echo off
setlocal
cd /d "%~dp0"
echo CHORD ATLAS - Pasang mesin Piano AI lokal
where ffmpeg >nul 2>&1
if errorlevel 1 echo PENTING: FFmpeg belum ditemukan. Pasang via winget install Gyan.FFmpeg dan buka ulang terminal.
py -3.10 --version >nul 2>&1
if errorlevel 1 (
 echo Python 3.10 belum ditemukan. Install Python 3.10 x64 dari python.org.
 pause
 exit /b 1
)
py -3.10 -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (
 echo Instalasi gagal. Lihat pesan di atas.
 pause
 exit /b 1
)
echo Pemasangan paket selesai. Klik START_WINDOWS.bat untuk menjalankan.
pause
