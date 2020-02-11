/**
 * 
 */
package com.expatportal.core.servlets;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.json.JSONObject;
import org.junit.Test;
import org.mockito.Mockito;

import com.expatportal.core.service.ModifyPreferenceService;

/**
 * @author achilaka
 *
 */
public class ModifyPreferenceServletTest {

	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	RequestPathInfo requestPathInfo=Mockito.mock(RequestPathInfo.class);
	ModifyPreferenceService modifyService=Mockito.mock(ModifyPreferenceService.class);
	
	//public JSONObject getDefaultResponse()
	PrintWriter printWriter=Mockito.mock(PrintWriter.class);
	NullPointerException np=Mockito.mock(NullPointerException.class);
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.ModifyPrefrenceServlet#doPost(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws IOException 
	 * @throws ServletException 
	 */
	@Test
	public void testDoPostSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException {
		String[] selectorArray= {"edit","selector2"};
		ModifyPrefrenceServlet servlet=new ModifyPrefrenceServlet();
		servlet.setService(modifyService);
		when(modifyService.modifyPrefernce(Mockito.any(), Mockito.any())).thenReturn("success");
		when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
		when(requestPathInfo.getSelectors()).thenReturn(selectorArray);
		when(response.getWriter()).thenReturn(printWriter);
		servlet.doPost(request,response);
		when(modifyService.modifyPrefernce(Mockito.any(), Mockito.any())).thenThrow(np);
		when(np.getMessage()).thenReturn("something");
		
		servlet.doPost(request,response);
	}
	
	

}
