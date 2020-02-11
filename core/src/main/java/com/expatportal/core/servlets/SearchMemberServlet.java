package com.expatportal.core.servlets;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONObject;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.MemberServiceConfiguration;


/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "=Search member servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   
                   "sling.servlet.paths="+ "/bin/expatportal/searchmember",
                   "sling.servlet.extensions=" + ""
           })
public class SearchMemberServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(SearchMemberServlet.class);
	
	@Reference
	private MemberService memberService;

	
    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
       
        resp.getWriter().write("Response");
    }
    
    /***
     *Method to invoke Member service and fetch the data
     * @return member search
     */
    
    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
     
        StringBuffer response = new StringBuffer();
		try {
			String url = memberService.getMemberSearchEndpoint();
			URL tokenURLObject = new URL(url);
			String tokenId = getToken();
			
			String firstName = req.getParameter("firstName");
			String middleName = req.getParameter("middleName");
			String lastName = req.getParameter("lastName");
			String clientIdentifier =req.getParameter("clientIdentifier");
			String clientName = req.getParameter("clientName");
			String alternateId = req.getParameter("alternateId");
			String birthDate = req.getParameter("birthDate");
			String records = req.getParameter("records");
			
          // we are passing parameters to api
			
			String bodyData = "{\"MemberIdentifier\":\"\", \"FirstName\": \"" + firstName + "\", \"MiddleName\": \"" + middleName + "\", "
									+ "\"LastName\": \"" + lastName + "\", \"ClientIdentifier\": \"" + clientIdentifier +  "\", \"ClientName\": \"" + clientName + "\", \"AlternateId\": \"" + alternateId + "\","
									+ "\"BirthDate\": \"" + birthDate + "\", \"RECORDS\":\"" + records + "\"}";
			
			HttpURLConnection con = (HttpURLConnection) tokenURLObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer "+ tokenId);
			DataOutputStream dataOutputStreamToken = new DataOutputStream(con.getOutputStream());
			dataOutputStreamToken.writeBytes(bodyData);
			dataOutputStreamToken.flush();
			dataOutputStreamToken.close();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),"UTF-8"));

			String inputLine;
			try {
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				} 
			} finally {
				in.close();
			}
			
			String jsonString = response.toString();
			//resp.setContentType("application/json");
			resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				//json = new JSONObject(response.toString());
				 resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("ERror getting response ", e);
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
			String url = memberService.getTokenEndpoint();
			URL tokenURLObject = new URL(url);
 
			//  Here we are passig  credentials to generate token
			
			String tokenBodyData = "{\"grant_type\":\"client_credentials\",\"client_id\":\""+ memberService.getClientId() +"\","
					+ "\"client_secret\":\""+ memberService.getClientSecret() +"\"}";
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
