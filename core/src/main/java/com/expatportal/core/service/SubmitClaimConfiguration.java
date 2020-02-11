package com.expatportal.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name="Submit claim configuration", description="To configure submit claim and excella URL")
public @interface SubmitClaimConfiguration {

	@AttributeDefinition(name="Submit Claim API URL")
	String getSubmitClaimAPIURL();
	
	
}
