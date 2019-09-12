pipeline {
    agent { docker { image 'node:10.16' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}