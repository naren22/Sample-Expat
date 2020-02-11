package com.expatportal.core.service.impl;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.metatype.annotations.Designate;

import com.expatportal.core.service.ClaimSearchService;
import com.expatportal.core.service.config.ClaimServiceConfiguration;

@Component(service = ClaimSearchService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = ClaimServiceConfiguration.class)
public class ClaimSearchServiceImpl implements ClaimSearchService {
	
	private String claimServiceEndpoint;
	private String claimAttributeEndpoint;
	private String pdfDataEndpoint;
	private String memberIdFilterEndPoint;
	
	

	private ClaimServiceConfiguration serviceConfig;
	

	@Activate
	public void activate(ClaimServiceConfiguration config) {
		this.serviceConfig = config;
		this.claimServiceEndpoint = config.getClaimServiceEndpointURL();
		this.claimAttributeEndpoint = config.getClaimAttributeEndpoint();
		this.pdfDataEndpoint   = config.getPdfDataEndpoint();
		this.memberIdFilterEndPoint   = config.getmemberIdFilterEndPoint();
	}

	@Override
	public String getClaimServiceEndpoint() {
		// TODO Auto-generated method stub
		return this.claimServiceEndpoint;
	}

	@Override
	public ClaimServiceConfiguration getServiceConfig() {
		// TODO Auto-generated method stub
		return this.serviceConfig;
	}

	@Override
	public String getClaimAttributeEndpoint() {
		// TODO Auto-generated method stub
		return this.claimAttributeEndpoint;
	}
	

	@Override
	public String getPdfDataEndpoint() {
		// TODO Auto-generated method stub
		return this.pdfDataEndpoint;
	}

	@Override
	public String getmemberIdFilterEndPoint() {
		// TODO Auto-generated method stub
		return this.memberIdFilterEndPoint;
	}

}
