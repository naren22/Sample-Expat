package com.expatportal.core.service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.servlets.MemberClaimSearchServlet;

@Component(service = MemberService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = MemberServiceConfiguration.class)
public class MemberServiceImpl implements MemberService {
	private final Logger logger = LoggerFactory.getLogger(MemberService.class);
	
	private String clientSecret;
	private String clientId;
	private String tokenEndpoint;
	private String memberSearchEndpoint;
	private String memberCoverageEndpoint;
	private String memberContactEndpoint;
	private String countryEndpoint;
	
	private MemberServiceConfiguration config;
	
	public String getClientSecret() {
		return clientSecret;
	}

	public String getClientId() {
		return clientId;
	}

	public String getTokenEndpoint() {
		return tokenEndpoint;
	}

	public String getMemberSearchEndpoint() {
		return memberSearchEndpoint;
	}

	public String getMemberCoverageEndpoint() {
		return memberCoverageEndpoint;
	}

	public MemberServiceConfiguration getConfig() {
		return config;
	}
	
	public String getMemberContactEndpoint() {
		return memberContactEndpoint;
	}
	
	public String getCountryEndpoint() {
		return countryEndpoint;
	}
	

	@Activate
	public void activate(MemberServiceConfiguration config) {
		this.config = config;
		this.clientSecret = config.clientSecret();
		this.clientId = config.clientId();
		this.tokenEndpoint = config.tokenEndpoint();
		this.memberCoverageEndpoint = config.memberCoverageEndpoint();
		this.memberSearchEndpoint = config.memberSearchEndpoint();
		this.memberContactEndpoint = config.memberContactEndpoint();
		this.countryEndpoint = config.countryEndpoint();
	}
	
	public String getToken() {
		StringBuffer response = new StringBuffer();
		JSONObject json = null;
		try {
			String url = getTokenEndpoint();
			URL tokenURLObject = new URL(url);
			logger.info("URLToken service " + url);
		//  Here we are passig  credentials to generate token
			
			String tokenBodyData = "{\"grant_type\":\"client_credentials\",\"client_id\":\""+getClientId() +"\","
					+ "\"client_secret\":\""+getClientSecret() +"\"}";
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
		logger.info("Tokenresponse service " + json.optString("access_token"));
		return json != null ? json.optString("access_token") : "";
	}

	@Override
	public MemberServiceConfiguration getServiceConfig() {
		// TODO Auto-generated method stub
		return this.config;
	}



	
}
