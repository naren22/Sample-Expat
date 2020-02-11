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

import com.expatportal.core.service.ClaimSearchService;
import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.TokenService;
import com.expatportal.core.service.UploadFiles;

/**
 * @author zsheik1
 *
 */
public class GetPdfFromEncodeDataServletTest {

	
	ClaimSearchService claimSearchService = Mockito.mock(ClaimSearchService.class);
	MemberService memberService = Mockito.mock(MemberService.class);
	
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
		GetPdfFromEncodedDataServlet servlet=new GetPdfFromEncodedDataServlet();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("claimSearchService"), claimSearchService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		Mockito.when(memberService.getToken()).thenReturn("http://google.com");
		Mockito.when(claimSearchService.getPdfDataEndpoint()).thenReturn("http://google.com");
		
		
		servlet.doPost(request, response);
	}
	
	@Test
	public void testDoGetSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		GetPdfFromEncodedDataServlet servlet=new GetPdfFromEncodedDataServlet();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("claimSearchService"), claimSearchService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		Mockito.when(memberService.getToken()).thenReturn("http://google.com");
		Mockito.when(claimSearchService.getPdfDataEndpoint()).thenReturn("http://google.com");
		
		servlet.doGet(request, response);
	}

}
