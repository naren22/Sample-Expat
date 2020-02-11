/**
 * 
 */
package com.expatportal.core.service;

import static org.junit.Assert.*;

import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

/**
 * @author nnallani
 *
 */
public class MemberServiceTest {

	
	MemberServiceConfiguration config=Mockito.mock(MemberServiceConfiguration.class);

	/**
	 * Test method for {@link com.expatportal.core.service.MemberServiceImpl#activate(com.expatportal.core.service.MemberServiceConfiguration)}.
	 */
	@Test
	public void testActivate() {

		Mockito.when(config.clientSecret()).thenReturn("clientsecret");
		Mockito.when(config.clientId()).thenReturn("clientid");
		Mockito.when(config.tokenEndpoint()).thenReturn("endpoint");
		Mockito.when(config.memberCoverageEndpoint()).thenReturn("coverage-endpoint");	
		Mockito.when(config.memberSearchEndpoint()).thenReturn("search-endpoint");
		MemberServiceImpl memberServiceImpl=new MemberServiceImpl();
		memberServiceImpl.activate(config);
		Assert.assertEquals("Values SHould Be Equal","clientsecret", memberServiceImpl.getClientSecret());
		Assert.assertEquals("Values SHould Be Equal","clientid", memberServiceImpl.getClientId());
		Assert.assertEquals("Values SHould Be Equal","endpoint", memberServiceImpl.getTokenEndpoint());
		Assert.assertEquals("Values SHould Be Equal","coverage-endpoint", memberServiceImpl.getMemberCoverageEndpoint());
		Assert.assertEquals("Values SHould Be Equal","search-endpoint", memberServiceImpl.getMemberSearchEndpoint());
		Assert.assertEquals("Values SHould Be Equal",config, memberServiceImpl.getServiceConfig());
		
		
	}

}
