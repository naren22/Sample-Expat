package com.expatportal.core.servlets;

import com.expatportal.core.service.ClaimSearchService;
import com.expatportal.core.service.MemberService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "=Get PDF Report Servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                   
                   "sling.servlet.paths="+ "/bin/expatportal/getpdfresponse",
                   "sling.servlet.extensions=" + ""
           })
public class GetPdfFromEncodedDataServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(GetPdfFromEncodedDataServlet.class);
	
	@Reference
	private ClaimSearchService claimSearchService;
	
	@Reference
	MemberService memberService;
	
	
    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
		try {
			 String tokenId = memberService.getToken();
			 String claimId = req.getParameter("claimId");
			 String url = claimSearchService.getPdfDataEndpoint() +  "/" + claimId;
			 URL urlObject = new URL(url);
			HttpURLConnection con = (HttpURLConnection) urlObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("GET");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer " + tokenId);
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
			StringBuilder response = new StringBuilder();
			try {
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				} 
			} finally {
				in.close();
			}
			

			String jsonString = response.toString();
			resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("Error getting response ", e);
		}
    }
    
    
    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
    	
    	
    }
    
}
