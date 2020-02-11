package com.expatportal.core.service;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = PaymentService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = PaymentServiceConfiguration.class)
public class PaymentServiceImpl implements PaymentService {
	
	private String paymentDetailsEndpoint;
	private String bankValidationEndpoint;
	private String paymentCurrencyEndpoint;
	
	private PaymentServiceConfiguration serviceConfig;
	

	@Activate
	public void activate(PaymentServiceConfiguration config) {
		this.serviceConfig = config;
		this.paymentDetailsEndpoint = config.paymentDetailsEndpoint();
		this.bankValidationEndpoint = config.bankValidationEndpoint();
		this.paymentCurrencyEndpoint = config.paymentCurrencyEndpoint();
	}

	

	@Override
	public PaymentServiceConfiguration getServiceConfig() {
		// TODO Auto-generated method stub
		return serviceConfig;
	}



	@Override
	public String getPaymentDetailsEndpoint() {
		// TODO Auto-generated method stub
		return paymentDetailsEndpoint;
	}



	@Override
	public String getBankValidationEndpoint() {
		// TODO Auto-generated method stub
		return bankValidationEndpoint;
	}



	@Override
	public String getPaymentCurrencyEndpoint() {
		// TODO Auto-generated method stub
		return paymentCurrencyEndpoint;
	}
}
