@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.6 - Test Suite
cls

echo ==============================================================
echo    KIỂM TRA GHÉP VIDEO MẪU H.264 & H.265 (v3.1.6 PRO)
echo ==============================================================
echo.

if exist "python\python.exe" (
    set "PYTHON_EXE=%~dp0python\python.exe"
) else (
    set "PYTHON_EXE=python"
)

%PYTHON_EXE% test_smart_merge.py

echo.
echo ==============================================================
pause
