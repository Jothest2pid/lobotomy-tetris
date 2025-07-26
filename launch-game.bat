@echo off
title Lobotomy Tetris Launcher
echo.
echo ========================================
echo    🧠 LOBOTOMY TETRIS LAUNCHER 🧠
echo ========================================
echo.
echo Starting Lobotomy Tetris...
echo Opening in your default browser...
echo.

REM Get the directory where this batch file is located
set "GAME_DIR=%~dp0"

REM Try to open the HTML file in the default browser
start "" "%GAME_DIR%index.html"

REM Check if the file was opened successfully
if %errorlevel% equ 0 (
    echo ✅ Game launched successfully!
    echo.
    echo The game should now be open in your browser.
    echo You can close this window.
) else (
    echo ❌ Failed to launch the game automatically.
    echo.
    echo Please manually open: %GAME_DIR%index.html
    echo in your web browser.
)

echo.
echo Press any key to close this launcher...
pause >nul
