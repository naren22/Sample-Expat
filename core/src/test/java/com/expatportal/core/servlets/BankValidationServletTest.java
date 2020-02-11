/**
 * 
 */
package com.expatportal.core.servlets;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.FieldSetter;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.PaymentService;
import com.expatportal.core.servlets.BankValidationServlet;

/**
 * @author nnallani
 *
 */

public class BankValidationServletTest {
	
	PaymentService paymentService=mock(PaymentService.class);
	MemberService memberService=mock(MemberService.class);
	SlingHttpServletRequest request=mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=mock(SlingHttpServletResponse.class);
	
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.BankValidationServlet#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws Exception 
	 */
	@Test
	public void testDoGetSlingHttpServletRequestSlingHttpServletResponse() throws Exception {
		
		
		BankValidationServlet servlet=new BankValidationServlet();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("paymentService"), paymentService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		when(memberService.getToken()).thenReturn("token-id");
		when(request.getParameter(Mockito.any())).thenReturn("request-data");
		when(paymentService.getBankValidationEndpoint()).thenReturn("https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/bank-account-validations/v1");	
		servlet.doGet(request, response);
		
	}

}
