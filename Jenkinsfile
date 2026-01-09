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
        PATH = "${JAVA_HOME}\\bin;${MAVEN_HOME}\\bin;C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
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
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
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
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
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
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
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
                            bat "mvn test -Dmaven.repo.local=%MAVEN_LOCAL_REPO%"
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
        
        stage('Stop Running Containers') {
            steps {
                script {
                    echo '🛑 Stopping existing containers and freeing ports...'
                    
                    // Arrêter docker-compose
                    dir('docker') {
                        bat '''
                            echo Stopping Docker Compose services...
                            docker-compose down -v --remove-orphans 2>nul || echo No containers to stop
                        '''
                    }
                    
                    // Libérer les ports - VERSION CORRIGÉE
                    bat '''
                        @echo off
                        echo.
                        echo Killing processes on critical ports...
                        
                        REM Function to kill process on port
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8761" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8761
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8080
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8081
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8082" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8082
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8083" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8083
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8084" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 8084
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4200" ^| findstr "LISTENING"') do (
                            echo Killing process %%a on port 4200
                            taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                        )
                        
                        echo.
                        echo Waiting 5 seconds for ports to be released...
                        timeout /t 5 /nobreak >nul 2>&1
                        
                        echo.
                        echo Port cleanup completed!
                        exit 0
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo '🐳 Building Docker images locally...'
                    dir('docker') {
                        bat 'docker-compose build'
                    }
                }
            }
        }
        
        stage('Deploy Application') {
    steps {
        script {
            echo '🚀 Deploying application with sequential startup...'
            dir('docker') {
                try {
                    // Phase 1: Infrastructure de base
                    echo '📊 Phase 1: Starting infrastructure services...'
                    bat '''
                        docker-compose up -d billing-db customer-db booking-db room-db rabbitmq elasticsearch
                    '''
                    echo '⏳ Waiting 20s for databases to initialize...'
                    sleep time: 20, unit: 'SECONDS'
                    
                    // Phase 2: Eureka Server avec gestion d'erreur robuste
                    echo '🔍 Phase 2: Starting Eureka Server...'
                    
                    def eurekaHealthy = false
                    def maxAttempts = 3
                    
                    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
                        echo "Eureka startup attempt ${attempt}/${maxAttempts}..."
                        
                        // Arrêter Eureka s'il existe déjà
                        bat 'docker-compose stop eureka-server 2>nul || echo Eureka not running'
                        bat 'docker-compose rm -f eureka-server 2>nul || echo Eureka container removed'
                        
                        sleep time: 3, unit: 'SECONDS'
                        
                        // Démarrer Eureka
                        bat 'docker-compose up -d eureka-server'
                        
                        // Attendre plus longtemps pour le démarrage
                        echo "Waiting 40s for Eureka to start..."
                        sleep time: 40, unit: 'SECONDS'
                        
                        // Afficher les logs pour diagnostic
                        echo "Eureka Server logs:"
                        bat 'docker logs eureka-server --tail 50 2>nul || echo Cannot get logs'
                        
                        // Tester la santé d'Eureka
                        def healthStatus = bat(
                            script: '''
                                curl -s -o nul -w "%%{http_code}" http://localhost:8761/actuator/health
                            ''',
                            returnStdout: true
                        ).trim()
                        
                        echo "Health check status code: ${healthStatus}"
                        
                        if (healthStatus == '200') {
                            echo '✅ Eureka Server is healthy!'
                            eurekaHealthy = true
                            break
                        } else {
                            echo "⚠️ Eureka health check failed with status: ${healthStatus}"
                            
                            // Vérifier si le conteneur tourne
                            def containerStatus = bat(
                                script: 'docker inspect -f "{{.State.Status}}" eureka-server 2>nul',
                                returnStdout: true
                            ).trim()
                            
                            echo "Container status: ${containerStatus}"
                            
                            if (attempt < maxAttempts) {
                                echo '🔄 Retrying Eureka startup...'
                            }
                        }
                    }
                    
                    if (!eurekaHealthy) {
                        echo '❌ CRITICAL: Eureka Server failed to start after ${maxAttempts} attempts'
                        echo '📋 Full Eureka logs:'
                        bat 'docker logs eureka-server 2>nul || echo No logs available'
                        error('Eureka Server startup failed')
                    }
                    
                    // Phase 3: API Gateway
                    echo '🚪 Phase 3: Starting API Gateway...'
                    bat 'docker-compose up -d api-gateway'
                    sleep time: 25, unit: 'SECONDS'
                    
                    // Vérifier l'enregistrement dans Eureka
                    echo 'Checking Gateway registration...'
                    bat '''
                        curl -s http://localhost:8761/eureka/apps || echo "Cannot check Eureka registry"
                    '''
                    
                    // Phase 4: Microservices en parallèle
                    echo '🔧 Phase 4: Starting microservices...'
                    bat '''
                        docker-compose up -d room-service customer-service booking-service billing-service
                    '''
                    sleep time: 30, unit: 'SECONDS'
                    
                    // Phase 5: Frontend
                    echo '🎨 Phase 5: Starting frontend...'
                    bat 'docker-compose up -d frontend'
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Phase 6: Monitoring (optionnel)
                    echo '📊 Phase 6: Starting monitoring stack...'
                    bat 'docker-compose up -d kibana logstash prometheus grafana alertmanager'
                    sleep time: 5, unit: 'SECONDS'
                    
                    // Vérification finale
                    echo '✅ Deployment completed! Verifying services...'
                    bat 'docker-compose ps'
                    
                } catch (Exception e) {
                    echo "❌ Deployment failed: ${e.message}"
                    
                    // Diagnostics complets
                    bat '''
                        echo.
                        echo ========== CONTAINER STATUS ==========
                        docker-compose ps
                        echo.
                        echo ========== EUREKA LOGS ==========
                        docker logs eureka-server --tail 100 2>nul || echo "No Eureka logs"
                        echo.
                        echo ========== DOCKER NETWORKS ==========
                        docker network ls
                        echo.
                        echo ========== PORT USAGE ==========
                        netstat -ano | findstr "8761 8080 8081 8082 8083 8084"
                    '''
                    
                    throw e
                }
            }
        }
    }
}
        
        stage('Health Check') {
            steps {
                script {
                    echo '🏥 Checking service health...'
                    
                    def services = [
                        [name: 'Eureka Server', url: 'http://localhost:8761/actuator/health'],
                        [name: 'API Gateway', url: 'http://localhost:8080/actuator/health'],
                        [name: 'Room Service', url: 'http://localhost:8081/actuator/health'],
                        [name: 'Customer Service', url: 'http://localhost:8083/actuator/health'],
                        [name: 'Booking Service', url: 'http://localhost:8082/actuator/health'],
                        [name: 'Billing Service', url: 'http://localhost:8084/actuator/health']
                    ]
                    
                    services.each { service ->
                        retry(3) {
                            sleep time: 5, unit: 'SECONDS'
                            bat """
                                curl -f ${service.url} || exit 1
                            """
                            echo "✅ ${service.name} is healthy"
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            bat 'docker system prune -f --volumes=false || echo "Cleanup skipped"'
        }
        success {
            echo '''
            ✅ ========================================
            ✅  PIPELINE EXECUTED SUCCESSFULLY!
            ✅ ========================================
            
            🌐 Application URLs:
            📊 Eureka Dashboard: http://localhost:8761
            🚪 API Gateway: http://localhost:8080
            🛏️  Room Service: http://localhost:8081
            👤 Customer Service: http://localhost:8083
            📅 Booking Service: http://localhost:8082
            💰 Billing Service: http://localhost:8084
            🎨 Frontend: http://localhost:4200
            🐰 RabbitMQ: http://localhost:15672 (admin/admin)
            
            ✅ ========================================
            '''
        }
        failure {
            echo '''
            ❌ ========================================
            ❌  PIPELINE FAILED!
            ❌ ========================================
            
            📋 Troubleshooting:
            1. Check Docker Desktop is running
            2. Verify ports are not in use
            3. Check Jenkins logs
            4. Run: docker-compose logs
            
            ❌ ========================================
            '''
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}