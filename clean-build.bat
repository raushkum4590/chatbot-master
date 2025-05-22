@echo off
echo Cleaning up build files...

REM Try to remove the .next directory
if exist ".next" (
  rmdir /s /q ".next"
  echo Removed .next directory
) else (
  echo .next directory does not exist
)

REM Try to clear the npm cache
call npm cache clean --force
echo Cleaned npm cache

REM Delete node_modules and reinstall
if exist "node_modules" (
  rmdir /s /q "node_modules"
  echo Removed node_modules directory
) else (
  echo node_modules directory does not exist
)

REM Install dependencies
call npm install
echo Reinstalled dependencies

REM Run the build
call npm run build

echo Cleanup and build completed!
pause
