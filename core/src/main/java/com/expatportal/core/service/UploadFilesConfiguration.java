package com.expatportal.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;

import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 
@ObjectClassDefinition(name = "Upload Files Configuration", description = "Upload Files Service Configuration")
public @interface UploadFilesConfiguration {
     
    @AttributeDefinition(name = "Upload Destination Path", description = "Path in DAM to store files")
    String uploadDestination();
    
    @AttributeDefinition(name = "Max Upload limit (files size)", description = "Total size of files in MB",defaultValue="20")
    int allowedFileSize();

    
    @AttributeDefinition(name = "OAuth_URL", description = "virus scan oauth Url")
    String getOAuth_URL();
    
    @AttributeDefinition(name = "VirusScanAPI_URL", description = "url for the virus scan")
    String getVirusScanAPI_URL();
    
    @AttributeDefinition(name = "Client_Id", description = "id for client virus scan")
    String getClient_Id();
    
    @AttributeDefinition(name = "Client_Secret", description = "client secret for virus scan")
    String getClient_Secret();
    
    @AttributeDefinition(name = "Grant_Type", description = "grant type value for virus scan")
    String getGrant_Type();
    
    @AttributeDefinition(name = "Refresh_Token", description = "token refresh value for virus scan")
    String getRefresh_Token();
    
    @AttributeDefinition(name = "Space_Id", description = "space id value for virus scan")
    String getSpace_Id();
    
    @AttributeDefinition(name = "Status", description = "status value for virus scan")
    String getStatus();
    
    
    @AttributeDefinition(name="Excella URL")
	String getExcellaUrl();
	
	@AttributeDefinition(name="Excella Password")
	String getExcellaPass();
	
	@AttributeDefinition(name="Excella UID")
	String getExcellaUID();
	
	@AttributeDefinition(name="ExelaTimeOut")
	int getExelaTimeOut();
	
	@AttributeDefinition(name="Proxy Host")
	String getProxyHost();
	
	@AttributeDefinition(name="Proxy Port")
	String getProxyPort();
    
    
}

