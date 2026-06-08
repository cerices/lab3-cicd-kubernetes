pipeline {
	agent {
		kubernetes {
			yamlFile 'agent.yaml'
		}
	}

	environment {
		DOCKER_IMAGE = 'cerices/tarea-final'
		IMAGE_TAG = 'claudia-erices'
		K8S_NAMESPACE = 'ns-claudia-erices'
		DEPLOYMENT_NAME = 'app-claudia-erices'
	}

	stages {
		stage('install') {
			steps {
				container('node') {
					dir('app') {
						sh 'npm install'
					}
				}
			}
		}

		stage('test') {
			steps {
				container('node') {
					dir('app') {
						sh 'npm test'
					}
				}
			}
		}

		stage('build') {
			steps {
				container('docker') {
					sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG .'
				}
			}
		}

		stage('push') {
			steps {
				container('docker') {
					withCredentials([
						usernamePassword(
							credentialsId: 'dockerhub-credentials',
							usernameVariable: 'DOCKER_USER',
							passwordVariable: 'DOCKER_PASS'
						)
					]) {
						sh '''
						  echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
						  docker push $DOCKER_IMAGE:$IMAGE_TAG
						'''
					}
				}
			}
		}

		stage('deploy') {
			steps {
				container('kubectl') {
					sh '''
					  SA=/var/run/secrets/kubernetes.io/serviceaccount

					  kubectl \
					    --server=https://kubernetes.default.svc \
					    --certificate-authority=$SA/ca.crt \
					    --token=$(cat $SA/token) \
					    apply -f entrega.yaml

					  kubectl \
					    --server=https://kubernetes.default.svc \
					    --certificate-authority=$SA/ca.crt \
					    --token=$(cat $SA/token) \
					    rollout status deployment/$DEPLOYMENT_NAME -n $K8S_NAMESPACE

					  kubectl \
					    --server=https://kubernetes.default.svc \
					    --certificate-authority=$SA/ca.crt \
					    --token=$(cat $SA/token) \
					    get pods -n $K8S_NAMESPACE
					'''
				}
			}
		}	
	}
	post {
		success {
			echo 'Pipeline ejecutado correctamente'
		}
		failure { 
			echo 'Pipeline falló. Revisar logs de Jenkins.'
		}
	}
}

