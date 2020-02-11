/**
 * 
 */
package com.expatportal.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.internal.util.reflection.FieldSetter;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.PaymentService;
import com.expatportal.core.service.SubmitClaimService;
import com.expatportal.core.service.TokenService;
import com.expatportal.core.service.UploadFiles;

/**
 * @author zsheik1
 *
 */
public class PaymentDetailsServletTest {

	
	MemberService memberService = Mockito.mock(MemberService.class);
	PaymentService paymentService = Mockito.mock(PaymentService.class);
	
	
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.PaymentDetailsServlet#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws IOException 
	 * @throws ServletException 
	 * @throws SecurityException 
	 * @throws NoSuchFieldException 
	 */
	@Test
	public void testdoGetSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		PaymentDetailsServlet servlet=new PaymentDetailsServlet();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("paymentService"), paymentService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		//memberService.getToken()
		//paymentService.getPaymentDetailsEndpoint()
		Mockito.when(paymentService.getPaymentDetailsEndpoint()).thenReturn("http://google.com");
		servlet.doGet(request, response);
	}
	
	
	@Test
	public void testdoGetexception() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		PaymentDetailsServlet servlet=new PaymentDetailsServlet();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("paymentService"), paymentService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		servlet.doGet(request, response);
	}
}
