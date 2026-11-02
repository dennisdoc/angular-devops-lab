pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
    timestamps()
  }

  triggers {
    pollSCM('H/5 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh '''
          node --version
          npm --version
          npm ci
        '''
      }
    }

    stage('Jest unit tests') {
      steps {
        sh 'npm run test:ci'
      }
    }

    stage('Angular production build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Docker and Helm validation') {
      steps {
        sh '''
          docker build --tag angular-devops-lab:${GIT_COMMIT} .
          helm lint ./helm/angular-devops-lab
          helm template angular-devops-lab ./helm/angular-devops-lab
        '''
      }
    }

    stage('Package static site') {
      steps {
        sh '''
          tar -czf "angular-devops-lab-${GIT_COMMIT}.tar.gz" \
            -C dist/angular-devops-lab/browser .
        '''
        archiveArtifacts artifacts: 'angular-devops-lab-*.tar.gz', fingerprint: true
      }
    }

    stage('Upload to Artifactory CE') {
      when {
        allOf {
          branch 'main'
          expression { env.ARTIFACTORY_URL?.trim() }
        }
      }
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'artifactory-credentials',
            usernameVariable: 'ARTIFACTORY_USER',
            passwordVariable: 'ARTIFACTORY_PASSWORD'
          )
        ]) {
          sh '''
            set -eu
            artifact="angular-devops-lab-${GIT_COMMIT}.tar.gz"
            url="${ARTIFACTORY_URL%/}/artifactory/generic-local/angular-devops-lab/${GIT_COMMIT}/${artifact}"
            curl --fail --silent --show-error \
              --user "$ARTIFACTORY_USER:$ARTIFACTORY_PASSWORD" \
              --upload-file "$artifact" "$url"
          '''
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'reports/junit/unit-tests.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
    }
  }
}
