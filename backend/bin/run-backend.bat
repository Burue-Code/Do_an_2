@echo off
cd /d "%~dp0"
chcp 65001 >nul
echo ========================================
echo   Backend Movie Recommendation
echo   http://localhost:8080
echo ========================================
echo.

REM Mac dinh dung profile mysql55 (tat Flyway) de chay voi MariaDB/MySQL 5.5 (XAMPP).
REM Neu ban dung MySQL 8 va muon bat Flyway: set USE_MYSQL55=0 roi chay lai.
set "JAVA_OPTS="
set "JVM_OPTS="
if not "%USE_MYSQL55%"=="0" (
    echo [Profile: dev,mysql55 - cho MariaDB/MySQL 5.5 ^(XAMPP^)]
    set "JAVA_OPTS=--spring.profiles.active=dev,mysql55"
    set "JVM_OPTS=-Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration"
)

if exist "target\movierecommendation-0.0.1-SNAPSHOT.jar" (
    echo Dang chay bang file JAR...
    echo.
    java %JVM_OPTS% -jar target\movierecommendation-0.0.1-SNAPSHOT.jar %JAVA_OPTS%
) else (
    echo Chua co file JAR. Dang build...
    call mvn package -DskipTests -q
    if exist "target\movierecommendation-0.0.1-SNAPSHOT.jar" (
        echo.
        echo Dang chay bang file JAR...
        java %JVM_OPTS% -jar target\movierecommendation-0.0.1-SNAPSHOT.jar %JAVA_OPTS%
    ) else (
        echo LOI: Build that bai. Thu chay Maven voi profile mysql55...
        if not "%USE_MYSQL55%"=="0" (
            call mvn spring-boot:run -Dspring-boot.run.profiles=dev,mysql55 -Dspring-boot.run.jvmArguments="-Dspring.autoconfigure.exclude=org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration"
        ) else (
            call mvn spring-boot:run
        )
    )
)

echo.
pause
