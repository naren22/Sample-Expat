package com.expatportal.core.service;

import org.apache.sling.api.SlingHttpServletRequest;

import com.expatportal.core.pojo.SubmitClaimRequest;

public interface SubmitClaimService {

	public String submitClaim(SlingHttpServletRequest req,SubmitClaimRequest request, String submissionId);
	public SubmitClaimRequest getSubmitClaimRequest(SlingHttpServletRequest req);
}
