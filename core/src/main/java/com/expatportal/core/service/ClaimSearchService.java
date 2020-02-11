package com.expatportal.core.service;

import com.expatportal.core.service.config.ClaimServiceConfiguration;

public interface ClaimSearchService {

	public String getClaimServiceEndpoint();
	
	public String getClaimAttributeEndpoint();
	
	public String getPdfDataEndpoint();
	
	public String getmemberIdFilterEndPoint();

	public ClaimServiceConfiguration getServiceConfig();
}
