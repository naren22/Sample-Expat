package com.expatportal.core.servlets;

import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import com.expatportal.core.service.MemberServiceConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONArray;
import org.json.JSONException;
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
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component(service=Servlet.class,
property={
        Constants.SERVICE_DESCRIPTION + "= View Reimbursement servlet",
        "sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.paths="+ "/bin/expatportal/viewreimbursement",
        "sling.servlet.extensions=" + ""
})


public class ViewReimbursementServlet extends SlingAllMethodsServlet {
	
	private final Logger logger = LoggerFactory.getLogger(ViewReimbursementServlet.class);
	
    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
    	
     
        StringBuffer response = new StringBuffer();
		try {
			String url = "https://stg-expats-svcs-finance-ctc.uhc.com/api/claim-payments/v2/search";
			URL obj = new URL(url);
			//URL tokenURLObject = new URL(url);
			//String tokenId = getToken();
			
			String altId = req.getParameter("altId");
			String bankRefNum = req.getParameter("bankRefNum");
			String topsSequenceNumber =  req.getParameter("topsSequenceNumber");
			String recipientType = req.getParameter("recipientType");
			String endDate = req.getParameter("endDate");
			String startDate =req.getParameter("startDate");
			String claimId =  req.getParameter("claimId");
			String includeRefundedPayments = req.getParameter("includeRefundedPayments");
			String limit =req.getParameter("limit");
			String offset = req.getParameter("offset");
			String sort =  req.getParameter("sort");
	
			if(!claimId.equals("null")) {
				claimId = "\""+ claimId +"\"";
			}
			
			if(!bankRefNum.equals("null")) {
				bankRefNum = "\""+ bankRefNum +"\"";
			}
		
			// we are passing parameters to api

			String bodyData = "{\"altId\":\"" + altId + "\", \"bankRefNum\":" + bankRefNum + ","
					+ " \"topsSequenceNumber\": " + topsSequenceNumber + ", " + "\"recipientType\": \"" + recipientType
					+ "\", " + " \"endDate\": \"" + endDate + "\", "+ "\"startDate\": \"" + startDate + "\", " + "\"claimId\":" + claimId + ","
					+ "\"includeRefundedPayments\": \""	+ includeRefundedPayments + "\"," + "\"limit\": \"" + limit + "\"," + "\"offset\": \""
					+ offset + "\"," + "\"sort\": \""+ sort + "\"}";
			
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("POST");
			con.setRequestProperty("User-Agent", "Mozilla/5.0");
			con.setRequestProperty("Content-Type", "application/json");
			//con.setRequestProperty("Authorization", "Bearer "+ tokenId);
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
			resp.setContentType("application/json");
			resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				//json = new JSONObject(response.toString());
				 resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("ERror getting response ", e);
		}
      
    }
}

