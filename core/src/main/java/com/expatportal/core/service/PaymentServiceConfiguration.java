package com.expatportal.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;

import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 
@ObjectClassDefinition(name = "Payment Service Configuration", description = "Payment service Configuration")
public @interface PaymentServiceConfiguration {
     
    
    @AttributeDefinition(name = "payment details endpoint", description = "payment details endpoint")
    String paymentDetailsEndpoint();
    
    @AttributeDefinition(name = "bank validation endpoint", description = "bank validation endpoint")
    String bankValidationEndpoint();
    
    @AttributeDefinition(name = "payment currency endpoint", description = "payment currency endpoint")
    String paymentCurrencyEndpoint();
    
    
    
}

