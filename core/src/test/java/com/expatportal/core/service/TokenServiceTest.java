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
 * @author zsheik1
 *
 */
public class TokenServiceTest {

	
	TokenConfiguration config=Mockito.mock(TokenConfiguration.class);

	/**
	 * Test method for {@link com.expatportal.core.service.TokenServiceImpl#activate(com.expatportal.core.service.TokenConfiguration)}.
	 */
	@Test
	public void testActivate() {

		Mockito.when(config.configValue()).thenReturn("tokenconfig");
		Mockito.when(config.getNumberValue()).thenReturn(60);
		
		
		TokenServiceImpl serviceImpl=new TokenServiceImpl();
		serviceImpl.activate(config);
		Assert.assertEquals("Values SHould Be Equal","tokenconfig", serviceImpl.configValue());
		Assert.assertEquals("Values SHould Be Equal",60, serviceImpl.getNumberValue());
		
		
		
	}

}
