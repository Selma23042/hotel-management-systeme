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
            echo '🔧 Vérification si Docker fonctionne...'
            bat 'docker --version'
            
            echo '📊 Utilisation du disque avant nettoyage =========='
            bat 'docker system df'
            
            echo '🧹 Nettoyage des anciennes ressources Docker...'
            // Nettoyer seulement les images dangereuses (plus rapide)
            bat 'docker image prune -f || echo "Cleanup skipped"'
            
            echo '✅ Docker est prêt en cours d\'exécution'
        }
    }
}

        
     stage('Build Docker Images') {
    steps {
        script {
            echo '🐳 Building Docker images sequentially from project root...'
            
            def services = [
                [name: 'eureka-server', path: 'microservices/eureka-server/eureka-serve/Dockerfile'],
                [name: 'api-gateway', path: 'microservices/api-gateway/api-gateway/Dockerfile'],
                [name: 'customer-service', path: 'microservices/customer-service/customer-service/Dockerfile'],
                [name: 'room-service', path: 'microservices/room-service/room-service/Dockerfile'],
                [name: 'booking-service', path: 'microservices/booking-service/booking-service/Dockerfile'],
                [name: 'billing-service', path: 'microservices/billing-service/billing-service/Dockerfile'],
                [name: 'frontend', path: 'frontend/hotel-angular-app/Dockerfile']
            ]
            
            def buildErrors = [:]
            
            services.each { service ->
                echo "🐳 Building ${service.name} image..."
                def maxRetries = 2
                def success = false
                
                // Timeout spécifique pour le frontend
                def buildTimeout = service.name == 'frontend' ? 20 : 10
                
                for (int attempt = 1; attempt <= maxRetries && !success; attempt++) {
                    try {
                        timeout(time: buildTimeout, unit: 'MINUTES') {
                            // Commande de build avec options optimisées
                            if (service.name == 'frontend') {
                                bat """
                                    docker build ^
                                    --memory=4g ^
                                    --memory-swap=4g ^
                                    --network=host ^
                                    -t ${service.name}:latest ^
                                    -f ${service.path} . ^
                                    --progress=plain ^
                                    --no-cache
                                """
                            } else {
                                bat "docker build -t ${service.name}:latest -f ${service.path} . --progress=plain"
                            }
                        }
                        echo "✅ Successfully built ${service.name}"
                        success = true
                    } catch (org.jenkinsci.plugins.workflow.steps.FlowInterruptedException e) {
                        echo "⏰ Build timeout for ${service.name} after ${buildTimeout} minutes"
                        if (attempt < maxRetries) {
                            echo "⚠️ Retrying... (attempt ${attempt}/${maxRetries})"
                            // Nettoyer les containers et images intermédiaires
                            bat 'docker system prune -f || echo "Cleanup skipped"'
                            sleep(10)
                        } else {
                            echo "❌ Failed to build ${service.name} after ${maxRetries} retries: Timeout"
                            buildErrors[service.name] = "Build timeout after ${buildTimeout} minutes"
                        }
                    } catch (Exception e) {
                        if (attempt < maxRetries) {
                            echo "⚠️ Build failed for ${service.name}, retrying... (attempt ${attempt}/${maxRetries})"
                            bat 'docker system prune -f || echo "Cleanup skipped"'
                            sleep(10)
                        } else {
                            echo "❌ Failed to build ${service.name} after ${maxRetries} retries: ${e.message}"
                            buildErrors[service.name] = e.message
                        }
                    }
                }
            }
            
            // Afficher le résumé
            if (!buildErrors.isEmpty()) {
                echo '❌ Build errors occurred for the following services:'
                buildErrors.each { name, error ->
                    echo "- ${name}: ${error}"
                }
                error("Docker image build failed for ${buildErrors.size()} service(s)")
            } else {
                echo '✅ All Docker images built successfully!'
            }
        }
    }
    post {
        always {
            script {
                echo '🧹 Cleaning up Docker resources...'
                bat 'docker system prune -f --volumes=false || echo "Cleanup skipped"'
            }
        }
    }
}
      // ========================================
// STAGE 1 : DEPLOY TO KUBERNETES
// ========================================
stage('Deploy to Kubernetes') {
    options {
        timeout(time: 20, unit: 'MINUTES')
    }
    steps {
        script {
            echo '🚀 Deploying to Kubernetes...'
            
            // Définir une fonction pour exécuter kubectl via Docker
            def kubectl = { cmd ->
                bat """
                    docker run --rm ^
                    -v "%USERPROFILE%\\.kube:/.kube" ^
                    -v "%CD%:/workspace" ^
                    -w /workspace ^
                    bitnami/kubectl:1.31.4 ${cmd}
                """
            }
            
            try {
                // Vérification préliminaire
                echo '🔍 Verifying Kubernetes cluster...'
                kubectl('cluster-info')
                kubectl('get nodes')
                
                // Phase 1: Créer le namespace, secrets et configmaps
                echo '📦 Phase 1: Creating namespace, secrets and configmaps...'
                kubectl('apply -f kubernetes/namespaces/hotel-namespace.yaml')
                kubectl('apply -f kubernetes/secrets/database-secrets.yaml')
                kubectl('apply -f kubernetes/configmaps/application-config.yaml')
                
                // Phase 2: Déployer les StatefulSets
                echo '🗄️ Phase 2: Deploying databases and RabbitMQ...'
                kubectl('apply -f kubernetes/statefulsets/postgresql-statefulset.yaml')
                kubectl('apply -f kubernetes/statefulsets/rabbitmq-statefulset.yaml')
                
                echo '⏳ Waiting 60s for databases to initialize...'
                sleep time: 60, unit: 'SECONDS'
                
                kubectl("get statefulsets -n ${env.KUBE_NAMESPACE}")
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -l app=billing-db")
                
                // Phase 3: Services des bases de données
                echo '🔗 Phase 3: Creating database and messaging services...'
                kubectl('apply -f kubernetes/services/databases-services.yaml')
                kubectl('apply -f kubernetes/services/rabbitmq-service.yaml')
                
                // Phase 4: Eureka Server
                echo '🔍 Phase 4: Deploying Eureka Server...'
                kubectl('apply -f kubernetes/deployments/eureka-deployment.yaml')
                kubectl('apply -f kubernetes/services/eureka-service.yaml')
                
                echo '⏳ Waiting 60s for Eureka to start...'
                sleep time: 60, unit: 'SECONDS'
                
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -l app=eureka-server")
                
                // Phase 5: API Gateway
                echo '🚪 Phase 5: Deploying API Gateway...'
                kubectl('apply -f kubernetes/deployments/gateway-deployment.yaml')
                kubectl('apply -f kubernetes/services/gateway-service.yaml')
                
                echo '⏳ Waiting 45s for Gateway to start...'
                sleep time: 45, unit: 'SECONDS'
                
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -l app=api-gateway")
                
                // Phase 6: Microservices
                echo '🔧 Phase 6: Deploying microservices...'
                kubectl('apply -f kubernetes/deployments/billing-service-deployment.yaml')
                kubectl('apply -f kubernetes/deployments/booking-service-deployment.yaml')
                kubectl('apply -f kubernetes/deployments/customer-service-deployment.yaml')
                kubectl('apply -f kubernetes/deployments/room-service-deployment.yaml')
                
                kubectl('apply -f kubernetes/services/billing-service.yaml')
                kubectl('apply -f kubernetes/services/booking-service.yaml')
                kubectl('apply -f kubernetes/services/customer-service.yaml')
                kubectl('apply -f kubernetes/services/room-service.yaml')
                
                echo '⏳ Waiting 60s for microservices to start...'
                sleep time: 60, unit: 'SECONDS'
                
                // Phase 7: Frontend
                echo '🎨 Phase 7: Deploying frontend...'
                kubectl('apply -f kubernetes/deployments/frontend-deployment.yaml')
                kubectl('apply -f kubernetes/services/frontend-service.yaml')
                
                echo '⏳ Waiting 30s for frontend to start...'
                sleep time: 30, unit: 'SECONDS'
                
                // Phase 8: Vérification finale
                echo '✅ Deployment completed! Checking status...'
                kubectl("get all -n ${env.KUBE_NAMESPACE}")
                
                echo '''
                ========================================
                📊 KUBERNETES DEPLOYMENT SUMMARY
                ========================================
                '''
                
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -o wide")
                kubectl("get services -n ${env.KUBE_NAMESPACE}")
                
            } catch (Exception e) {
                echo "❌ Kubernetes deployment failed: ${e.message}"
                
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -o wide")
                kubectl("describe pods -n ${env.KUBE_NAMESPACE}")
                kubectl("get services -n ${env.KUBE_NAMESPACE}")
                
                throw e
            }
        }
    }
}

// ========================================
// STAGE 2 : KUBERNETES HEALTH CHECK
// ========================================
stage('Kubernetes Health Check') {
    options {
        timeout(time: 10, unit: 'MINUTES')
    }
    steps {
        script {
            echo '🏥 Checking Kubernetes services health...'
            
            // Définir la fonction kubectl via Docker
            def kubectl = { cmd ->
                bat """
                    docker run --rm ^
                    -v "%USERPROFILE%\\.kube:/.kube" ^
                    -v "%CD%:/workspace" ^
                    -w /workspace ^
                    bitnami/kubectl:1.31.4 ${cmd}
                """
            }
            
            try {
                // Attendre que tous les pods soient prêts
                echo 'Waiting for all pods to be ready...'
                
                def maxWaitTime = 300 // 5 minutes
                def waitInterval = 15
                def timeWaited = 0
                def allPodsReady = false
                
                while (timeWaited < maxWaitTime && !allPodsReady) {
                    try {
                        def podStatus = bat(
                            script: """docker run --rm -v "%USERPROFILE%\\.kube:/.kube" bitnami/kubectl:1.31.4 get pods -n ${env.KUBE_NAMESPACE} --no-headers""",
                            returnStdout: true
                        ).trim()
                        
                        echo "Current pod status:"
                        echo podStatus
                        
                        // Vérifier si tous les pods sont Running
                        def result = bat(
                            script: """docker run --rm -v "%USERPROFILE%\\.kube:/.kube" bitnami/kubectl:1.31.4 get pods -n ${env.KUBE_NAMESPACE} --field-selector=status.phase!=Running --no-headers 2>nul""",
                            returnStdout: true
                        ).trim()
                        
                        if (result == "" || result.isEmpty()) {
                            echo "✅ All pods are running!"
                            allPodsReady = true
                            break
                        }
                        
                        echo "⏳ Waiting ${waitInterval}s for pods to be ready... (${timeWaited}/${maxWaitTime}s elapsed)"
                        sleep time: waitInterval, unit: 'SECONDS'
                        timeWaited += waitInterval
                    } catch (Exception e) {
                        echo "Warning during pod check: ${e.message}"
                        sleep time: waitInterval, unit: 'SECONDS'
                        timeWaited += waitInterval
                    }
                }
                
                if (!allPodsReady) {
                    echo "⚠️ Warning: Not all pods are ready after ${maxWaitTime}s"
                    kubectl("get pods -n ${env.KUBE_NAMESPACE}")
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
                        kubectl("get pods -n ${env.KUBE_NAMESPACE} -l app=${service}")
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
                
                kubectl("get pods -n ${env.KUBE_NAMESPACE} -o wide")
                kubectl("get services -n ${env.KUBE_NAMESPACE}")
                
                // Ne pas échouer le pipeline si c'est juste un avertissement
                currentBuild.result = 'UNSTABLE'
            }
        }
    }
}
}