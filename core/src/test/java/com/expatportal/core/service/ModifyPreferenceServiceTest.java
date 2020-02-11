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
public class ModifyPreferenceServiceTest {

	
	ModifyPreferenceConfiguration config=Mockito.mock(ModifyPreferenceConfiguration.class);

	/**
	 * Test method for {@link com.expatportal.core.service.ModifyPrefereceServiceImpl#activate(com.expatportal.core.service.ModifyPreferenceConfiguration)}.
	 */
	@Test
	public void testActivate() {

		Mockito.when(config.getOAuth_URL()).thenReturn("ModifyPreferenceConfiguration");
		Mockito.when(config.getPrefrenceAPI_URL()).thenReturn("ModifyPreferenceConfiguration");
		Mockito.when(config.getClient_Id()).thenReturn("ModifyPreferenceConfiguration");
		Mockito.when(config.getClient_Secret()).thenReturn("ModifyPreferenceConfiguration");
		Mockito.when(config.getGrant_Type()).thenReturn("ModifyPreferenceConfiguration");
		
		
		
		ModifyPrefereceServiceImpl serviceImpl=new ModifyPrefereceServiceImpl();
		serviceImpl.activate(config);
		Assert.assertEquals("Values SHould Be Equal","ModifyPreferenceConfiguration", serviceImpl.getOAuth_URL());
		Assert.assertEquals("Values SHould Be Equal","ModifyPreferenceConfiguration", serviceImpl.getPrefrenceAPI_URL());
		Assert.assertEquals("Values SHould Be Equal","ModifyPreferenceConfiguration", serviceImpl.getClient_Id());
		Assert.assertEquals("Values SHould Be Equal","ModifyPreferenceConfiguration", serviceImpl.getClient_Secret());
		Assert.assertEquals("Values SHould Be Equal","ModifyPreferenceConfiguration", serviceImpl.getGrant_Type());
		
		
		
	}

}
