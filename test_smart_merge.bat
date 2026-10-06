@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
cd /d "%~dp0"
title Fast Video Cutter and Merger Studio v3.1.6 - Test Suite
cls

echo ==============================================================
echo    FAST VIDEO CUTTER AND MERGER STUDIO v3.1.6 PRO - TEST SUITE
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