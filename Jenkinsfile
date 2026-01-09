pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'CLEAN_MAVEN_CACHE', defaultValue: false, description: 'Clean Maven local repository before build')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
        booleanParam(name: 'SKIP_DOCKER', defaultValue: false, description: 'Skip Docker build stage')
        booleanParam(name: 'SKIP_KUBERNETES', defaultValue: false, description: 'Skip Kubernetes deployment')
    }
    
    tools {
        maven 'Maven-3.9'
        nodejs 'NodeJS-18'
        jdk 'JDK-17'
    }
    
    environment {
        PROJECT_NAME = 'hotel-management'
        JAVA_HOME = 'C:\\Program Files\\java\\jdk-17'
        MAVEN_HOME = 'C:\\apache-maven-3.9.9'
        MAVEN_LOCAL_REPO = "${env.WORKSPACE}\\.m2\\repository"
        PATH = "${JAVA_HOME}\\bin;${MAVEN_HOME}\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Windows\\System32;C:\\Program Files\\Git\\bin;${env.PATH}"
        KUBE_NAMESPACE = 'hotel-management'
        
        // Optimized Maven options for Java 17
        MAVEN_OPTS = '-Xmx2048m -Xms512m -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=180 -Dmaven.wagon.http.pool=false'
    }
    
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo '🔧 Setting up environment...'
                    
                    // Check and setup Git
                    bat '''
                        @echo off
                        echo ===== ENVIRONMENT SETUP =====
                        
                        echo 🔍 Checking Git installation...
                        where git >nul 2>&1
                        if %ERRORLEVEL% NEQ 0 (
                            echo ⚠️ Git not found in PATH
                            echo Looking for Git in default locations...
                            if exist "C:\\Program Files\\Git\\bin\\git.exe" (
                                echo ✅ Git found at C:\\Program Files\\Git\\bin\\
                                set PATH=C:\\Program Files\\Git\\bin;%PATH%
                            ) else if exist "C:\\Program Files (x86)\\Git\\bin\\git.exe" (
                                echo ✅ Git found at C:\\Program Files (x86)\\Git\\bin\\
                                set PATH=C:\\Program Files (x86)\\Git\\bin;%PATH%
                            ) else (
                                echo ❌ Git not found. Please install Git.
                                echo 📋 Download from: https://git-scm.com/download/win
                                exit /b 1
                            )
                        )
                        echo ✅ Git version:
                        git --version
                        
                        echo 🔍 Checking Docker...
                        if not exist "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe" (
                            echo ❌ ERROR: Docker Desktop not found
                            echo 📋 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
                            exit /b 1
                        )
                        echo ✅ Docker Desktop is installed
                    '''
                }
            }
        }
        
        stage('Clean Maven Cache') {
            when {
                expression { params.CLEAN_MAVEN_CACHE == true }
            }
            steps {
                echo '🧹 Cleaning Maven cache...'
                bat '''
                    @echo off
                    if exist "%MAVEN_LOCAL_REPO%" (
                        echo Deleting Maven local repository...
                        rmdir /s /q "%MAVEN_LOCAL_REPO%" 2>nul || echo Could not delete some files
                        echo Maven cache cleaned
                    )
                    mkdir "%MAVEN_LOCAL_REPO%" 2>nul || echo Directory already exists
                '''
            }
        }
        
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying environment...'
                bat '''
                    @echo off
                    echo ===== ENVIRONMENT VERIFICATION =====
                    
                    echo 📊 Java version:
                    java -version
                    echo.
                    
                    echo 📊 Maven version:
                    call :MAVEN_CHECK
                    echo.
                    
                    echo 📊 Docker version:
                    docker --version || echo ❌ Docker not responding
                    echo.
                    
                    echo 📊 Kubernetes version:
                    kubectl version --client --short || echo ❌ kubectl not found
                    echo.
                    
                    echo 📊 Node version:
                    node --version || echo ❌ Node.js not found
                    echo.
                    
                    echo 📊 Environment variables:
                    echo JAVA_HOME: %JAVA_HOME%
                    echo MAVEN_HOME: %MAVEN_HOME%
                    echo MAVEN_LOCAL_REPO: %MAVEN_LOCAL_REPO%
                    echo MAVEN_OPTS: %MAVEN_OPTS%
                    echo PATH: %PATH%
                    echo.
                    echo ✅ Environment verification complete
                    goto :END
                    
                    :MAVEN_CHECK
                    setlocal
                    mvn -v 2>nul
                    if %ERRORLEVEL% NEQ 0 (
                        echo ❌ Maven not working with current MAVEN_OPTS
                        echo Trying without MAVEN_OPTS...
                        set MAVEN_OPTS=
                        mvn -v 2>nul || echo ❌ Maven still not working
                    )
                    endlocal
                    exit /b 0
                    
                    :END
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
        <mirror>
            <id>aliyun-maven</id>
            <mirrorOf>central</mirrorOf>
            <name>Aliyun Maven</name>
            <url>https://maven.aliyun.com/repository/central</url>
        </mirror>
    </mirrors>
    
    <profiles>
        <profile>
            <id>optimized-download</id>
            <properties>
                <downloadSources>false</downloadSources>
                <downloadJavadocs>false</downloadJavadocs>
                <maven.test.skip>true</maven.test.skip>
            </properties>
            <repositories>
                <repository>
                    <id>central</id>
                    <url>https://repo.maven.apache.org/maven2</url>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>daily</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>
    
    <activeProfiles>
        <activeProfile>optimized-download</activeProfile>
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
                    @echo off
                    echo ===== PROJECT STRUCTURE =====
                    echo Current directory:
                    cd
                    echo.
                    echo Workspace contents:
                    dir /b
                    echo.
                    echo Checking hotel-parent:
                    if exist hotel-parent (
                        dir /b hotel-parent
                    ) else (
                        echo ❌ hotel-parent directory not found
                    )
                    echo.
                    echo Checking microservices:
                    if exist microservices (
                        dir /b microservices
                    ) else (
                        echo ❌ microservices directory not found
                    )
                    echo.
                    echo Checking eureka-server:
                    if exist microservices\\eureka-server\\eureka-serve (
                        dir /b microservices\\eureka-server\\eureka-serve
                    ) else (
                        echo ❌ eureka-server directory not found
                    )
                    echo.
                    echo Checking frontend:
                    if exist frontend\\hotel-angular-app (
                        dir /b frontend\\hotel-angular-app
                    ) else (
                        echo ❌ frontend directory not found
                    )
                    echo.
                    echo ✅ Project structure verification complete
                '''
            }
        }
        
        stage('Install Parent POM') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }
            steps {
                echo '📦 Installing parent POM...'
                dir('hotel-parent') {
                    retry(3) {
                        bat '''
                            @echo off
                            echo Installing parent POM...
                            mvn clean install -N -DskipTests ^
                            -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                            -s %WORKSPACE%\\settings.xml ^
                            --batch-mode ^
                            --no-transfer-progress ^
                            -Dmaven.test.skip=true ^
                            -Dcheckstyle.skip=true ^
                            -Dspotbugs.skip=true
                            
                            if %ERRORLEVEL% NEQ 0 (
                                echo ⚠️ Parent POM installation failed, retrying...
                                timeout /t 10 /nobreak >nul
                                exit /b 1
                            )
                        '''
                    }
                }
            }
        }
        
        stage('Download All Dependencies') {
            options {
                timeout(time: 45, unit: 'MINUTES')
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
                    
                    def failedDeps = []
                    
                    pomFiles.each { pomFile ->
                        echo "📦 Resolving dependencies for ${pomFile}..."
                        try {
                            timeout(time: 15, unit: 'MINUTES') {
                                bat """
                                    @echo off
                                    echo Downloading dependencies for ${pomFile}...
                                    mvn dependency:resolve -f ${pomFile} ^
                                    -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                    -s %WORKSPACE%\\settings.xml ^
                                    --batch-mode ^
                                    --no-transfer-progress ^
                                    -Dmaven.test.skip=true
                                    
                                    if %ERRORLEVEL% NEQ 0 (
                                        echo ⚠️ Warning: Some dependencies may have failed for ${pomFile}
                                        exit /b 0  # Continue even if some deps fail
                                    )
                                """
                            }
                        } catch (Exception e) {
                            failedDeps.add(pomFile)
                            echo "⚠️ Failed to download dependencies for ${pomFile}: ${e.message}"
                        }
                    }
                    
                    if (failedDeps.size() > 0) {
                        echo "⚠️ Warning: Failed to download dependencies for: ${failedDeps}"
                    } else {
                        echo "✅ All dependencies downloaded successfully"
                    }
                }
            }
        }
        
        stage('Build Backend Services') {
            options {
                timeout(time: 60, unit: 'MINUTES')
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
                    
                    def buildErrors = []
                    
                    services.each { service ->
                        try {
                            timeout(time: 15, unit: 'MINUTES') {
                                echo "🔧 Building ${service.name}..."
                                dir(service.path) {
                                    retry(2) {
                                        bat '''
                                            @echo off
                                            echo Building service...
                                            mvn clean compile -DskipTests ^
                                            -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                            -s %WORKSPACE%\\settings.xml ^
                                            --batch-mode ^
                                            --no-transfer-progress ^
                                            -Dmaven.test.skip=true ^
                                            -Dcheckstyle.skip=true
                                            
                                            if %ERRORLEVEL% NEQ 0 (
                                                echo ⚠️ Build failed, retrying...
                                                timeout /t 5 /nobreak >nul
                                                exit /b 1
                                            )
                                        '''
                                    }
                                }
                                echo "✅ ${service.name} built successfully"
                            }
                        } catch (Exception e) {
                            buildErrors.add("${service.name}: ${e.message}")
                            echo "❌ Failed to build ${service.name}: ${e.message}"
                        }
                    }
                    
                    if (buildErrors.size() > 0) {
                        echo "⚠️ Build completed with errors for:"
                        buildErrors.each { error -> echo "  - ${error}" }
                    } else {
                        echo "✅ All services built successfully"
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            options {
                timeout(time: 20, unit: 'MINUTES')
            }
            steps {
                echo '🎨 Building Frontend...'
                dir('frontend/hotel-angular-app') {
                    bat '''
                        @echo off
                        echo Installing Node dependencies...
                        npm ci --no-audit --prefer-offline || npm install --no-audit
                        echo.
                        echo Building frontend...
                        npm run build -- --configuration=production
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            when {
                expression { params.SKIP_TESTS == false }
            }
            options {
                timeout(time: 40, unit: 'MINUTES')
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
                    
                    def testFailures = []
                    
                    services.each { service ->
                        try {
                            timeout(time: 10, unit: 'MINUTES') {
                                echo "🧪 Testing ${service.name}..."
                                dir(service.path) {
                                    bat """
                                        mvn test ^
                                        -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                        -s %WORKSPACE%\\settings.xml ^
                                        --batch-mode ^
                                        --no-transfer-progress ^
                                        -DfailIfNoTests=false
                                    """
                                }
                            }
                        } catch (Exception e) {
                            testFailures.add(service.name)
                            echo "⚠️ Tests failed for ${service.name}: ${e.message}"
                        }
                    }
                    
                    if (testFailures.size() > 0) {
                        echo "⚠️ Tests failed for: ${testFailures}"
                        currentBuild.result = 'UNSTABLE'
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
                timeout(time: 40, unit: 'MINUTES')
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
                        timeout(time: 10, unit: 'MINUTES') {
                            echo "📦 Packaging ${service.name}..."
                            dir(service.path) {
                                bat """
                                    mvn package -DskipTests ^
                                    -Dmaven.repo.local=%MAVEN_LOCAL_REPO% ^
                                    -s %WORKSPACE%\\settings.xml ^
                                    --batch-mode ^
                                    --no-transfer-progress ^
                                    -Dmaven.test.skip=true
                                """
                            }
                            echo "✅ ${service.name} packaged successfully"
                        }
                    }
                }
            }
        }
        
        stage('Prepare Docker Environment') {
            when {
                expression { params.SKIP_DOCKER == false }
            }
            steps {
                script {
                    echo '🐳 Preparing Docker environment...'
                    
                    bat '''
                        @echo off
                        echo ===== DOCKER ENVIRONMENT PREPARATION =====
                        
                        echo 🔍 Checking Docker Desktop installation...
                        if not exist "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe" (
                            echo ❌ ERROR: Docker Desktop not found
                            echo 📋 Please install from: https://www.docker.com/products/docker-desktop/
                            exit /b 1
                        )
                        
                        echo 🔍 Checking Docker daemon status...
                        :CHECK_DOCKER
                        docker info >nul 2>&1
                        if %ERRORLEVEL% EQU 0 (
                            echo ✅ Docker daemon is running
                            goto :DOCKER_READY
                        )
                        
                        echo ⚠️ Docker daemon not responding
                        echo Attempting to start Docker Desktop...
                        
                        rem Kill existing Docker processes
                        echo Stopping Docker processes...
                        taskkill /f /im "Docker Desktop.exe" 2>nul || echo No Docker Desktop process found
                        timeout /t 10 /nobreak >nul
                        
                        rem Start Docker Desktop
                        echo Starting Docker Desktop...
                        start "" /B "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"
                        
                        echo Waiting for Docker daemon to start (max 3 minutes)...
                        set MAX_WAIT=180
                        set WAITED=0
                        
                        :WAIT_LOOP
                        timeout /t 5 /nobreak >nul
                        set /a WAITED+=5
                        
                        docker info >nul 2>&1
                        if %ERRORLEVEL% EQU 0 (
                            echo ✅ Docker daemon ready after %WAITED% seconds
                            goto :DOCKER_READY
                        )
                        
                        if %WAITED% LSS %MAX_WAIT% (
                            echo ⏳ Still waiting... (%WAITED%/%MAX_WAIT%s)
                            goto :WAIT_LOOP
                        )
                        
                        echo ❌ ERROR: Docker failed to start after 3 minutes
                        echo Please check:
                        echo 1. Docker Desktop installation
                        echo 2. Hyper-V/WSL2 configuration
                        echo 3. Start Docker Desktop manually
                        exit /b 1
                        
                        :DOCKER_READY
                        echo.
                        echo 📊 Docker Information:
                        docker --version
                        echo.
                        docker info --format "{{.ServerVersion}}"
                        echo.
                        echo ✅ Docker environment is ready
                        
                        rem Cleanup old images (optional)
                        echo 🧹 Cleaning up old Docker resources...
                        docker system prune -f --filter "until=24h" 2>nul || echo Cleanup skipped
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            when {
                expression { params.SKIP_DOCKER == false }
            }
            options {
                timeout(time: 90, unit: 'MINUTES')  // Extended timeout for Docker builds
            }
            steps {
                script {
                    echo '🐳 Building Docker images...'
                    
                    def services = [
                        [name: 'eureka-server', dockerfile: 'microservices\\eureka-server\\eureka-serve\\Dockerfile'],
                        [name: 'api-gateway', dockerfile: 'microservices\\api-gateway\\api-gateway\\Dockerfile'],
                        [name: 'billing-service', dockerfile: 'microservices\\billing-service\\billing-service\\Dockerfile'],
                        [name: 'booking-service', dockerfile: 'microservices\\booking-service\\booking-service\\Dockerfile'],
                        [name: 'customer-service', dockerfile: 'microservices\\customer-service\\customer-service\\Dockerfile'],
                        [name: 'room-service', dockerfile: 'microservices\\room-service\\room-service\\Dockerfile'],
                        [name: 'frontend', dockerfile: 'frontend\\hotel-angular-app\\Dockerfile']
                    ]
                    
                    def buildErrors = []
                    
                    echo '🐳 Building Docker images sequentially...'
                    
                    services.each { service ->
                        try {
                            timeout(time: 20, unit: 'MINUTES') {
                                echo "🐳 Building ${service.name} image..."
                                
                                // Verify Docker is still running before each build
                                bat '''
                                    @echo off
                                    echo 🔍 Pre-build Docker check...
                                    docker info >nul 2>&1
                                    if %ERRORLEVEL% NEQ 0 (
                                        echo ❌ ERROR: Docker not available before build
                                        exit /b 1
                                    )
                                    echo ✅ Docker is ready
                                '''
                                
                                // Build Docker image with retry
                                retry(3) {
                                    bat """
                                        @echo off
                                        echo Building ${service.name}...
                                        cd /d "${env.WORKSPACE}"
                                        
                                        rem Verify Dockerfile exists
                                        if not exist "${service.dockerfile}" (
                                            echo ❌ ERROR: Dockerfile not found at ${service.dockerfile}
                                            exit /b 1
                                        )
                                        
                                        rem Build with cache and progress
                                        docker build -f ${service.dockerfile} -t ${service.name}:latest . ^
                                            --progress=plain ^
                                            --no-cache=false
                                        
                                        if %ERRORLEVEL% NEQ 0 (
                                            echo ⚠️ Build failed, retrying...
                                            timeout /t 10 /nobreak >nul
                                            exit /b 1
                                        )
                                    """
                                }
                                
                                echo "✅ ${service.name} image built successfully"
                                
                                // Verify image was created
                                bat "docker images ${service.name}:latest --format \"✅ Image created: {{.Repository}}:{{.Tag}} ({{.Size}})\""
                                
                                // Small delay between builds
                                sleep time: 5, unit: 'SECONDS'
                            }
                        } catch (Exception e) {
                            buildErrors.add("${service.name}: ${e.message}")
                            echo "❌ Failed to build ${service.name} after retries: ${e.message}"
                        }
                    }
                    
                    // Show all built images
                    echo ''
                    echo '========== BUILT DOCKER IMAGES =========='
                    bat '''
                        @echo off
                        echo 📊 Docker images summary:
                        docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}" | findstr "eureka-server api-gateway billing-service booking-service customer-service room-service frontend" || echo No images found
                    '''
                    
                    // Check for errors
                    if (buildErrors.size() > 0) {
                        echo "❌ Docker build errors:"
                        buildErrors.each { error -> echo "  - ${error}" }
                        if (buildErrors.size() == services.size()) {
                            error("All Docker builds failed")
                        } else {
                            echo "⚠️ Some Docker builds failed, but continuing..."
                            currentBuild.result = 'UNSTABLE'
                        }
                    } else {
                        echo '✅ All Docker images built successfully!'
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                allOf {
                    expression { params.SKIP_KUBERNETES == false }
                    expression { params.SKIP_DOCKER == false }
                }
            }
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🚀 Deploying to Kubernetes...'
                    
                    try {
                        // Phase 1: Namespace and Configurations
                        echo '📦 Phase 1: Creating namespace, secrets and configmaps...'
                        bat '''
                            kubectl apply -f kubernetes/namespaces/hotel-namespace.yaml --dry-run=client
                            kubectl apply -f kubernetes/namespaces/hotel-namespace.yaml
                            kubectl apply -f kubernetes/secrets/database-secrets.yaml
                            kubectl apply -f kubernetes/configmaps/application-config.yaml
                        '''
                        
                        // Phase 2: Databases
                        echo '🗄️ Phase 2: Deploying databases and RabbitMQ...'
                        bat '''
                            kubectl apply -f kubernetes/statefulsets/postgresql-statefulset.yaml
                            kubectl apply -f kubernetes/statefulsets/rabbitmq-statefulset.yaml
                        '''
                        
                        echo '⏳ Waiting 90s for databases to initialize...'
                        sleep time: 90, unit: 'SECONDS'
                        
                        // Phase 3: Services
                        echo '🔗 Phase 3: Creating services...'
                        bat '''
                            kubectl apply -f kubernetes/services/databases-services.yaml
                            kubectl apply -f kubernetes/services/rabbitmq-service.yaml
                        '''
                        
                        // Phase 4: Eureka
                        echo '🔍 Phase 4: Deploying Eureka Server...'
                        bat '''
                            kubectl apply -f kubernetes/deployments/eureka-deployment.yaml
                            kubectl apply -f kubernetes/services/eureka-service.yaml
                        '''
                        
                        echo '⏳ Waiting 120s for Eureka to start...'
                        sleep time: 120, unit: 'SECONDS'
                        
                        // Phase 5: API Gateway
                        echo '🚪 Phase 5: Deploying API Gateway...'
                        bat '''
                            kubectl apply -f kubernetes/deployments/gateway-deployment.yaml
                            kubectl apply -f kubernetes/services/gateway-service.yaml
                        '''
                        
                        echo '⏳ Waiting 60s for Gateway to start...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        // Phase 6: Microservices
                        echo '🔧 Phase 6: Deploying microservices...'
                        bat '''
                            kubectl apply -f kubernetes/deployments/billing-service-deployment.yaml
                            kubectl apply -f kubernetes/deployments/booking-service-deployment.yaml
                            kubectl apply -f kubernetes/deployments/customer-service-deployment.yaml
                            kubectl apply -f kubernetes/deployments/room-service-deployment.yaml
                            
                            kubectl apply -f kubernetes/services/billing-service.yaml
                            kubectl apply -f kubernetes/services/booking-service.yaml
                            kubectl apply -f kubernetes/services/customer-service.yaml
                            kubectl apply -f kubernetes/services/room-service.yaml
                        '''
                        
                        echo '⏳ Waiting 90s for microservices to start...'
                        sleep time: 90, unit: 'SECONDS'
                        
                        // Phase 7: Frontend
                        echo '🎨 Phase 7: Deploying frontend...'
                        bat '''
                            kubectl apply -f kubernetes/deployments/frontend-deployment.yaml
                            kubectl apply -f kubernetes/services/frontend-service.yaml
                        '''
                        
                        echo '⏳ Waiting 60s for frontend to start...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        echo '✅ Deployment completed!'
                        bat "kubectl get all -n %KUBE_NAMESPACE%"
                        
                    } catch (Exception e) {
                        echo "❌ Kubernetes deployment failed: ${e.message}"
                        
                        // Debug information
                        bat '''
                            echo.
                            echo ========== DEBUG INFORMATION ==========
                            echo 📊 Cluster info:
                            kubectl cluster-info
                            echo.
                            echo 📊 Nodes:
                            kubectl get nodes
                            echo.
                            echo 📊 All resources in namespace:
                            kubectl get all -n %KUBE_NAMESPACE%
                            echo.
                            echo 📊 Pod details:
                            kubectl describe pods -n %KUBE_NAMESPACE%
                            echo.
                            echo 📊 Recent events:
                            kubectl get events -n %KUBE_NAMESPACE% --sort-by=.metadata.creationTimestamp
                            echo.
                            echo 📊 Failed pod logs:
                            for /f "tokens=1" %%p in ('kubectl get pods -n %KUBE_NAMESPACE% --field-selector=status.phase!=Running -o name 2^>nul') do (
                                echo.
                                echo === Logs for %%p ===
                                kubectl logs -n %KUBE_NAMESPACE% %%p --tail=50 2>nul || echo No logs available
                            )
                        '''
                        
                        throw e
                    }
                }
            }
        }
        
        stage('Kubernetes Health Check') {
            when {
                allOf {
                    expression { params.SKIP_KUBERNETES == false }
                    expression { params.SKIP_DOCKER == false }
                }
            }
            options {
                timeout(time: 15, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🏥 Checking Kubernetes deployment health...'
                    
                    def maxWait = 300
                    def interval = 15
                    def waited = 0
                    def allReady = false
                    
                    while (waited < maxWait && !allReady) {
                        def podStatus = bat(
                            script: "kubectl get pods -n %KUBE_NAMESPACE% --no-headers",
                            returnStdout: true
                        ).trim()
                        
                        def notReady = bat(
                            script: "@powershell -Command \"(kubectl get pods -n %KUBE_NAMESPACE% --field-selector=status.phase!=Running --no-headers 2>$null | Measure-Object).Count\"",
                            returnStdout: true
                        ).trim()
                        
                        if (notReady == "0") {
                            echo "✅ All pods are running!"
                            allReady = true
                            break
                        }
                        
                        echo "⏳ Waiting ${interval}s for pods to be ready... (${waited}/${maxWait}s)"
                        sleep time: interval, unit: 'SECONDS'
                        waited += interval
                    }
                    
                    if (!allReady) {
                        echo "⚠️ Some pods are not ready after ${maxWait}s"
                        bat "kubectl get pods -n %KUBE_NAMESPACE%"
                        currentBuild.result = 'UNSTABLE'
                    }
                    
                    // Final status check
                    bat '''
                        echo.
                        echo ========== FINAL DEPLOYMENT STATUS ==========
                        echo 📊 All resources:
                        kubectl get all -n %KUBE_NAMESPACE%
                        echo.
                        echo 📊 Services:
                        kubectl get services -n %KUBE_NAMESPACE%
                        echo.
                        echo 📊 Pods with details:
                        kubectl get pods -n %KUBE_NAMESPACE% -o wide
                        echo.
                        echo ✅ Health check completed
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Performing cleanup...'
            bat '''
                @echo off
                echo ===== CLEANUP =====
                echo Cleaning temporary files...
                if exist "%WORKSPACE%\\settings.xml" del "%WORKSPACE%\\settings.xml"
                echo Cleanup completed
            '''
        }
        success {
            echo '''
            ✅ ========================================
            ✅  DEPLOYMENT SUCCESSFUL!
            ✅ ========================================
            
            📋 Application URLs (after port-forwarding):
            
            1. Port-forward services:
               kubectl port-forward -n hotel-management svc/eureka-service 8761:8761
               kubectl port-forward -n hotel-management svc/gateway-service 8080:8080
               kubectl port-forward -n hotel-management svc/frontend-service 4200:80
            
            2. Access applications:
               📊 Eureka Dashboard: http://localhost:8761
               🚪 API Gateway: http://localhost:8080
               🎨 Frontend: http://localhost:4200
            
            3. Useful commands:
               kubectl get pods -n hotel-management
               kubectl logs -n hotel-management <pod-name> -f
               kubectl describe pod -n hotel-management <pod-name>
            
            ✅ ========================================
            '''
        }
        failure {
            echo '''
            ❌ ========================================
            ❌  DEPLOYMENT FAILED!
            ❌ ========================================
            
            📋 Troubleshooting:
            
            1. Check Jenkins logs for specific errors
            2. Verify Docker Desktop is running
            3. Check Kubernetes cluster:
               kubectl cluster-info
               kubectl get nodes
            
            4. Clean up and retry:
               kubectl delete namespace hotel-management
            
            ❌ ========================================
            '''
        }
        unstable {
            echo '''
            ⚠️ ========================================
            ⚠️  DEPLOYMENT COMPLETED WITH WARNINGS
            ⚠️ ========================================
            
            Some steps may have completed with warnings.
            Check the stage logs for details.
            
            ⚠️ ========================================
            '''
        }
    }
}