/**
 * 
 */
package com.expatportal.core.service;

import static org.junit.Assert.*;

import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.FieldSetter;

/**
 * @author achilaka
 *
 */
public class ModifyPreferenceServiceImplTest {

	ModifyPreferenceConfiguration config = Mockito.mock(ModifyPreferenceConfiguration.class);
	ResourceResolverFactory resolverFactory = Mockito.mock(ResourceResolverFactory.class);
	ResourceResolver resolver = Mockito.mock(ResourceResolver.class);

	/**
	 * Test method for
	 * {@link com.expatportal.core.service.ModifyPrefereceServiceImpl#activate(com.expatportal.core.service.ModifyPreferenceConfiguration)}.
	 */
	@Test
	public void testActivate() {

		ModifyPrefereceServiceImpl serviceImpl = new ModifyPrefereceServiceImpl();
		serviceImpl.activate(config);
		Assert.assertNotNull(serviceImpl);

	}

	/**
	 * Test method for
	 * {@link com.expatportal.core.service.ModifyPrefereceServiceImpl#getReadSystemResourceResolver()}.
	 * 
	 * @throws SecurityException
	 * @throws NoSuchFieldException
	 * @throws LoginException
	 */
	@Test
	public void testGetReadSystemResourceResolver() throws NoSuchFieldException, SecurityException, LoginException {
		ModifyPrefereceServiceImpl serviceImpl = new ModifyPrefereceServiceImpl();
		FieldSetter.setField(serviceImpl, serviceImpl.getClass().getDeclaredField("resourceFactory"), resolverFactory);
		Mockito.when(resolverFactory.getServiceResourceResolver(Mockito.any())).thenReturn(resolver);
		Assert.assertEquals("Should Be Equal", resolver, serviceImpl.getReadSystemResourceResolver());
		Mockito.when(resolverFactory.getServiceResourceResolver(Mockito.any())).thenThrow(new LoginException());
		serviceImpl.getReadSystemResourceResolver();
	}
}
