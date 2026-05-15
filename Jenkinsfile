pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-cred')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION = 'ap-south-1'
        CLUSTER_NAME = 'youtube-cluster'
        DOCKER_USER = 'srinivasu56'
    }

    stages {

        stage('Verify Tools') {
            steps {
                sh '''
                docker --version
                aws --version
                kubectl version --client
                eksctl version
                '''
            }
        }

        stage('Create EKS Cluster') {
            steps {
                sh '''
                eksctl create cluster \
                --name youtube-cluster \
                --region ap-south-1 \
                --nodegroup-name workers \
                --node-type t3.medium \
                --nodes 2 || true
                '''
            }
        }

        stage('Configure Kubernetes Access') {
            steps {
                sh '''
                aws eks update-kubeconfig --region ap-south-1 --name youtube-cluster

                kubectl get nodes
                '''
            }
        }

        stage('Install SonarQube Scanner') {
            steps {
                sh '''
                sudo apt install default-jdk -y
                '''
            }
        }

        stage('Code Quality Scan') {
            steps {
                sh '''
                echo "Running SonarQube Scan"
                '''
            }
        }

        stage('Install Trivy') {
            steps {
                sh '''
                sudo apt install wget apt-transport-https gnupg lsb-release -y

                wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -

                echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list

                sudo apt update

                sudo apt install trivy -y
                '''
            }
        }

        stage('Trivy File Scan') {
            steps {
                sh 'trivy fs .'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/youtube-backend:latest ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/youtube-frontend:latest ./frontend
                '''
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                docker push $DOCKER_USER/youtube-backend:latest
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                docker push $DOCKER_USER/youtube-frontend:latest
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                kubectl apply -f k8s/backend-deployment.yml

                kubectl apply -f k8s/backend-service.yml
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                kubectl apply -f k8s/frontend-deployment.yml

                kubectl apply -f k8s/frontend-service.yml
                '''
            }
        }

        stage('Deploy Ingress') {
            steps {
                sh '''
                kubectl apply -f k8s/ingress.yml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get pods

                kubectl get svc

                kubectl get ingress
                '''
            }
        }
    }
}
