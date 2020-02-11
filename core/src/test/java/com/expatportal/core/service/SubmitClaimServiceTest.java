/**
 * 
 */
package com.expatportal.core.service;

import static org.junit.Assert.*;

import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

/**
 * @author zsheik1
 *
 */
public class SubmitClaimServiceTest {

	
	SubmitClaimServiceImpl config=Mockito.mock(SubmitClaimServiceImpl.class);
	ModifyPrefereceServiceImpl tokenservice=Mockito.mock(ModifyPrefereceServiceImpl.class);
	
	@Mock
	SlingHttpServletRequest request ;

	/**
	 * Test method for {@link com.expatportal.core.service.SubmitClaimServiceImpl#activate(com.expatportal.core.service.SubmitClaimConfiguration)}.
	 */
	@Test
	public void testActivate() {

		Mockito.when(config.submitClaim(request,null,null)).thenReturn("SubmitClaimConfiguration");
		Mockito.when(tokenservice.getToken()).thenReturn("SubmitClaimConfiguration");
		//Mockito.when(config.getNumberValue()).thenReturn(60);
		
		
		SubmitClaimServiceImpl serviceImpl=new SubmitClaimServiceImpl();
		//serviceImpl.activate(config);
		serviceImpl.submitClaim(request,null,null);
		//Assert.assertEquals("Values SHould Be Equal","SubmitClaimConfiguration", serviceImpl.submitClaim(request));
		//Assert.assertEquals("Values SHould Be Equal",60, serviceImpl.getNumberValue());
		
		
		
	}

}
