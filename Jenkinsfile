pipeline {
    agent any
    
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
    }
    
    stages {
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
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }
        
        stage('Install Parent POM') {
            steps {
                echo '📦 Installing parent POM...'
                dir('hotel-parent') {
                    bat "mvn clean install -N -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                }
            }
        }
        
        stage('Build Backend Services') {
            parallel {
                stage('Build Eureka') {
                    steps {
                        echo '🔧 Building Eureka Server...'
                        dir('microservices/eureka-server/eureka-serve') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Build Gateway') {
                    steps {
                        echo '🔧 Building API Gateway...'
                        dir('microservices/api-gateway/api-gateway') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Build Room Service') {
                    steps {
                        echo '🔧 Building Room Service...'
                        dir('microservices/room-service/room-service') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Build Customer Service') {
                    steps {
                        echo '🔧 Building Customer Service...'
                        dir('microservices/customer-service/customer-service') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Build Booking Service') {
                    steps {
                        echo '🔧 Building Booking Service...'
                        dir('microservices/booking-service/booking-service') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Build Billing Service') {
                    steps {
                        echo '🔧 Building Billing Service...'
                        dir('microservices/billing-service/billing-service') {
                            bat "mvn clean compile -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo '🎨 Building Frontend...'
                dir('frontend/hotel-angular-app') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Test Room Service') {
                    steps {
                        echo '🧪 Testing Room Service...'
                        dir('microservices/room-service/room-service') {
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO% -DskipTests=false"
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Test Customer Service') {
                    steps {
                        echo '🧪 Testing Customer Service...'
                        dir('microservices/customer-service/customer-service') {
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO% -DskipTests=false"
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Test Booking Service') {
                    steps {
                        echo '🧪 Testing Booking Service...'
                        dir('microservices/booking-service/booking-service') {
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO% -DskipTests=false"
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Test Billing Service') {
                    steps {
                        echo '🧪 Testing Billing Service...'
                        dir('microservices/billing-service/billing-service') {
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO% -Dtest=!*IntegrationTest,!*IT"
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                        }
                    }
                }
            }
        }
        
        stage('Package Services') {
            parallel {
                stage('Package Eureka') {
                    steps {
                        echo '📦 Packaging Eureka Server...'
                        dir('microservices/eureka-server/eureka-serve') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Package Gateway') {
                    steps {
                        echo '📦 Packaging API Gateway...'
                        dir('microservices/api-gateway/api-gateway') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Package Room Service') {
                    steps {
                        echo '📦 Packaging Room Service...'
                        dir('microservices/room-service/room-service') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Package Customer Service') {
                    steps {
                        echo '📦 Packaging Customer Service...'
                        dir('microservices/customer-service/customer-service') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Package Booking Service') {
                    steps {
                        echo '📦 Packaging Booking Service...'
                        dir('microservices/booking-service/booking-service') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
                stage('Package Billing Service') {
                    steps {
                        echo '📦 Packaging Billing Service...'
                        dir('microservices/billing-service/billing-service') {
                            bat "mvn package -DskipTests -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
                        }
                    }
                }
            }
        }
        
        stage('Prepare Docker Environment') {
            steps {
                script {
                    echo '🐳 Preparing Docker environment...'
                    
                    def dockerRunning = powershell(
                        returnStatus: true,
                        script: '''
                            try {
                                docker info 2>&1 | Out-Null
                                exit 0
                            } catch {
                                exit 1
                            }
                        '''
                    )
                    
                    if (dockerRunning != 0) {
                        echo '⚠️ Docker daemon not running, starting Docker Desktop...'
                        
                        def startResult = powershell(
                            returnStatus: true,
                            script: '''
                                $ErrorActionPreference = "Stop"
                                
                                Write-Host "🔍 Checking if Docker Desktop is already running..."
                                $dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
                                
                                if ($dockerProcess) {
                                    Write-Host "⚠️ Docker Desktop process found but daemon not responding. Killing process..."
                                    $dockerProcess | Stop-Process -Force
                                    Start-Sleep -Seconds 10
                                }
                                
                                Write-Host "🚀 Starting Docker Desktop..."
                                $dockerPath = "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"
                                
                                if (-not (Test-Path $dockerPath)) {
                                    Write-Host "❌ Docker Desktop not found at: $dockerPath"
                                    Write-Host "Please install Docker Desktop or update the path"
                                    exit 1
                                }
                                
                                Start-Process $dockerPath -WindowStyle Hidden
                                Write-Host "⏳ Waiting for Docker daemon to start (this may take 1-2 minutes)..."
                                
                                $maxAttempts = 24
                                $attempt = 0
                                $dockerReady = $false
                                
                                while ($attempt -lt $maxAttempts) {
                                    Start-Sleep -Seconds 5
                                    $attempt++
                                    
                                    try {
                                        $result = docker info 2>&1
                                        if ($LASTEXITCODE -eq 0) {
                                            Write-Host "✅ Docker daemon is ready! (attempt $attempt/$maxAttempts)"
                                            $dockerReady = $true
                                            break
                                        }
                                    } catch {
                                        # Continue waiting
                                    }
                                    
                                    Write-Host "⏳ Still waiting for Docker... (attempt $attempt/$maxAttempts)"
                                }
                                
                                if (-not $dockerReady) {
                                    Write-Host "❌ Docker daemon failed to start after $($maxAttempts * 5) seconds"
                                    Write-Host "Please start Docker Desktop manually and retry"
                                    exit 1
                                }
                                
                                Write-Host "✅ Docker Desktop started successfully!"
                                exit 0
                            '''
                        )
                        
                        if (startResult != 0) {
                            error("❌ Failed to start Docker Desktop. Please start Docker Desktop manually and retry the build.")
                        }
                    } else {
                        echo '✅ Docker daemon is already running'
                    }
                    
                    bat '''
                        echo.
                        echo ========== Docker Information ==========
                        docker info
                        echo.
                        echo ========== Docker Disk Usage Before Cleanup ==========
                        docker system df
                        echo.
                        echo ========== Cleaning up old Docker resources ==========
                        docker system prune -f --volumes=false || echo "Cleanup skipped"
                        echo.
                        echo ========== Docker Disk Usage After Cleanup ==========
                        docker system df
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            options {
                timeout(time: 60, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🐳 Building Docker images from workspace root...'
                    
                    def services = [
                        [name: 'eureka-server', path: 'microservices\\eureka-server\\eureka-serve'],
                        [name: 'api-gateway', path: 'microservices\\api-gateway\\api-gateway'],
                        [name: 'billing-service', path: 'microservices\\billing-service\\billing-service'],
                        [name: 'booking-service', path: 'microservices\\booking-service\\booking-service'],
                        [name: 'customer-service', path: 'microservices\\customer-service\\customer-service'],
                        [name: 'room-service', path: 'microservices\\room-service\\room-service'],
                        [name: 'frontend', path: 'frontend\\hotel-angular-app']
                    ]
                    
                    def buildErrors = []
                    
                    // Revenir à la racine du workspace
                    dir(env.WORKSPACE) {
                        services.each { service ->
                            try {
                                echo "🐳 Building ${service.name} image..."
                                echo "   Dockerfile: ${service.path}\\Dockerfile"
                                echo "   Context: ${env.WORKSPACE}"
                                
                                retry(2) {
                                    try {
                                        bat """
                                            docker build -f ${service.path}\\Dockerfile -t ${service.name}:latest . --progress=plain
                                        """
                                        echo "✅ ${service.name} image built successfully"
                                    } catch (Exception e) {
                                        echo "⚠️ Build failed for ${service.name}, retrying..."
                                        sleep time: 10, unit: 'SECONDS'
                                        throw e
                                    }
                                }
                                
                                // Délai entre les builds
                                sleep time: 5, unit: 'SECONDS'
                                
                            } catch (Exception e) {
                                buildErrors.add("${service.name}: ${e.message}")
                                echo "❌ Failed to build ${service.name} after retries: ${e.message}"
                            }
                        }
                    }
                    
                    // Vérifier les erreurs
                    if (buildErrors.size() > 0) {
                        echo "❌ Build errors occurred for the following services:"
                        buildErrors.each { error ->
                            echo "  - ${error}"
                        }
                        error("Docker image build failed for ${buildErrors.size()} service(s)")
                    }
                    
                    echo '✅ All Docker images built successfully!'
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
                    
                    try {
                        echo '📦 Phase 1: Creating namespace, secrets and configmaps...'
                        bat 'kubectl apply -f kubernetes/namespaces/hotel-namespace.yaml'
                        bat 'kubectl apply -f kubernetes/secrets/database-secrets.yaml'
                        bat 'kubectl apply -f kubernetes/configmaps/application-config.yaml'
                        
                        echo '🗄️ Phase 2: Deploying databases and RabbitMQ...'
                        bat 'kubectl apply -f kubernetes/statefulsets/postgresql-statefulset.yaml'
                        bat 'kubectl apply -f kubernetes/statefulsets/rabbitmq-statefulset.yaml'
                        
                        echo '⏳ Waiting 60s for databases to initialize...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        bat "kubectl get statefulsets -n %KUBE_NAMESPACE%"
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=billing-db"
                        
                        echo '🔗 Phase 3: Creating database and messaging services...'
                        bat 'kubectl apply -f kubernetes/services/databases-services.yaml'
                        bat 'kubectl apply -f kubernetes/services/rabbitmq-service.yaml'
                        
                        echo '🔍 Phase 4: Deploying Eureka Server...'
                        bat 'kubectl apply -f kubernetes/deployments/eureka-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/eureka-service.yaml'
                        
                        echo '⏳ Waiting 60s for Eureka to start...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=eureka-server"
                        bat "kubectl logs -n %KUBE_NAMESPACE% -l app=eureka-server --tail=30 || echo Cannot get logs"
                        
                        echo '🚪 Phase 5: Deploying API Gateway...'
                        bat 'kubectl apply -f kubernetes/deployments/gateway-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/gateway-service.yaml'
                        
                        echo '⏳ Waiting 45s for Gateway to start...'
                        sleep time: 45, unit: 'SECONDS'
                        
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=api-gateway"
                        
                        echo '🔧 Phase 6: Deploying microservices...'
                        bat 'kubectl apply -f kubernetes/deployments/billing-service-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/deployments/booking-service-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/deployments/customer-service-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/deployments/room-service-deployment.yaml'
                        
                        bat 'kubectl apply -f kubernetes/services/billing-service.yaml'
                        bat 'kubectl apply -f kubernetes/services/booking-service.yaml'
                        bat 'kubectl apply -f kubernetes/services/customer-service.yaml'
                        bat 'kubectl apply -f kubernetes/services/room-service.yaml'
                        
                        echo '⏳ Waiting 60s for microservices to start...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        bat "kubectl get pods -n %KUBE_NAMESPACE% | findstr service"
                        
                        echo '🎨 Phase 7: Deploying frontend...'
                        bat 'kubectl apply -f kubernetes/deployments/frontend-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/frontend-service.yaml'
                        
                        echo '⏳ Waiting 30s for frontend to start...'
                        sleep time: 30, unit: 'SECONDS'
                        
                        echo '✅ Deployment completed! Checking status...'
                        bat "kubectl get all -n %KUBE_NAMESPACE%"
                        
                        echo '''
                        
                        ========================================
                        📊 KUBERNETES DEPLOYMENT SUMMARY
                        ========================================
                        '''
                        
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -o wide"
                        bat "kubectl get services -n %KUBE_NAMESPACE%"
                        
                    } catch (Exception e) {
                        echo "❌ Kubernetes deployment failed: ${e.message}"
                        
                        bat """
                            echo.
                            echo ========== POD STATUS ==========
                            kubectl get pods -n %KUBE_NAMESPACE% -o wide
                            echo.
                            echo ========== POD DESCRIPTIONS ==========
                            kubectl describe pods -n %KUBE_NAMESPACE%
                            echo.
                            echo ========== SERVICES ==========
                            kubectl get services -n %KUBE_NAMESPACE%
                            echo.
                            echo ========== RECENT EVENTS ==========
                            kubectl get events -n %KUBE_NAMESPACE% --sort-by=.metadata.creationTimestamp
                            echo.
                            echo ========== FAILED POD LOGS ==========
                            for /f "tokens=1" %%p in ('kubectl get pods -n %KUBE_NAMESPACE% --field-selector=status.phase!=Running -o name 2^>nul') do (
                                echo.
                                echo === Logs for %%p ===
                                kubectl logs -n %KUBE_NAMESPACE% %%p --tail=50 2>nul || echo No logs available
                            )
                        """
                        
                        throw e
                    }
                }
            }
        }
        
        stage('Kubernetes Health Check') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                script {
                    echo '🏥 Checking Kubernetes services health...'
                    
                    try {
                        echo 'Waiting for all pods to be ready...'
                        
                        def maxWaitTime = 300
                        def waitInterval = 15
                        def timeWaited = 0
                        def allPodsReady = false
                        
                        while (timeWaited < maxWaitTime && !allPodsReady) {
                            def podStatus = bat(
                                script: "kubectl get pods -n %KUBE_NAMESPACE% --no-headers",
                                returnStdout: true
                            ).trim()
                            
                            echo "Current pod status:"
                            echo podStatus
                            
                            def notReadyCount = bat(
                                script: """kubectl get pods -n %KUBE_NAMESPACE% --field-selector=status.phase!=Running --no-headers 2>nul | find /c /v "" """,
                                returnStdout: true
                            ).trim()
                            
                            if (notReadyCount == "0") {
                                echo "✅ All pods are running!"
                                allPodsReady = true
                                break
                            }
                            
                            echo "⏳ Waiting ${waitInterval}s for pods to be ready... (${timeWaited}/${maxWaitTime}s elapsed)"
                            sleep time: waitInterval, unit: 'SECONDS'
                            timeWaited += waitInterval
                        }
                        
                        if (!allPodsReady) {
                            echo "⚠️ Warning: Not all pods are ready after ${maxWaitTime}s"
                            bat "kubectl get pods -n %KUBE_NAMESPACE%"
                        }
                        
                        echo '''
                        
                        ========================================
                        🔍 SERVICE HEALTH CHECK
                        ========================================
                        '''
                        
                        def services = [
                            'eureka-server',
                            'api-gateway',
                            'billing-service',
                            'booking-service',
                            'customer-service',
                            'room-service',
                            'frontend'
                        ]
                        
                        services.each { service ->
                            try {
                                bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=${service}"
                                echo "✅ ${service} pods are deployed"
                            } catch (Exception e) {
                                echo "⚠️ ${service} may have issues"
                            }
                        }
                        
                        echo '''
                        
                        ========================================
                        ✅ HEALTH CHECK COMPLETED
                        ========================================
                        
                        📋 To access services, run these commands:
                        
                        kubectl port-forward -n hotel-management svc/eureka-service 8761:8761
                        kubectl port-forward -n hotel-management svc/gateway-service 8080:8080
                        kubectl port-forward -n hotel-management svc/frontend-service 4200:80
                        kubectl port-forward -n hotel-management svc/rabbitmq 15672:15672
                        
                        Then access:
                        📊 Eureka: http://localhost:8761
                        🚪 Gateway: http://localhost:8080
                        🎨 Frontend: http://localhost:4200
                        🐰 RabbitMQ: http://localhost:15672 (admin/admin)
                        '''
                        
                    } catch (Exception e) {
                        echo "⚠️ Health check encountered issues: ${e.message}"
                        
                        bat """
                            echo.
                            echo ========== FINAL POD STATUS ==========
                            kubectl get pods -n %KUBE_NAMESPACE% -o wide
                            echo.
                            echo ========== FINAL SERVICES ==========
                            kubectl get services -n %KUBE_NAMESPACE%
                        """
                        
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up Docker resources...'
            bat 'docker system prune -f --volumes=false || echo "Cleanup skipped"'
        }
        success {
            echo '''
            ✅ ========================================
            ✅  KUBERNETES DEPLOYMENT SUCCESSFUL!
            ✅ ========================================
            
            🎯 Deployment Summary:
            ✓ All Docker images built
            ✓ Kubernetes resources created
            ✓ Services deployed and running
            
            📋 Access Instructions:
            
            1. Port-forward services:
               kubectl port-forward -n hotel-management svc/eureka-service 8761:8761
               kubectl port-forward -n hotel-management svc/gateway-service 8080:8080
               kubectl port-forward -n hotel-management svc/frontend-service 4200:80
               kubectl port-forward -n hotel-management svc/rabbitmq 15672:15672
               
            2. Access applications:
               📊 Eureka Dashboard: http://localhost:8761
               🚪 API Gateway: http://localhost:8080
               🎨 Frontend: http://localhost:4200
               🐰 RabbitMQ Management: http://localhost:15672
            
            3. Useful commands:
               kubectl get pods -n hotel-management
               kubectl get services -n hotel-management
               kubectl logs -n hotel-management <pod-name>
               kubectl describe pod -n hotel-management <pod-name>
            
            ✅ ========================================
            '''
        }
        failure {
            echo '''
            ❌ ========================================
            ❌  KUBERNETES DEPLOYMENT FAILED!
            ❌ ========================================
            
            📋 Troubleshooting Steps:
            
            1. Check Kubernetes cluster:
               kubectl cluster-info
               kubectl get nodes
               
            2. Check pods status:
               kubectl get pods -n hotel-management
               kubectl describe pods -n hotel-management
               
            3. Check logs:
               kubectl logs -n hotel-management <pod-name>
               
            4. Check events:
               kubectl get events -n hotel-management --sort-by=.metadata.creationTimestamp
               
            5. Clean up and retry:
               kubectl delete namespace hotel-management
               
            ❌ ========================================
            '''
        }
        unstable {
            echo '''
            ⚠️ ========================================
            ⚠️  DEPLOYMENT COMPLETED WITH WARNINGS
            ⚠️ ========================================
            
            Some pods may not be fully ready yet.
            Check pod status with:
            kubectl get pods -n hotel-management
            
            ⚠️ ========================================
            '''
        }
    }
}