@Library('com.optum.jenkins.pipeline.library@v0.2.x') _

import com.optum.jenkins.pipeline.library.sca.Fortify

def ARTIFACT_GROUP="expatportal"
def ARTIFACT_ID="expatportal.ui.apps"
def GIT_ORG_REPO="UHCGlobal/USMarket-ExpatPortal"
def BUILD_VERSION = currentBuild.number

//Dev
def DEV_AUTHOR="http://apvrd36193.uhc.com:8080/crx/de/"
def DEV_PUBLISH="http://apvrd36194.uhc.com:8080/crx/de/"

pipeline {
    agent none
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage("Dev Deployment") {
            agent {label "docker-maven-slave"}
            stages{
                stage("Build") {
                    steps {
                        script{
                            pom = readMavenPom file: 'pom.xml'
                            RELEASE_VERSION = pom.version
                            currentBuild.displayName = "$RELEASE_VERSION.$BUILD_VERSION"
                        }

                        //Update the version, build, and deploy to artifactory
                            glMavenBuild mavenGoals: "versions:set -DnewVersion=${RELEASE_VERSION}.${BUILD_VERSION} ; mvn clean package",
                                         runJacocoCoverage:false,
                                         uploadUnitTestResults:false,
                                         uploadJacocoResults:false

                        //Stash the artifact for later stages
                        stash includes: 'ui.apps/target/*.zip', name: 'artifact'

                        //Save the artifact with the job
                        archiveArtifacts 'ui.apps/target/**.zip, core/target/**.jar'
                    }
                }

                stage("Deploy To Author") {
                    steps {

                        //Uninstall and delete any previous version of the artifact
                        glAemUninstallPackage credentialsId: "atayl86",
                                            artifactId: "$ARTIFACT_ID",
                                            artifactGroup: "$ARTIFACT_GROUP",
                                            envUrl: "$DEV_AUTHOR",
                                            deleteArtifact: true

                        //Install artifact from maven build
                        glAemInstallPackage credentialsId: "atayl86",
                                            artifactId: "$ARTIFACT_ID",
                                            artifactGroup: "$ARTIFACT_GROUP",
                                            artifactVersion: "$RELEASE_VERSION.$BUILD_VERSION",
                                            artifactBuildPath: "ui.apps/target",
                                            envUrl: "$DEV_AUTHOR"
                        }
                    }

                    stage("Deploy To Publish"){
                    agent {label "docker-maven-slave"}
                        //options {skipDefaultCheckout true}

		    steps {
	                unstash 'artifact'
                       
			//Uninstall and delete any previous version of the artifact
			glAemUninstallPackage credentialsId: "atayl86",
                                              artifactId: "$ARTIFACT_ID",
                                              artifactGroup: "$ARTIFACT_GROUP",
                                              envUrl: "$DEV_PUBLISH",
                                              deleteArtifact: true

                        //Install artifact from maven build
                        glAemInstallPackage credentialsId: "atayl86",
                                            artifactId: "$ARTIFACT_ID",
                                            artifactGroup: "$ARTIFACT_GROUP",
                                            artifactVersion: "$RELEASE_VERSION.$BUILD_VERSION",
                                            artifactBuildPath: "ui.apps/target",
                                            envUrl: "$DEV_PUBLISH"
                    }
                }
	
	                       stage('Fortify Scan') {
                         agent {label "docker-fortify-slave"}
                            steps {
                            	glFortifyScan fortifyBuildName: "$ARTIFACT_ID",
                            	scarProjectName: 'ExPatPortalUHCGlobalUSMarket_UHGWM110-022528',
                            	fortifyJdkVersion: '1.8',
                            	isGenerateDevWorkbook: true,
                            	criticalThreshold:4,
                            	highThreshold:21,
                            	source: '**/core/src/*'

                             //Get the issue count map to send in the email
                            script{
                                def scan = new Fortify(this)
                                fortifyIssueCount = scan.getIssueCount("$ARTIFACT_ID", "/tools/fortify/HP_Fortify_SCA_and_Apps_17.20", false, '')
                                fortifyIssueCount = command("echo $fortifyIssueCount", true)
                            }

                            //Email workbook/pdf and issue counts to dev team
                            emailext attachmentsPattern: 'fortify_results/*developer-workbook.pdf',
                                 body: "$fortifyIssueCount",
                                 subject: 'Expat Portal: Fortify Scan Result',
                                 to: 'arun.chilakala@uhcglobal.com,naren.nallani@uhcglobal.com,UHCG-Infrastructure_DL@ds.uhc.com'
                    	 }
                	} // end of fortify stage
		   
		    // stage('Sonar Scan') { 
        			// steps { 
          				//glSonarMavenScan [:]
          				//sonarExclusions: "**/*.xml"
			  
					//Email sonar results to dev team
                           		//emailext body: "Please view results of sonar scan here: http://sonar.optum.com/project/activity?id=com.optum.eumarket%3AeuropeanWeb",
                               	        //subject: 'ExpatPortal: Sonar Scan Result',
                                 	//to: 'arun.chilakala@uhcglobal.com,naren.nallani@uhcglobal.com,UHCG-Infrastructure_DL@ds.uhc.com'
  				   //} 
      				//} 
		    
			}	
		
			post {
				always{
				emailext body: "$currentBuild.displayName $currentBuild.currentResult",
				subject: 'ExpatPortal: Jenkins Build Status',
				to: 'arun.chilakala@uhcglobal.com,naren.nallani@uhcglobal.com,UHCG-Infrastructure_DL@ds.uhc.com'

				}
			}
        }
    }
}
