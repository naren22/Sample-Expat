package com.expatportal.core.service;

public interface MemberService {
	
	public String getClientSecret();

	public String getClientId();

	public String getTokenEndpoint();

	public String getMemberSearchEndpoint();

	public String getMemberCoverageEndpoint();
	
	public String getToken();
	
	public String getMemberContactEndpoint();
	
	public String getCountryEndpoint();

	public MemberServiceConfiguration getServiceConfig();
}
