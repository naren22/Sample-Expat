/**
 * 
 */
package com.expatportal.core.servlets;

import java.io.IOException;

import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Test;
import org.mockito.Mockito;

/**
 * @author nnallani
 *
 */
public class BankValidationTest {

	
   
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.BankValidationServlet#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws IOException 
	 * @throws ServletException 
	 */
	@Test
	public void testDoGetSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException {
		BankValidationServlet servlet=new BankValidationServlet();
			servlet.doGet(request, response);
	}

}
