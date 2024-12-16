@echo off
setlocal enabledelayedexpansion

:: Prompt for the password (hidden input)
set /p password="Enter the password: "<nul
for /f "delims=" %%p in ('powershell -command "$pword = Read-Host 'Enter the password' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword))"') do set password=%%p
echo.

:: Define script directory
for %%i in (%~dp0) do set SCRIPTS_DIR=%%~fi
echo Scripts Dir: %SCRIPTS_DIR%

:: Load configuration
for /f "tokens=* delims=" %%a in (%SCRIPTS_DIR%scripts-config.txt) do set %%a

:: Remote directory
set remote_directory=%REMOTE_SERVER%:/opt/configs/japanese-reviews-next

:: Create WinSCP commands file
set WINSCP_SCRIPT=%SCRIPTS_DIR%winscp-script.txt
(
echo open sftp://%REMOTE_SERVER% -password="%password%"
echo cd /opt/configs/japanese-reviews-next
echo put "%SCRIPTS_DIR%..\src\resources\kanji_full.json"
echo put "%SCRIPTS_DIR%..\src\resources\vocabulary_full.json"
echo put "%SCRIPTS_DIR%..\src\resources\kanji_full_reduced.json"
echo put "%SCRIPTS_DIR%..\src\resources\compound_verbs.json"
echo put "%SCRIPTS_DIR%..\src\resources\compound_verbs_proto.json"
echo put "%SCRIPTS_DIR%..\src\resources\similarity-dictionary.txt"
echo exit
) > "%WINSCP_SCRIPT%"

:: Run WinSCP commands
WinSCP.com /script="%WINSCP_SCRIPT%"

:: Clean up
del "%WINSCP_SCRIPT%"

echo Finished!
pause
