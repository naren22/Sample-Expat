package com.expatportal.core.servlets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.apache.jackrabbit.oak.commons.json.JsonObject;
import org.apache.jackrabbit.oak.commons.json.JsopTokenizer;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.service.MemberService;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "= Claim Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.selectors=" + "claimService",
		"sling.servlet.resourceTypes=" + "/apps/expatportal/components/content/claim/claims",
		"sling.servlet.extensions=" + "json" })
public class ClaimServlet extends SlingAllMethodsServlet {

	private static final long serialVersionUID = 1L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Reference
	MemberService memberService;

	@Override
	public void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		logger.info("Inside ClaimServlet from AJAx servlet");
		JSONObject responseObj = new JSONObject();
		JSONObject requestInfo = new JSONObject();
		
		

		ResourceResolver resourceResolver = req.getResourceResolver();
		Resource resource = resourceResolver.getResource(req.getRequestPathInfo().getResourcePath() + "/par/claimInfo");

		String memberId = req.getParameter("memberId");
		String countryCode = req.getParameter("countryCode");
		String currencyCode = req.getParameter("currencyCode");
		
		if(resource != null) {
			ValueMap valueMap = resource.getValueMap();

			String tokenId = memberService.getToken();//getToken(valueMap.getOrDefault("tokenServiceEndpoint", "").toString());
			logger.info("tokenId " + tokenId);
			try {
				requestInfo.put("memberServiceEndpoint", valueMap.getOrDefault("memberServiceEndpoint", "").toString());
				requestInfo.put("providerServiceEndpoint", valueMap.getOrDefault("providerServiceEndpoint", "").toString());
				requestInfo.put("tokenServiceEndpoint", valueMap.getOrDefault("tokenServiceEndpoint", "").toString());
				requestInfo.put("countryServiceEndpoint", valueMap.getOrDefault("countryServiceEndpoint", "").toString());
				requestInfo.put("currencyServiceEndpoint", valueMap.getOrDefault("currencyServiceEndpoint", "").toString());
				requestInfo.put("paymentPreferencesEndpoint", valueMap.getOrDefault("paymentPreferencesEndpoint", "").toString());
				requestInfo.put("onetimepaymentEndpoint", valueMap.getOrDefault("onetimepaymentEndpoint", "").toString());
				requestInfo.put("memberId",memberId);
				requestInfo.put("tokenId",tokenId);
				requestInfo.put("countryCode",countryCode);
				logger.debug(currencyCode);
				requestInfo.put("currencyCode",currencyCode);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				logger.debug("JSON Exception setting service endpoint");
			}
		}
		String serviceSelector = req.getRequestPathInfo().getSelectors().length > 1
				? req.getRequestPathInfo().getSelectors()[1]
				: null;

		if (serviceSelector != null) {
			switch (serviceSelector) {
			case "countries":
				responseObj = getCountriesList(requestInfo);
				break;
				
			case "currencies":
				responseObj = getCurrenciesList(requestInfo);
				break;			

			case "members":
				responseObj = getMembers(requestInfo);
				break;		

			case "providers":
				responseObj = getProvidersList(requestInfo);
				break;
				
			case "paymentpreference":
				responseObj = getPaymentPreferences(requestInfo);
				break;
			
				
			case "getPaymentInfoByCountry":
				responseObj = getPaymentInfoByCountry(requestInfo);
				break;
				
				
				
			default : responseObj = getDefaultResponse();
			break;
			
			}
		}
		
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().write(responseObj.toString());

	}

	public JSONObject getCountriesList(JSONObject requestInfo) throws IOException {
		logger.info("Inside getCountriesList json");
		JSONObject json = null;

		String url = requestInfo.optString("countryServiceEndpoint");
		String tokenId = requestInfo.optString("tokenId");
		logger.info("Inside getCountriesList json " +url + tokenId );

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Content-Type", "application/json");

		con.setRequestProperty("Authorization", "Bearer "+ tokenId);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			} 
		} finally {
			in.close();
		}
		
		String jsonString = response.toString();
		try {
			JSONArray arr = new JSONArray(jsonString);
			json = new JSONObject();
			json.put("countries", arr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}
		
		logger.info("Inside getCountriesList json" + json.toString());
		return json;
	}

	public JSONObject getCurrenciesList(JSONObject requestInfo) throws IOException {
		logger.info("Inside getCurrencies service");
		JSONObject json = null;

		String url = requestInfo.optString("currencyServiceEndpoint");
		
		
		URL obj = new URL(url);
		String tokenId = requestInfo.optString("tokenId");

		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Content-Type", "application/json");

		con.setRequestProperty("Authorization", "Bearer "+ tokenId);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			} 
		} finally {
			in.close();
		}
		
		String jsonString = response.toString();
		try {
			JSONArray jsonArr = new JSONArray(jsonString);
			json = new JSONObject();
			json.put("currencies", jsonArr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}

		logger.info("Inside getCurrencies json" + json.toString());
		return json;
	}
 // start Member id service
	 public JSONObject getMembers(JSONObject requestInfo) throws IOException {
		logger.info("Inside getMembers json");
		JSONObject json = null;

		String memberId = requestInfo.optString("memberId");
		String tokenId = requestInfo.optString("tokenId");
		if (memberId != null && !"".equals(memberId)) {
			String url = requestInfo.optString("memberServiceEndpoint") + "?memid=" + memberId;
			
			URL obj = new URL(url);
			
			logger.info("Inside getMembers json {0} {1}" + memberId + tokenId + requestInfo.optString("memberServiceEndpoint"));

			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("User-Agent", "Mozilla/5.0");
			con.setRequestProperty("Content-Type", "application/json");

		    con.setRequestProperty("Authorization", "Bearer "+ tokenId);

			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();
			try {
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				} 
			} finally {
				in.close();
			}
			
			String jsonString = response.toString();

			logger.info("Inside getMembers jsonString {0}" + jsonString);

			try {
				JSONArray arr = new JSONArray(jsonString);
				json = new JSONObject();
				json.put("members", arr);

			} catch (JSONException e) {
				logger.error("Json exception ", e);
			}
		}
		
		logger.info("Inside getMembers json" + json.toString());
	
	 return json;
	 }
	// END MEMBER ID SERVICE
	public JSONObject getProvidersList(JSONObject requestInfo) throws IOException {
		logger.info("Inside getProvidersList json");
		JSONObject json = new JSONObject();
		try {
			String memberId = requestInfo.optString("memberId");
			String tokenId = requestInfo.optString("tokenId");
			if (memberId != null && !"".equals(memberId)) {
				String url = requestInfo.optString("providerServiceEndpoint") + "?memberId=" + memberId + "&count=3";
				URL obj = new URL(url);
				logger.info("Inside getProvidersList json {} {}", memberId, tokenId);

				HttpURLConnection con = (HttpURLConnection) obj.openConnection();
				con.setRequestMethod("GET");
				con.setRequestProperty("User-Agent", "Mozilla/5.0");
				con.setRequestProperty("Content-Type", "application/json");

				con.setRequestProperty("Authorization", "Bearer " + tokenId);

				BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
				String inputLine;
				StringBuffer response = new StringBuffer();
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				String jsonString = response.toString();
				logger.info("Inside providers json response string" + jsonString);

				JSONArray arr = new JSONArray(jsonString);
				json.put("providers", arr);

			}
		} catch (Exception e) {
			logger.info("Json exception ", e);
		}

		logger.info("Inside providers json response" + json.toString());
		return json;
	}


	public String getToken(String serviceUrl) {

		StringBuffer response = new StringBuffer();
		JSONObject json = null;
		try {
			String url =serviceUrl;
			URL tokenURLObject = new URL(url);

			String tokenBodyData = "{\"grant_type\":\"client_credentials\",\"client_id\":\"JqDBErWoPao5XUjiHQILiBYtNJjEKmpU\",\"client_secret\":\"jimagdJ8EtlZ4e3ZTzTAeP6qnIHXCLtW\"}";
			HttpURLConnection tokenConnection = (HttpURLConnection) tokenURLObject.openConnection();
			tokenConnection.setDoOutput(true);
			tokenConnection.setRequestMethod("POST");
			tokenConnection.setRequestProperty("Content-Type", "application/json");
			DataOutputStream dataOutputStreamToken = new DataOutputStream(tokenConnection.getOutputStream());
			dataOutputStreamToken.writeBytes(tokenBodyData);
			dataOutputStreamToken.flush();
			dataOutputStreamToken.close();
			BufferedReader inputToken = new BufferedReader(new InputStreamReader(tokenConnection.getInputStream()));

			String inputLine;
			try {
				while ((inputLine = inputToken.readLine()) != null) {
					response.append(inputLine);
				} 
			} finally {
				inputToken.close();
			}
			
			String jsonString = response.toString();
				json = new JSONObject(response.toString());

		} catch (Exception e) {
			logger.error("ERror getting token ", e);
		}


		return json != null ? json.optString("access_token") : "";

	}
	
	public JSONObject getDefaultResponse() {
		JSONObject jsonObj = new JSONObject();		
		try {
			jsonObj.put("response", "no service called, please choose selector");
		} catch (JSONException e) {
			logger.info("JSON Error in getDefaultResponse", e.getMessage());
		}
		
		return jsonObj;
	}
	
	public JSONObject getPaymentPreferences(JSONObject requestInfo) throws IOException {
		logger.info("Inside getPaymentPreferences json");
		JSONObject json = null;
		String memberId = requestInfo.optString("memberId");
		
		String url = requestInfo.optString("paymentPreferencesEndpoint") + "?memid=" + memberId;//+"&timestamp="+ System.currentTimeMillis();
		//String url = "http://dev-expats-svcs-members.uhc.com/api/payment-preferences/v1?memid=792&timestamp=S";
		String tokenId = requestInfo.optString("tokenId");
		logger.info("Inside getPaymentPreferences json " +url + tokenId );

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Content-Type", "application/json");

		con.setRequestProperty("Authorization", "Bearer "+ tokenId);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			} 
		} finally {
			in.close();
		}
		
		String jsonString = response.toString();
		try {
			JSONArray arr = new JSONArray(jsonString);
			json = new JSONObject();
			json.put("preferences", arr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}
		
		if(json!=null) {
			logger.info("Inside getPaymentPreferences json" + json.toString());
		}
		return json;
	}
	
	
	public JSONObject modifyPaymentPreferences(JSONObject requestInfo) throws IOException {
		logger.info("Inside Modify Preference");
		JSONObject json = null;
		//String memberId = requestInfo.optString("memberId");
		
		String url = requestInfo.optString("paymentPreferencesEndpoint");
		//String url = "http://dev-expats-svcs-members.uhc.com/api/payment-preferences/v1?memid=792";
		String tokenId = requestInfo.optString("tokenId");
		logger.info("Inside getPaymentPreferences json " +url + tokenId );

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		
		con.setRequestMethod("PUT");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Content-Type", "application/json");

		con.setRequestProperty("Authorization", "Bearer "+ tokenId);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			} 
		} finally {
			in.close();
		}
		in.close();
		String jsonString = response.toString();
		
		logger.debug("Response :"+jsonString);
		try {
			JSONArray arr = new JSONArray(jsonString);
			json = new JSONObject();
			json.put("preferences", arr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}
		
		logger.info("Inside getPaymentPreferences json" + json.toString());
		return json;
	}



public JSONObject getPaymentInfoByCountry(JSONObject requestInfo) throws IOException {
	logger.info("Inside getPaymentInfoByCountry json");
	JSONObject json = null;

	String countryCode = requestInfo.optString("countryCode");
	String currencyCode = requestInfo.optString("currencyCode");
	String tokenId = requestInfo.optString("tokenId");
	if (countryCode != null && !"".equals(countryCode) && currencyCode != null && !"".equals(currencyCode)) {
		String url = requestInfo.optString("onetimepaymentEndpoint") + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode;
		//String url = "https://gateway-stage-dmz.optum.com/api/stg/cdm/uhcg-gi/bank-account-validations/v1?countryCode=" + countryCode;
		URL obj = new URL(url);
		logger.debug(url);
		logger.info("Inside getPaymentInfoByCountry json {0} {1}" + countryCode + tokenId + requestInfo.optString("onetimepaymentEndpoint"));

		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Content-Type", "application/json");

	    con.setRequestProperty("Authorization", "Bearer "+ tokenId);
 
		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			} 
		} finally {
			in.close();
		}
		
		String jsonString = response.toString();

		logger.info("Inside getPaymentInfoByCountry jsonString {0}" + jsonString);

		try {
			JSONArray arr = new JSONArray(jsonString);
			json = new JSONObject();
			json.put("getPaymentInfoByCountry", arr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}
	}
	
	logger.info("Inside getPaymentInfoByCountry json" + json.toString());

 return json;
 }
}
