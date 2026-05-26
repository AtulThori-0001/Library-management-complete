@echo off
SET MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin
SET MAVEN_BIN=C:\Users\atult\Downloads\library_management_complete\maven\apache-maven-3.9.6\bin
SET PROJECT_DIR=C:\Users\atult\Downloads\library_management_complete\output\librarymanagement

echo === Step 1: Creating MySQL database ===
"%MYSQL_BIN%\mysql.exe" -u root -pharsh123 -e "CREATE DATABASE IF NOT EXISTS library_db;"
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL connection failed! Check if MySQL is running and password is correct.
    echo Current password in application.properties: harsh123
    pause
    exit /b 1
)
echo [OK] Database created/verified.

echo.
echo === Step 2: Starting Spring Boot App ===
cd /d "%PROJECT_DIR%"
"%MAVEN_BIN%\mvn.cmd" spring-boot:run

pause
