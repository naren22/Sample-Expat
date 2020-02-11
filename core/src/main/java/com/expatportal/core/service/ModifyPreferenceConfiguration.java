package com.expatportal.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;

import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 
@ObjectClassDefinition(name = "Modify Preference Configuration", description = "Modify Preference Service Configuration")
public @interface ModifyPreferenceConfiguration {
     
    
    @AttributeDefinition(name = "OAuth_URL", description = "Token oauth Url")
    String getOAuth_URL();
    
    @AttributeDefinition(name = "PreferenceAPI_URL", description = "url for the preference API")
    String getPrefrenceAPI_URL();
    
    @AttributeDefinition(name = "Client_Id", description = "id for client token")
    String getClient_Id();
    
    @AttributeDefinition(name = "Client_Secret", description = "client secret of token service")
    String getClient_Secret();
    
    @AttributeDefinition(name = "Grant_Type", description = "grant type value of token service")
    String getGrant_Type();
    
   
    
    
}

