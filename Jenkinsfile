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
            echo '🛑 Stopping existing containers thoroughly...'
            
            dir('docker') {
                bat '''
                    echo Stopping all services...
                    docker-compose down -v --remove-orphans 2>nul || echo No containers to stop
                    
                    echo Waiting for cleanup...
                    timeout /t 5 /nobreak >nul 2>&1
                    
                    echo Pruning networks...
                    docker network prune -f
                '''
            }
            
            // Libérer les ports critiques
            bat '''
                @echo off
                echo.
                echo Killing processes on critical ports...
                
                for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8761" ^| findstr "LISTENING"') do (
                    echo Killing process %%a on port 8761
                    taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                )
                
                for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
                    echo Killing process %%a on port 8080
                    taskkill /F /PID %%a 2>nul || echo Process %%a already terminated
                )
                
                echo.
                echo Port cleanup completed!
                timeout /t 5 /nobreak >nul 2>&1
            '''
        }
    }
}

stage('Deploy Application') {
    steps {
        script {
            echo '🚀 Deploying application with improved error handling...'
            dir('docker') {
                try {
                    // Arrêter et nettoyer complètement
                    echo '🧹 Complete cleanup...'
                    bat '''
                        docker-compose down -v --remove-orphans 2>nul || echo "Nothing to stop"
                        docker network prune -f
                    '''
                    
                    sleep time: 5, unit: 'SECONDS'
                    
                    // Phase 1: Infrastructure
                    echo '📊 Phase 1: Starting databases...'
                    bat 'docker-compose up -d billing-db customer-db booking-db room-db'
                    sleep time: 15, unit: 'SECONDS'
                    
                    // Phase 2: Message broker
                    echo '🐰 Phase 2: Starting RabbitMQ...'
                    bat 'docker-compose up -d rabbitmq'
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Phase 3: Eureka avec retry
                    echo '🔍 Phase 3: Starting Eureka Server (with retries)...'
                    def eurekaStarted = false
                    def maxRetries = 3
                    
                    for (int i = 1; i <= maxRetries; i++) {
                        echo "Eureka start attempt ${i}/${maxRetries}..."
                        
                        bat 'docker-compose up -d eureka-server'
                        sleep time: 30, unit: 'SECONDS'
                        
                        // Vérifier les logs
                        bat 'docker logs eureka-server --tail 100'
                        
                        // Tester la santé
                        def exitCode = bat(script: 'curl -f http://localhost:8761/actuator/health', returnStatus: true)
                        
                        if (exitCode == 0) {
                            echo '✅ Eureka is healthy!'
                            eurekaStarted = true
                            break
                        } else {
                            echo "⚠️ Eureka not ready yet. Attempt ${i}/${maxRetries} failed"
                            if (i < maxRetries) {
                                echo '🔄 Restarting Eureka...'
                                bat 'docker-compose restart eureka-server'
                                sleep time: 20, unit: 'SECONDS'
                            }
                        }
                    }
                    
                    if (!eurekaStarted) {
                        error('❌ Eureka Server failed to start after multiple attempts')
                    }
                    
                    // Phase 4: API Gateway
                    echo '🚪 Phase 4: Starting API Gateway...'
                    bat 'docker-compose up -d api-gateway'
                    sleep time: 20, unit: 'SECONDS'
                    
                    // Phase 5: Microservices
                    echo '🔧 Phase 5: Starting microservices...'
                    bat 'docker-compose up -d room-service customer-service booking-service billing-service'
                    sleep time: 25, unit: 'SECONDS'
                    
                    // Phase 6: Frontend
                    echo '🎨 Phase 6: Starting frontend...'
                    bat 'docker-compose up -d frontend'
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Phase 7: Monitoring (optional)
                    echo '📊 Phase 7: Starting monitoring stack...'
                    bat 'docker-compose up -d elasticsearch kibana logstash prometheus grafana alertmanager'
                    
                    echo '✅ All services deployed successfully!'
                    
                } catch (Exception e) {
                    echo "❌ Deployment failed: ${e.message}"
                    echo '📋 Getting container logs for debugging...'
                    
                    bat '''
                        echo.
                        echo ========== EUREKA LOGS ==========
                        docker logs eureka-server --tail 100 2>nul || echo "Eureka container not found"
                        echo.
                        echo ========== DOCKER PS ==========
                        docker ps -a
                        echo.
                        echo ========== DOCKER COMPOSE PS ==========
                        docker-compose ps
                    '''
                    
                    throw e
                }
            }
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
            echo '🚀 Deploying application with improved error handling...'
            dir('docker') {
                try {
                    // Arrêter et nettoyer complètement
                    echo '🧹 Complete cleanup...'
                    bat '''
                        docker-compose down -v --remove-orphans 2>nul || echo "Nothing to stop"
                        docker network prune -f
                    '''
                    
                    sleep time: 5, unit: 'SECONDS'
                    
                    // Phase 1: Infrastructure
                    echo '📊 Phase 1: Starting databases...'
                    bat 'docker-compose up -d billing-db customer-db booking-db room-db'
                    sleep time: 15, unit: 'SECONDS'
                    
                    // Phase 2: Message broker
                    echo '🐰 Phase 2: Starting RabbitMQ...'
                    bat 'docker-compose up -d rabbitmq'
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Phase 3: Eureka avec retry
                    echo '🔍 Phase 3: Starting Eureka Server (with retries)...'
                    def eurekaStarted = false
                    def maxRetries = 3
                    
                    for (int i = 1; i <= maxRetries; i++) {
                        echo "Eureka start attempt ${i}/${maxRetries}..."
                        
                        bat 'docker-compose up -d eureka-server'
                        sleep time: 30, unit: 'SECONDS'
                        
                        // Vérifier les logs
                        bat 'docker logs eureka-server --tail 100'
                        
                        // Tester la santé
                        def exitCode = bat(script: 'curl -f http://localhost:8761/actuator/health', returnStatus: true)
                        
                        if (exitCode == 0) {
                            echo '✅ Eureka is healthy!'
                            eurekaStarted = true
                            break
                        } else {
                            echo "⚠️ Eureka not ready yet. Attempt ${i}/${maxRetries} failed"
                            if (i < maxRetries) {
                                echo '🔄 Restarting Eureka...'
                                bat 'docker-compose restart eureka-server'
                                sleep time: 20, unit: 'SECONDS'
                            }
                        }
                    }
                    
                    if (!eurekaStarted) {
                        error('❌ Eureka Server failed to start after multiple attempts')
                    }
                    
                    // Phase 4: API Gateway
                    echo '🚪 Phase 4: Starting API Gateway...'
                    bat 'docker-compose up -d api-gateway'
                    sleep time: 20, unit: 'SECONDS'
                    
                    // Phase 5: Microservices
                    echo '🔧 Phase 5: Starting microservices...'
                    bat 'docker-compose up -d room-service customer-service booking-service billing-service'
                    sleep time: 25, unit: 'SECONDS'
                    
                    // Phase 6: Frontend
                    echo '🎨 Phase 6: Starting frontend...'
                    bat 'docker-compose up -d frontend'
                    sleep time: 10, unit: 'SECONDS'
                    
                    // Phase 7: Monitoring (optional)
                    echo '📊 Phase 7: Starting monitoring stack...'
                    bat 'docker-compose up -d elasticsearch kibana logstash prometheus grafana alertmanager'
                    
                    echo '✅ All services deployed successfully!'
                    
                } catch (Exception e) {
                    echo "❌ Deployment failed: ${e.message}"
                    echo '📋 Getting container logs for debugging...'
                    
                    bat '''
                        echo.
                        echo ========== EUREKA LOGS ==========
                        docker logs eureka-server --tail 100 2>nul || echo "Eureka container not found"
                        echo.
                        echo ========== DOCKER PS ==========
                        docker ps -a
                        echo.
                        echo ========== DOCKER COMPOSE PS ==========
                        docker-compose ps
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