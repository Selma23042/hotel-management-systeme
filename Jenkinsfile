pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'CLEAN_MAVEN_CACHE', defaultValue: false, description: 'Clean Maven local repository before build')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
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
    PATH = "${JAVA_HOME}\\bin;${MAVEN_HOME}\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Windows\\System32;${env.PATH}"
    KUBE_NAMESPACE = 'hotel-management'
    
    // CORRECTION ICI : Supprimer -XX:MaxPermSize=512m
    MAVEN_OPTS = '-Xmx2048m -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=180'
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
                    echo '🐳 Preparing Docker environment...'
                    
                    def dockerRunning = bat(
                        returnStatus: true,
                        script: '@docker info >nul 2>&1'
                    )
                    
                    if (dockerRunning != 0) {
                        echo '⚠️ Docker daemon not running, starting Docker Desktop...'
                        
                        def dockerExists = bat(
                            returnStatus: true,
                            script: '@if exist "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe" exit 0 else exit 1'
                        )
                        
                        if (dockerExists != 0) {
                            error('❌ Docker Desktop not found. Please install Docker Desktop and retry.')
                        }
                        
                        bat '''
                            @echo off
                            echo 🚀 Starting Docker Desktop...
                            start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"
                            
                            echo ⏳ Waiting for Docker daemon to start...
                            
                            set MAX_ATTEMPTS=24
                            set ATTEMPT=0
                            
                            :WAIT_LOOP
                            timeout /t 5 /nobreak >nul 2>&1
                            set /a ATTEMPT+=1
                            
                            docker info >nul 2>&1
                            if %ERRORLEVEL% EQU 0 (
                                echo ✅ Docker daemon is ready!
                                goto :DOCKER_READY
                            )
                            
                            echo ⏳ Still waiting for Docker... (attempt %ATTEMPT%/%MAX_ATTEMPTS%)
                            
                            if %ATTEMPT% LSS %MAX_ATTEMPTS% goto :WAIT_LOOP
                            
                            echo ❌ Docker daemon failed to start
                            exit /b 1
                            
                            :DOCKER_READY
                            echo ✅ Docker Desktop started successfully!
                        '''
                        
                    } else {
                        echo '✅ Docker daemon is already running'
                    }
                    
                    bat 'docker system prune -f --volumes=false || echo Cleanup skipped'
                }
            }
        }
        
        stage('Build Docker Images') {
            options {
                timeout(time: 60, unit: 'MINUTES')
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
                    
                    services.each { service ->
                        timeout(time: 10, unit: 'MINUTES') {
                            echo "🐳 Building ${service.name}..."
                            retry(2) {
                                bat """
                                    cd /d "${env.WORKSPACE}"
                                    docker build -f ${service.dockerfile} -t ${service.name}:latest . --progress=plain
                                """
                            }
                            echo "✅ ${service.name} image built"
                            sleep time: 3, unit: 'SECONDS'
                        }
                    }
                    
                    bat 'docker images | findstr "eureka-server api-gateway billing-service booking-service customer-service room-service frontend"'
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
            bat 'docker system prune -f --volumes=false || echo "Cleanup skipped"'
        }
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
            bat "kubectl get pods -n %KUBE_NAMESPACE% -o wide || echo No pods found"
            bat "kubectl get events -n %KUBE_NAMESPACE% --sort-by=.metadata.creationTimestamp || echo No events found"
        }
    }
}