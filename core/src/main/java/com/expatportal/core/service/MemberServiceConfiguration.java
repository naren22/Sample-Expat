package com.expatportal.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;

import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 
@ObjectClassDefinition(name = "Member Service Configuration", description = "Member Service Configuration")
public @interface MemberServiceConfiguration {
     
    @AttributeDefinition(name = "Token Endpoint", description = "Endpoint for token service")
    String tokenEndpoint();
  
    @AttributeDefinition(name = "Client Id", description = "Client Id")
    String clientId();
    
    @AttributeDefinition(name = "Client Secret", description = "Client Secret")
    String clientSecret();
    
    @AttributeDefinition(name = "Member search endpoint", description = "Member search endpoint")
    String memberSearchEndpoint();
    
    @AttributeDefinition(name = "Member Coverage endpoint", description = "Member coverage endpoint")
    String memberCoverageEndpoint();
    
    @AttributeDefinition(name = "Member Contact Information endpoint", description = "Member contact information endpoint")
    String memberContactEndpoint();
    
    @AttributeDefinition(name = "Country Information endpoint", description = "Country information endpoint")
    String countryEndpoint();
}

