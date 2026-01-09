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
        
        stage('Build Docker Images') {
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            parallel {
                stage('Build Eureka') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Eureka Server image...'
                        dir('microservices/eureka-server/eureka-serve') {
                            bat 'docker build -t eureka-server:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Gateway') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building API Gateway image...'
                        dir('microservices/api-gateway/api-gateway') {
                            bat 'docker build -t api-gateway:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Billing Service') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Billing Service image...'
                        dir('microservices/billing-service/billing-service') {
                            bat 'docker build -t billing-service:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Booking Service') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Booking Service image...'
                        dir('microservices/booking-service/booking-service') {
                            bat 'docker build -t booking-service:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Customer Service') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Customer Service image...'
                        dir('microservices/customer-service/customer-service') {
                            bat 'docker build -t customer-service:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Room Service') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Room Service image...'
                        dir('microservices/room-service/room-service') {
                            bat 'docker build -t room-service:latest . --progress=plain --no-cache'
                        }
                    }
                }
                
                stage('Build Frontend') {
                    options {
                        timeout(time: 10, unit: 'MINUTES')
                    }
                    steps {
                        echo '🐳 Building Frontend image...'
                        dir('frontend/hotel-angular-app') {
                            bat 'docker build -t frontend:latest . --progress=plain --no-cache'
                        }
                    }
                }
            }
            post {
                success {
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
                        // Phase 1: Créer le namespace, secrets et configmaps
                        echo '📦 Phase 1: Creating namespace, secrets and configmaps...'
                        bat 'kubectl apply -f kubernetes/namespaces/hotel-namespace.yaml'
                        bat 'kubectl apply -f kubernetes/secrets/database-secrets.yaml'
                        bat 'kubectl apply -f kubernetes/configmaps/application-config.yaml'
                        
                        // Phase 2: Déployer les StatefulSets (Bases de données + RabbitMQ)
                        echo '🗄️ Phase 2: Deploying databases and RabbitMQ...'
                        bat 'kubectl apply -f kubernetes/statefulsets/postgresql-statefulset.yaml'
                        bat 'kubectl apply -f kubernetes/statefulsets/rabbitmq-statefulset.yaml'
                        
                        echo '⏳ Waiting 60s for databases to initialize...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        // Vérifier les StatefulSets
                        bat "kubectl get statefulsets -n %KUBE_NAMESPACE%"
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=billing-db"
                        
                        // Phase 3: Créer les Services des bases de données
                        echo '🔗 Phase 3: Creating database and messaging services...'
                        bat 'kubectl apply -f kubernetes/services/databases-services.yaml'
                        bat 'kubectl apply -f kubernetes/services/rabbitmq-service.yaml'
                        
                        // Phase 4: Déployer Eureka Server
                        echo '🔍 Phase 4: Deploying Eureka Server...'
                        bat 'kubectl apply -f kubernetes/deployments/eureka-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/eureka-service.yaml'
                        
                        echo '⏳ Waiting 60s for Eureka to start...'
                        sleep time: 60, unit: 'SECONDS'
                        
                        // Vérifier Eureka
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=eureka-server"
                        bat "kubectl logs -n %KUBE_NAMESPACE% -l app=eureka-server --tail=30 || echo Cannot get logs"
                        
                        // Phase 5: Déployer API Gateway
                        echo '🚪 Phase 5: Deploying API Gateway...'
                        bat 'kubectl apply -f kubernetes/deployments/gateway-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/gateway-service.yaml'
                        
                        echo '⏳ Waiting 45s for Gateway to start...'
                        sleep time: 45, unit: 'SECONDS'
                        
                        bat "kubectl get pods -n %KUBE_NAMESPACE% -l app=api-gateway"
                        
                        // Phase 6: Déployer les Microservices
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
                        
                        // Vérifier les microservices
                        bat "kubectl get pods -n %KUBE_NAMESPACE% | findstr service"
                        
                        // Phase 7: Déployer Frontend
                        echo '🎨 Phase 7: Deploying frontend...'
                        bat 'kubectl apply -f kubernetes/deployments/frontend-deployment.yaml'
                        bat 'kubectl apply -f kubernetes/services/frontend-service.yaml'
                        
                        echo '⏳ Waiting 30s for frontend to start...'
                        sleep time: 30, unit: 'SECONDS'
                        
                        // Phase 8: Vérification finale
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
                        
                        // Diagnostics détaillés
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
                        // Attendre que tous les pods soient prêts
                        echo 'Waiting for all pods to be ready...'
                        
                        def maxWaitTime = 300 // 5 minutes
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
                            
                            // Vérifier si tous les pods sont Running et Ready
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
                        
                        // Vérifier les services individuellement
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
                        '''
                        
                        // Afficher les instructions d'accès
                        echo '''
                        
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
                        
                        // Ne pas échouer le pipeline si c'est juste un avertissement
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