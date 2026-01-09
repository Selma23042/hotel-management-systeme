pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'CLEAN_MAVEN_CACHE', defaultValue: false, description: 'Clean Maven local repository before build')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
    }
    
    
    
    environment {
    PROJECT_NAME = 'hotel-management'
    JAVA_HOME = 'C:\\Program Files\\java\\jdk-17'
    MAVEN_HOME = 'C:\\apache-maven-3.9.9'
    MAVEN_LOCAL_REPO = "${env.WORKSPACE}\\.m2\\repository"
    
    // CORRIGER LE PATH - Ajouter Git\cmd (pas Git\bin)
    PATH = "C:\\Program Files\\Git\\cmd;${JAVA_HOME}\\bin;${MAVEN_HOME}\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Windows\\System32;${env.PATH}"
    
    KUBE_NAMESPACE = 'hotel-management'
    
    // OPTIMISER MAVEN - enlever MaxPermSize
    MAVEN_OPTS = '-Xmx2048m -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=120'
    
    // Variables pour les retry
    DOCKER_BUILD_RETRY_COUNT = '3'
    DOCKER_BUILD_TIMEOUT_MINUTES = '15'
}
    tools {
        maven 'Maven-3.9'
        nodejs 'NodeJS-18'
        jdk 'JDK-17'
    }
    stages {
        stage('Clean Maven Cache') {
            when {
                expression { params.CLEAN_MAVEN_CACHE == true }
            }
            steps {
                echo '🧹 Cleaning Maven cache...'
                bat '''
                    if exist "%MAVEN_LOCAL_REPO%" (
                        echo Deleting Maven local repository...
                        rmdir /s /q "%MAVEN_LOCAL_REPO%"
                        echo Maven cache cleaned
                    )
                    mkdir "%MAVEN_LOCAL_REPO%"
                '''
            }
        }
        
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying environment...'
                bat '''
                    echo Java version:
                    java -version
                    echo.
                    echo Maven version:
                    mvn -version
                    echo.
                    echo Docker version:
                    docker --version
                    echo.
                    echo Kubernetes version:
                    kubectl version --client
                    echo.
                    echo Node version:
                    node --version
                    echo.
                    echo JAVA_HOME: %JAVA_HOME%
                    echo MAVEN_HOME: %MAVEN_HOME%
                    echo Maven Local Repository: %MAVEN_LOCAL_REPO%
                    echo MAVEN_OPTS: %MAVEN_OPTS%
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }
        
        stage('Create Maven Settings') {
            steps {
                script {
                    echo '⚙️ Creating optimized Maven settings...'
                    writeFile file: "${env.WORKSPACE}\\settings.xml", text: '''<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 
          http://maven.apache.org/xsd/settings-1.0.0.xsd">
    
    <localRepository>${env.MAVEN_LOCAL_REPO}</localRepository>
    
    <mirrors>
        <mirror>
            <id>google-maven-central</id>
            <mirrorOf>central</mirrorOf>
            <name>Google Maven Central</name>
            <url>https://maven-central.storage-download.googleapis.com/maven2/</url>
        </mirror>
    </mirrors>
    
    <profiles>
        <profile>
            <id>fast-download</id>
            <properties>
                <downloadSources>false</downloadSources>
                <downloadJavadocs>false</downloadJavadocs>
            </properties>
        </profile>
    </profiles>
    
    <activeProfiles>
        <activeProfile>fast-download</activeProfile>
    </activeProfiles>
</settings>'''
                    echo '✅ Maven settings created'
                }
            }
        }
        
        stage('Verify Project Structure') {
            steps {
                echo '🔍 Verifying project structure...'
                bat '''
                    echo Current directory:
                    cd
                    echo.
                    echo Workspace contents:
                    dir /b
                    echo.
                    echo Checking hotel-parent:
                    dir /b hotel-parent
                    echo.
                    echo Checking microservices:
                    dir /b microservices
                    echo.
                    echo Checking eureka-server:
                    dir /b microservices\\eureka-server\\eureka-serve
                    echo.
                    echo Checking frontend:
                    dir /b frontend\\hotel-angular-app
                '''
            }
        }
        
        stage('Install Parent POM') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                echo '📦 Installing parent POM...'
                dir('hotel-parent') {
                    retry(2) {
                        bat """
                            mvn clean install -N -DskipTests ^
                            -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                            -s %WORKSPACE%\\settings.xml ^
                            --batch-mode ^
                            --no-transfer-progress
                        """
                    }
                }
            }
        }
        
        stage('Download All Dependencies') {
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '📥 Pre-downloading all Maven dependencies...'
                    
                    def pomFiles = [
                        'microservices/eureka-server/eureka-serve/pom.xml',
                        'microservices/api-gateway/api-gateway/pom.xml',
                        'microservices/room-service/room-service/pom.xml',
                        'microservices/customer-service/customer-service/pom.xml',
                        'microservices/booking-service/booking-service/pom.xml',
                        'microservices/billing-service/billing-service/pom.xml'
                    ]
                    
                    pomFiles.each { pomFile ->
                        echo "📦 Resolving dependencies for ${pomFile}..."
                        timeout(time: 10, unit: 'MINUTES') {
                            bat """
                                mvn dependency:resolve -f ${pomFile} ^
                                -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                -s %WORKSPACE%\\settings.xml ^
                                --batch-mode ^
                                --no-transfer-progress || echo "Warning: Some dependencies may have failed for ${pomFile}"
                            """
                        }
                    }
                }
            }
        }
        
        stage('Build Backend Services') {
            options {
                timeout(time: 45, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🔧 Building all backend services sequentially...'
                    
                    def services = [
                        [name: 'Eureka Server', path: 'microservices/eureka-server/eureka-serve'],
                        [name: 'API Gateway', path: 'microservices/api-gateway/api-gateway'],
                        [name: 'Room Service', path: 'microservices/room-service/room-service'],
                        [name: 'Customer Service', path: 'microservices/customer-service/customer-service'],
                        [name: 'Booking Service', path: 'microservices/booking-service/booking-service'],
                        [name: 'Billing Service', path: 'microservices/billing-service/billing-service']
                    ]
                    
                    services.each { service ->
                        timeout(time: 10, unit: 'MINUTES') {
                            echo "🔧 Building ${service.name}..."
                            dir(service.path) {
                                retry(2) {
                                    bat """
                                        mvn clean compile -DskipTests ^
                                        -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                        -s %WORKSPACE%\\settings.xml ^
                                        --batch-mode ^
                                        --no-transfer-progress
                                    """
                                }
                            }
                            echo "✅ ${service.name} built successfully"
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }
            steps {
                echo '🎨 Building Frontend...'
                dir('frontend/hotel-angular-app') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Run Tests') {
            when {
                expression { params.SKIP_TESTS == false }
            }
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🧪 Running tests...'
                    
                    def services = [
                        [name: 'Room Service', path: 'microservices/room-service/room-service'],
                        [name: 'Customer Service', path: 'microservices/customer-service/customer-service'],
                        [name: 'Booking Service', path: 'microservices/booking-service/booking-service'],
                        [name: 'Billing Service', path: 'microservices/billing-service/billing-service']
                    ]
                    
                    services.each { service ->
                        timeout(time: 8, unit: 'MINUTES') {
                            echo "🧪 Testing ${service.name}..."
                            dir(service.path) {
                                bat """
                                    mvn test ^
                                    -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                    -s %WORKSPACE%\\settings.xml ^
                                    --batch-mode ^
                                    --no-transfer-progress || echo "Tests failed for ${service.name}"
                                """
                            }
                        }
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Package Services') {
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '📦 Packaging all services...'
                    
                    def services = [
                        [name: 'Eureka Server', path: 'microservices/eureka-server/eureka-serve'],
                        [name: 'API Gateway', path: 'microservices/api-gateway/api-gateway'],
                        [name: 'Room Service', path: 'microservices/room-service/room-service'],
                        [name: 'Customer Service', path: 'microservices/customer-service/customer-service'],
                        [name: 'Booking Service', path: 'microservices/booking-service/booking-service'],
                        [name: 'Billing Service', path: 'microservices/billing-service/billing-service']
                    ]
                    
                    services.each { service ->
                        timeout(time: 8, unit: 'MINUTES') {
                            echo "📦 Packaging ${service.name}..."
                            dir(service.path) {
                                bat """
                                    mvn package -DskipTests ^
                                    -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                    -s %WORKSPACE%\\settings.xml ^
                                    --batch-mode ^
                                    --no-transfer-progress
                                """
                            }
                            echo "✅ ${service.name} packaged successfully"
                        }
                    }
                }
            }
        }
        
        stage('Prepare Docker Environment') {
    steps {
        script {
            echo '🐳 Creating Docker startup script...'
            
            // Créer le script directement dans le workspace
            writeFile file: "${env.WORKSPACE}\\start-docker.bat", text: '''@echo off
echo ===== DOCKER QUICK START =====
echo %DATE% %TIME%

REM Vérifier si Docker est déjà en cours d'exécution
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker is already running
    goto :ready
)

echo ⚠️ Docker is not running, starting Docker Desktop...

REM Arrêter Docker s'il est en cours d'exécution (proprement)
taskkill /f /im "Docker Desktop.exe" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Stopped Docker Desktop
    timeout /t 5 /nobreak >nul
)

REM Démarrer Docker Desktop
echo Starting Docker Desktop...
start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"

REM Attendre que Docker soit prêt
echo Waiting for Docker daemon...
set max_wait=120
set waited=0

:wait_loop
timeout /t 5 /nobreak >nul
set /a waited+=5

docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker ready after %waited% seconds
    goto :ready
)

echo ⏳ Still waiting... (%waited%/%max_wait% seconds)

if %waited% lss %max_wait% goto :wait_loop

echo ❌ ERROR: Docker failed to start in %max_wait% seconds
echo Please start Docker Desktop manually
exit /b 1

:ready
echo.
echo ✅ Docker is ready for build!
docker --version
echo.
'''
            
            // Exécuter le script
            bat 'call %WORKSPACE%\\start-docker.bat'
        }
    }
}
        stage('Verify Docker Connection') {
    steps {
        script {
            echo '🔍 Testing Docker connection...'
            
            // Script simple de vérification Docker
            bat '''
                @echo off
                echo ===== DOCKER CONNECTION TEST =====
                
                rem Test 1: Docker CLI
                docker --version
                if %ERRORLEVEL% NEQ 0 (
                    echo ❌ ERROR: docker --version failed
                    exit /b 1
                )
                
                rem Test 2: Docker daemon
                echo Testing Docker daemon connection...
                docker info > nul 2>&1
                if %ERRORLEVEL% NEQ 0 (
                    echo ⚠️ WARNING: Docker daemon not responding
                    echo Attempting to start Docker Desktop...
                    
                    rem Essayez de démarrer Docker Desktop
                    start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"
                    echo Waiting 30 seconds for Docker to start...
                    timeout /t 30 /nobreak > nul
                    
                    rem Retest
                    docker info > nul 2>&1
                    if %ERRORLEVEL% NEQ 0 (
                        echo ❌ ERROR: Docker daemon still not responding
                        echo Please start Docker Desktop manually
                        exit /b 1
                    )
                )
                
                echo ✅ Docker connection is OK
                echo Docker Version:
                docker --version
                echo.
                echo Available images:
                docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}" | findstr /v "REPOSITORY" || echo No images found
            '''
        }
    }
}
       stage('Build Docker Images') {
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    steps {
        script {
            echo '🐳 Building Docker images with retry logic...'
            
            // Liste des services avec context spécifique
            def services = [
                [name: 'eureka-server', dockerfile: 'microservices/eureka-server/eureka-serve/Dockerfile', context: '.'],
                [name: 'api-gateway', dockerfile: 'microservices/api-gateway/api-gateway/Dockerfile', context: '.'],
                [name: 'billing-service', dockerfile: 'microservices/billing-service/billing-service/Dockerfile', context: '.'],
                [name: 'booking-service', dockerfile: 'microservices/booking-service/booking-service/Dockerfile', context: '.'],
                [name: 'customer-service', dockerfile: 'microservices/customer-service/customer-service/Dockerfile', context: '.'],
                [name: 'room-service', dockerfile: 'microservices/room-service/room-service/Dockerfile', context: '.'],
                [name: 'frontend', dockerfile: 'frontend/hotel-angular-app/Dockerfile', context: '.']
            ]
            
            services.each { service ->
                stage("Build ${service.name}") {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        script {
                            echo "🐳 Building ${service.name}..."
                            
                            // Essayer avec retry
                            retry(3) {
                                bat """
                                    @echo off
                                    echo ===== BUILDING ${service.name} =====
                                    cd /d "${env.WORKSPACE}"
                                    
                                    rem Vérifier que le Dockerfile existe
                                    if not exist "${service.dockerfile}" (
                                        echo ❌ ERROR: Dockerfile not found: ${service.dockerfile}
                                        exit /b 1
                                    )
                                    
                                    echo 📄 Dockerfile: ${service.dockerfile}
                                    echo 📂 Context: ${service.context}
                                    echo 🕐 Start time: %TIME%
                                    
                                    rem Lancer le build avec timeout
                                    docker build -f "${service.dockerfile}" -t ${service.name}:latest "${service.context}" --progress=plain
                                    
                                    if %ERRORLEVEL% NEQ 0 (
                                        echo ❌ Build failed for ${service.name}
                                        exit /b 1
                                    )
                                    
                                    echo ✅ Successfully built ${service.name}
                                    echo 🕐 End time: %TIME%
                                    
                                    rem Vérifier l'image
                                    docker images ${service.name}:latest
                                """
                            }
                            
                            // Pause courte entre les builds
                            sleep time: 2, unit: 'SECONDS'
                        }
                    }
                }
            }
            
            echo '🎉 All Docker images built successfully!'
            bat '''
                echo ===== DOCKER IMAGES BUILT =====
                docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}" | findstr "eureka-server api-gateway billing-service booking-service customer-service room-service frontend"
            '''
        }
    }
}
        stage('Deploy to Kubernetes') {
            options {
                timeout(time: 20, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🚀 Deploying to Kubernetes...'
                    
                    bat 'kubectl apply -f kubernetes/namespaces/hotel-namespace.yaml'
                    bat 'kubectl apply -f kubernetes/secrets/database-secrets.yaml'
                    bat 'kubectl apply -f kubernetes/configmaps/application-config.yaml'
                    
                    bat 'kubectl apply -f kubernetes/statefulsets/postgresql-statefulset.yaml'
                    bat 'kubectl apply -f kubernetes/statefulsets/rabbitmq-statefulset.yaml'
                    sleep time: 60, unit: 'SECONDS'
                    
                    bat 'kubectl apply -f kubernetes/services/databases-services.yaml'
                    bat 'kubectl apply -f kubernetes/services/rabbitmq-service.yaml'
                    
                    bat 'kubectl apply -f kubernetes/deployments/eureka-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/services/eureka-service.yaml'
                    sleep time: 60, unit: 'SECONDS'
                    
                    bat 'kubectl apply -f kubernetes/deployments/gateway-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/services/gateway-service.yaml'
                    sleep time: 45, unit: 'SECONDS'
                    
                    bat 'kubectl apply -f kubernetes/deployments/billing-service-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/deployments/booking-service-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/deployments/customer-service-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/deployments/room-service-deployment.yaml'
                    
                    bat 'kubectl apply -f kubernetes/services/billing-service.yaml'
                    bat 'kubectl apply -f kubernetes/services/booking-service.yaml'
                    bat 'kubectl apply -f kubernetes/services/customer-service.yaml'
                    bat 'kubectl apply -f kubernetes/services/room-service.yaml'
                    sleep time: 60, unit: 'SECONDS'
                    
                    bat 'kubectl apply -f kubernetes/deployments/frontend-deployment.yaml'
                    bat 'kubectl apply -f kubernetes/services/frontend-service.yaml'
                    sleep time: 30, unit: 'SECONDS'
                    
                    bat "kubectl get all -n %KUBE_NAMESPACE%"
                }
            }
        }
        
        stage('Kubernetes Health Check') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🏥 Checking deployment health...'
                    bat "kubectl get pods -n %KUBE_NAMESPACE% -o wide"
                    bat "kubectl get services -n %KUBE_NAMESPACE%"
                }
            }
        }
    }
    
    post {
    always {
        bat '''
            @echo off
            echo ===== POST-BUILD CLEANUP =====
            
            rem Nettoyage léger seulement
            echo Cleaning up unused containers...
            docker container prune -f 2>nul || echo "Container cleanup skipped"
            
            echo Cleaning up unused images...
            docker image prune -f --filter "until=24h" 2>nul || echo "Image cleanup skipped"
            
            echo 📊 Current disk usage:
            docker system df 2>nul || echo "Docker not available for disk info"
        '''
    }
    
    failure {
        bat '''
            @echo off
            echo ===== TROUBLESHOOTING INFORMATION =====
            echo.
            echo 🐳 Docker status:
            docker info 2>&1 || echo "Docker daemon not available"
            echo.
            echo 📦 Docker images:
            docker images
            echo.
            echo 🏃 Docker containers:
            docker ps -a
            echo.
            echo 💾 Disk space:
            wmic logicaldisk get size,freespace,caption
            echo.
            echo 🔄 If Docker failed, try:
            echo 1. Open Docker Desktop manually
            echo 2. Check: Services -> Docker Desktop Service is running
            echo 3. Run: docker info
        '''
    }
}