@echo off
REM CBR AI Discovery Tool - Auto-start script
REM Runs the Next.js app in production mode on port 3010

cd /d "c:\Users\atava\Github Repo\CBR-AI-Discovery-Tool"

REM Build if .next folder doesn't exist
if not exist ".next" (
    call npm run build
)

REM Start the production server on port 3010
call npm run start
