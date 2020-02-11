package com.expatportal.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

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

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get country Information",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET,
		"sling.servlet.paths=" + "/bin/expatportal/countryinfo", "sling.servlet.extensions=" + "" })
public class GetCountriesListServlet extends SlingAllMethodsServlet {

	/**
	 * Serial Version ID
	 */
	private static final long serialVersionUID = 1L;

	private final Logger logger = LoggerFactory.getLogger(GetCountriesListServlet.class);

	@Reference
	private MemberService memberService;

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		StringBuffer response = new StringBuffer();
		try {
			String url = memberService.getCountryEndpoint();
			URL urlObject = getNewURLObject(url);
			String tokenId = memberService.getToken();
			HttpURLConnection con = (HttpURLConnection) urlObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("GET");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer " + tokenId);
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

			resp.setContentType("application/json");
			resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
			resp.getWriter().write(jsonString);
			// resp.getWriter().write("service response");
			logger.info("service response");

		} catch (Exception e) {
			logger.error("Error getting response ", e);
		}

		//resp.getWriter().write("Response");
	}

	public URL getNewURLObject(String urlString) throws MalformedURLException {
		return new URL(urlString);
	}

	@Override
	protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {

	}

}
