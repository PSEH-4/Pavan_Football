node {
    currentBuild.result = "SUCCESS"
    try {
       stage('Checkout'){
          checkout scm
       }
       stage('Test'){
         env.NODE_ENV = "test"
         print "Environment will be : ${env.NODE_ENV}"
         sh 'node -v'
         sh 'npm prune'
         sh 'npm install'
         sh 'npm test'
         sh './build.sh'
       }
      stage('Deploy'){
        sh 'scp -i ~/jenkins.pem ./football_service.zip ubuntu@18.191.244.179:~/football_service$BUILD_NUMBER.zip'
        sh '''
ssh -i ~/jenkins.pem  -t ubuntu@18.191.244.179 << EOF
 pwd
 mkdir -p ~/football_service$BUILD_NUMBER
 unzip football_service$BUILD_NUMBER.zip -d ~/football_service$BUILD_NUMBER
 cd ~/football_service$BUILD_NUMBER/dist
 pwd
 ls -ltr
 source startServer.sh
EOF
'''
      }
    }
    catch (err) {
        throw err
    }
}
