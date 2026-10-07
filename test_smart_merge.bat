@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.2.3 - Test Suite
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.2.3 PRO - TEST SUITE
echo ==============================================================
echo.

python test_smart_merge.py
if errorlevel 1 (
    py -3 test_smart_merge.py
)
pause
