package com.expatportal.core.service;

import org.apache.sling.api.SlingHttpServletRequest;

public interface ModifyPreferenceService {

	public String modifyPrefernce(SlingHttpServletRequest req, String method);

	public String getToken();
	
	
}
