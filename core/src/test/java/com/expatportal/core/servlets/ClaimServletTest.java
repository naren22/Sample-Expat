/**
 * 
 */
package com.expatportal.core.servlets;

import static  org.mockito.Mockito.mock;
import static  org.mockito.Mockito.when;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;

import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.json.JSONObject;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.reflect.Whitebox;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.service.MemberService;

/**
 * @author achilaka
 *
 */
public class ClaimServletTest {
	
	private Logger LOGGER=LoggerFactory.getLogger(ClaimServletTest.class);
	JSONObject inputJson=Mockito.mock(JSONObject.class);
	BufferedReader reader=Mockito.mock(BufferedReader.class);
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response=Mockito.mock(SlingHttpServletResponse.class);
	ResourceResolver resolver=Mockito.mock(ResourceResolver.class);
	RequestPathInfo requestPathInfo=Mockito.mock(RequestPathInfo.class);
	Resource resource=Mockito.mock(Resource.class);
	ValueMap valueMap=mock(ValueMap.class);
	PrintWriter writer=mock(PrintWriter.class);
	MemberService MemberService=mock(MemberService.class);
	
	
	
	
	@Test
	public void testDoGet() throws ServletException, IOException {
		String[] selectorArray={"countries","currencies"};
		ClaimServlet servlet=new ClaimServlet();
		ClaimServlet spy=Mockito.spy(servlet);	
		when(request.getResourceResolver()).thenReturn(resolver);
		when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
		when(requestPathInfo.getResourcePath()).thenReturn("some/path/value");
		when(resolver.getResource(Mockito.anyString())).thenReturn(resource);
		when(request.getParameter(Mockito.anyString())).thenReturn("req-param");
		when(requestPathInfo.getSelectors()).thenReturn(selectorArray);
		when(resource.getValueMap()).thenReturn(valueMap);
		when(valueMap.getOrDefault(Mockito.any(), Mockito.any())).thenReturn("value-from-map");
		when(response.getWriter()).thenReturn(writer);
		Whitebox.setInternalState(spy,"memberService", MemberService);
		when(MemberService.getToken()).thenReturn("Sample-Token");
		Mockito.doReturn(new JSONObject()).when(spy).getCurrenciesList(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="countries";
		Mockito.doReturn(new JSONObject()).when(spy).getCountriesList(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="members";
		Mockito.doReturn(new JSONObject()).when(spy).getMembers(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="providers";
		Mockito.doReturn(new JSONObject()).when(spy).getProvidersList(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="paymentpreference";
		Mockito.doReturn(new JSONObject()).when(spy).getPaymentPreferences(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="getPaymentInfoByCountry";
		Mockito.doReturn(new JSONObject()).when(spy).getPaymentInfoByCountry(Mockito.any());
		spy.doGet(request, response);
		selectorArray[1]="something";
		Mockito.doReturn(new JSONObject()).when(spy).getDefaultResponse();
		spy.doGet(request, response);
		
	}
	
	
	@Test
	public void testDefault() {
		
		ClaimServlet servlet=new ClaimServlet();
		servlet.getDefaultResponse();
		
		
		
	}
	
	@Test
	public void testGetCountriesList() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();
		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("countryServiceEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");

		try {
			servlet.getCountriesList(inputJson);
		}catch(Exception e) {
			LOGGER.debug(e.getMessage());
		}
		
		
	}
	
	@Test
	public void testpaymentpreference() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();
		inputJson.put("memberId","1333");

		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("paymentPreferencesEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");
		try {
			servlet.getPaymentPreferences(inputJson);	
		}catch(Exception e) {
			LOGGER.info(e.getMessage());
		}
		
		
	}
	
	@Test
	public void testmodifyprefernce() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();
		inputJson.put("memberId","1333");

		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("paymentPreferencesEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");
		try {
			servlet.modifyPaymentPreferences(inputJson);
		}catch(Exception e) {
			LOGGER.info(e.getMessage());
		}
		
		
	}
	
	@Test
	public void testcurencyservice() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();

		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("currencyServiceEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");
		try {
			servlet.getCurrenciesList(inputJson);
		}catch(Exception e) {
			LOGGER.info(e.getMessage());
		}
		

		
	}
	@Test
	public void testGetMembers() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();
		inputJson.put("memberId","1333");
		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("memberServiceEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");
		try {
			servlet.getMembers(inputJson);	
		}catch(Exception e) {
			LOGGER.info(e.getMessage());
		}
		
		
	}
	
	@Test
	public void testgetProvidersList() throws Exception {
		JSONObject inputJson=new JSONObject();
		URL url=PowerMockito.mock(URL.class);
		ClaimServlet servlet=new ClaimServlet();
		inputJson.put("memberId","1333");
		inputJson.put("tokenId", servlet.getToken("https://gateway-stage-dmz.optum.com/auth/oauth2/token"));
		inputJson.put("providerServiceEndpoint","https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/countries/v1");
		servlet.getProvidersList(inputJson);	
		
	}
	
	/**
	 * Test method for {@link com.expatportal.core.servlets.ClaimServlet#doGet(org.apache.sling.api.SlingHttpServletRequest, org.apache.sling.api.SlingHttpServletResponse)}.
	 * @throws Exception 
	 */
	@Test
	public void testGetPaymentInfo() throws Exception {
		ClaimServlet servlet=new ClaimServlet();
		Mockito.when(inputJson.optString("countryCode")).thenReturn("en-US");
		Mockito.when(inputJson.optString("currencyCode")).thenReturn("USD");
		Mockito.when(inputJson.optString("tokenId")).thenReturn("token-data");
		Mockito.when(inputJson.optString("onetimepaymentEndpoint")).thenReturn("https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/bank-account-validations/v1");
		PowerMockito.whenNew(BufferedReader.class).withAnyArguments().thenReturn(reader);
		try {
			servlet.getPaymentInfoByCountry(inputJson);	
			
		}catch(Exception e) {
			LOGGER.info(e.getMessage());
		}
		
	}
}
