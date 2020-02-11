package com.expatportal.core.servlets;

import java.io.BufferedReader;
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
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.PaymentService;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "= Payment Details servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                   
                   "sling.servlet.paths="+ "/bin/expatportal/paymentdetails",
                   "sling.servlet.extensions=" + ""
           })
public class PaymentDetailsServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(PaymentDetailsServlet.class);
	
	@Reference
	private PaymentService paymentService;
	
	@Reference
	MemberService memberService;
    
    
    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
    	
    	
        StringBuffer response = new StringBuffer();
		try {
			String tokenId = memberService.getToken();
			String banReferenceNumber = req.getParameter("bankReferenceNumber");
			String url = paymentService.getPaymentDetailsEndpoint() + "?bankReferenceNumber=" + banReferenceNumber;
			URL urlObject = new URL(url);
			
			HttpURLConnection con = (HttpURLConnection) urlObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("GET");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer "+ tokenId);
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));

			String inputLine;
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
    
   
}
