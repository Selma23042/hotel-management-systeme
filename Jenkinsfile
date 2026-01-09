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
                    echo '🚀 Deploying application...'
                    dir('docker') {
                        bat 'docker-compose up -d'
                    }
                    
                    echo '⏳ Waiting for services to be healthy...'
                    sleep time: 30, unit: 'SECONDS'
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