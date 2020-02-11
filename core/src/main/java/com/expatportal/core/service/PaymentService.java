package com.expatportal.core.service;

public interface PaymentService {

	public String getPaymentDetailsEndpoint();

	public String getBankValidationEndpoint();

	public PaymentServiceConfiguration getServiceConfig();
	
	public String getPaymentCurrencyEndpoint();
}
