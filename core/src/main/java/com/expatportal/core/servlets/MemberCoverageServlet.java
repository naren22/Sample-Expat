package com.expatportal.core.servlets;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.MemberServiceConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONObject;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "=Member Coverage servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   
                   "sling.servlet.paths="+ "/bin/expatportal/membercoverage",
                   "sling.servlet.extensions=" + ""
           })
public class MemberCoverageServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(MemberCoverageServlet.class);
	
	@Reference
	private MemberService memberService;
	
	
    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
       
        resp.getWriter().write("Response");
    }
    
    
    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
    	
    	 /***
         *Method to invoke Member coverage service and fetch the data
         * @return member coverage
         */
     
        StringBuffer response = new StringBuffer();
		try {
			String url = memberService.getMemberCoverageEndpoint();
			URL tokenURLObject = new URL(url);
			String tokenId = getToken();
			
			String memberIdentifier = req.getParameter("memberIdentifier");
			String effectiveDate = req.getParameter("effectiveDate");
			String terminationDate = req.getParameter("terminationDate");
			String clientIdentifier =req.getParameter("clientIdentifier");
			String coverageCode = req.getParameter("coverageCode");
     
			// we are passing parameters to api 
			
			String bodyData = "{\"MemberIdentifier\":\"" + memberIdentifier +"\", \"ClientIdentifier\": \"" + clientIdentifier + "\","
							+ " \"EffectiveDate\": \"" + effectiveDate + "\", " + "\"TerminationDate\": \"" + terminationDate + "\", "
							+ "\"CoverageCode\": \"" + coverageCode + "\"}";
			
			HttpURLConnection con = (HttpURLConnection) tokenURLObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer "+ tokenId);
			DataOutputStream dataOutputStreamToken = new DataOutputStream(con.getOutputStream());
			dataOutputStreamToken.writeBytes(bodyData);
			dataOutputStreamToken.flush();
			dataOutputStreamToken.close();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
			try {
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				} 
			} finally {
				in.close();
			}
			in.close();

			String jsonString = response.toString();
				//json = new JSONObject(response.toString());
				 resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("Error getting response ", e);
		}
      
    }
    
    /***
     *Method to invoke token service and fetch the token
     * @return Token key String
     */
    public String getToken() {

		StringBuffer response = new StringBuffer();
		JSONObject json = null;
		try {
			String url =memberService.getTokenEndpoint();
			URL tokenURLObject = new URL(url);

		//  Here we are passig  credentials to generate token
			
			String tokenBodyData = "{\"grant_type\":\"client_credentials\",\"client_id\":\""+memberService.getClientId() +"\","
					+ "\"client_secret\":\""+memberService.getClientSecret() +"\"}";
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
    
  
}
