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
