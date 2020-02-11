package com.expatportal.core.servlets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.PaymentService;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "= View Claim Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.selectors=" + "paymentcurrency",
		"sling.servlet.resourceTypes=" + "/apps/expatportal/components/structure/view-past-claims",
		"sling.servlet.extensions=" + "json" })
public class PaymentCurrencyServlet extends SlingAllMethodsServlet {

	private static final long serialVersionUID = 1L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Reference
	private PaymentService paymentService;
	
	@Reference
	MemberService memberService;

	@Override
	public void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		logger.info("Inside PaymentCurrencyServlet from AJAx servlet");
		
		JSONObject responseJSON = new JSONObject();
		
		responseJSON = getCurrencyInfo(new JSONObject());
		
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		resp.setHeader("Cache-Control", "max-age=604800");
		resp.getWriter().write(responseJSON.toString());

	}

	public JSONObject getCurrencyInfo(JSONObject requestInfo) throws IOException {
		logger.info("Inside getCountriesList json");
		JSONObject json = null;
		String tokenId = memberService.getToken();
		String url = paymentService.getPaymentCurrencyEndpoint();  
		
		logger.info("Inside getCurrencyInfo json " +url + tokenId );

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
			json.put("currencyinfo", arr);

		} catch (JSONException e) {
			logger.error("Json exception ", e);
		}
		
		logger.info("Inside getCurrencyInfo json" + json.toString());
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
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
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
				try {
					while ((inputLine = in.readLine()) != null) {
						response.append(inputLine);
					} 
				} finally {
					in.close();
				}
				
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
		
		String url = requestInfo.optString("paymentPreferencesEndpoint") + "?memid=" + memberId;
		//String url = "http://dev-expats-svcs-members.uhc.com/api/payment-preferences/v1?memid=792";
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
		
		logger.info("Inside getPaymentPreferences json" + json.toString());
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
