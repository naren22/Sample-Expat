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

import com.expatportal.core.service.SubmitClaimService;
import com.expatportal.core.service.TokenService;
import com.expatportal.core.service.UploadFiles;

/**
 * @author zsheik1
 *
 */
public class SubmitClaimServletTest {

	
	SubmitClaimService service = Mockito.mock(SubmitClaimService.class);
	UploadFiles uploadservice = Mockito.mock(UploadFiles.class);
	
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.RemoveFileServlet#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws IOException 
	 * @throws ServletException 
	 * @throws SecurityException 
	 * @throws NoSuchFieldException 
	 */
	@Test
	public void testDoPostSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		SubmitClaimServlet servlet=new SubmitClaimServlet();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("service"), service);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("uploadservice"), uploadservice);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		
		servlet.doPost(request, response);
	}
	
}
