package com.expatportal.core.service.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;

import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 
@ObjectClassDefinition(name = "Claim Service Configuration", description = "Claim service Configuration")
public @interface ClaimServiceConfiguration {
     
    
    @AttributeDefinition(name = "claim service endpoint", description = "claim service endpoint")
    String getClaimServiceEndpointURL();
    
    @AttributeDefinition(name = "claim attribute service endpoint", description = "claim attribute service endpoint")
    String getClaimAttributeEndpoint();
    
    @AttributeDefinition(name = "get pdf data end point", description = "pdf data endpoint")
    String getPdfDataEndpoint();
    
    @AttributeDefinition(name = "get member id filter end point", description = "memberid filter data endpoint")
    String getmemberIdFilterEndPoint();
    
    
}

