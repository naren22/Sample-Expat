package com.expatportal.core.servlets;

import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.MemberServiceConfiguration;
import com.expatportal.core.service.PaymentService;
import com.expatportal.core.service.TokenService;
import com.expatportal.core.service.UploadFiles;
import com.expatportal.core.service.UploadFilesConfiguration;
import com.pingidentity.opentoken.TokenException;
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
                   Constants.SERVICE_DESCRIPTION + "= Bank validation servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                   "sling.servlet.paths="+ "/bin/expatportal/bankvalidation",
                   "sling.servlet.extensions=" + ""
           })
public class BankValidationServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(BankValidationServlet.class);
	
	@Reference
	private PaymentService paymentService;
	
	@Reference
	MemberService memberService;
    
    
    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
    	
    	 /***
         *Method to invoke Member coverage service and fetch the data
         * @return member coverage
         */
     
        StringBuffer response = new StringBuffer();
		try {

			String tokenId = memberService.getToken();
			String countryCode = req.getParameter("country");
			String currencyCode = req.getParameter("currency");
			String url = paymentService.getBankValidationEndpoint() + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode;
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
