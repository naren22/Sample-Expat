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
public class ViewClaimsFilterMemberIdTest {

	
	ClaimSearchService claimSearchService = Mockito.mock(ClaimSearchService.class);
	MemberService memberService = Mockito.mock(MemberService.class);
	
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.ViewClaimsFilterMemberId#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws IOException 
	 * @throws ServletException 
	 * @throws SecurityException 
	 * @throws NoSuchFieldException 
	 */
	
	@Test
	public void testDoGetSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		ViewClaimsFilterMemberId servlet=new ViewClaimsFilterMemberId();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("claimSearchService"), claimSearchService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		Mockito.when(claimSearchService.getmemberIdFilterEndPoint()).thenReturn("http://test.com/testing");
		
		servlet.doGet(request, response);
	}
	
	@Test
	public void testDoGewithException() throws ServletException, IOException, NoSuchFieldException, SecurityException {
		ViewClaimsFilterMemberId servlet=new ViewClaimsFilterMemberId();
		StringWriter writer = new StringWriter();
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("memberService"), memberService);
		FieldSetter.setField(servlet, servlet.getClass().getDeclaredField("claimSearchService"), claimSearchService);
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter(writer));
		
		servlet.doGet(request, response);
	}
	

}
