/**
 * 
 */
package com.expatportal.core.service;

import static org.junit.Assert.*;

import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

/**
 * @author nnallani
 *
 */
public class PaymentServiceTest {
	
	PaymentServiceConfiguration config=Mockito.mock(PaymentServiceConfiguration.class);

	/**
	 * Test method for {@link com.expatportal.core.service.PaymentServiceImpl#activate(com.expatportal.core.service.PaymentServiceConfiguration)}.
	 */
	@Test
	public void testActivate() {
		Mockito.when(config.paymentDetailsEndpoint()).thenReturn("payment/endpoint");
		Mockito.when(config.bankValidationEndpoint()).thenReturn("bank/endpoint");
		PaymentServiceImpl paymentServiceImpl=new PaymentServiceImpl();
		paymentServiceImpl.activate(config);
		Assert.assertEquals("Values Should Be equal","payment/endpoint", paymentServiceImpl.getPaymentDetailsEndpoint());
		Assert.assertEquals("Values Should Be equal","bank/endpoint", paymentServiceImpl.getBankValidationEndpoint());
		Assert.assertEquals("Values Should Be equal",config, paymentServiceImpl.getServiceConfig());
	}

}
