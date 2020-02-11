package com.expatportal.core.servlets;

import com.expatportal.core.service.ClaimSearchService;
import com.expatportal.core.service.MemberService;
import com.expatportal.core.service.MemberServiceConfiguration;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
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
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Member Coverage servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST,

		"sling.servlet.paths=" + "/bin/expatportal/memberclaimsearchservice", "sling.servlet.extensions=" + "" })
public class MemberClaimSearchServlet extends SlingAllMethodsServlet {

	private final Logger logger = LoggerFactory.getLogger(MemberClaimSearchServlet.class);

	@Reference
	private ClaimSearchService claimSearchService;

	@Reference
	MemberService memberService;

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		StringBuffer response = new StringBuffer();
		try {
			String url = claimSearchService.getClaimAttributeEndpoint();
			URL urlObject = new URL(url);
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
			resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("Error getting response ", e);
		}
	}

	@Override
	protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {

		StringBuffer response = new StringBuffer();
		try {
			String url = claimSearchService.getClaimServiceEndpoint();
			URL urlObject = new URL(url);
			String tokenId = memberService.getToken();

			String altId = req.getParameter("altId");
			String providerId = req.getParameter("providerId");
			JSONArray coverageTypeFilters = new JSONArray();
			JSONArray memberFilters = new JSONArray();
			JSONArray statusFilters = new JSONArray();
			String fromDate = req.getParameter("fromDate");
			String toDate = req.getParameter("toDate");
			String submissionId = req.getParameter("submissionId");
			String paymentNumber = req.getParameter("paymentNumber");
			String includeUnmatchedSubmissions = req.getParameter("includeUnmatchedSubmissions");
			String pageSize = req.getParameter("pageSize");
			String pageIndex = req.getParameter("pageIndex");
			String order = req.getParameter("order");
			String sort = req.getParameter("sort");
			String eobTypeFilter = req.getParameter("eobTypeFilter");
			String coverageFilter = req.getParameter("coverageTypeFilters");
			String memberFilter = req.getParameter("memberFilters");
			String statusFilter = req.getParameter("statusFilters");

			if(!"".equals(coverageFilter)) {
				coverageTypeFilters =	getFilterArray(coverageFilter);
			}
			
			if(!"".equals(memberFilter)) {
				memberFilters =	getFilterArray(memberFilter);
			}
			
			if(!"".equals(statusFilter)) {
				statusFilters =	getFilterArray(statusFilter);
			}
			
			if(!submissionId.equals("null")) {
				submissionId = "\""+ submissionId +"\"";
			}
			
			if(!paymentNumber.equals("null")) {
				paymentNumber = "\""+ paymentNumber +"\"";
			}
			
			if(fromDate.equals("null")) {
				fromDate = null;
			}
			
			if(toDate.equals("null")) {
				toDate = null;
			}
			if(altId.equals("null")) {
				altId = null;
			}
			
			
			// we are passing parameters to api

			String bodyData = "{\"altId\":\"" + altId + "\", \"providerId\":" + providerId + ","
					+ " \"coverageTypeFilters\": " + coverageTypeFilters + ", " + "\"memberFilters\": " + memberFilters
					+ ", " + "\"statusFilters\":" + statusFilters + ", " + "\"fromDate\": \"" + fromDate + "\", "
					+ "\"toDate\": \"" + toDate + "\", " + "\"submissionId\":" + submissionId + ","
					+ "\"paymentNumber\": " + paymentNumber + "," + "\"includeUnmatchedSubmissions\": \""
					+ includeUnmatchedSubmissions + "\"," + "\"pageSize\": \"" + pageSize + "\"," + "\"eobTypeFilter\": \"" + eobTypeFilter + "\"," + "\"pageIndex\": \""
					+ pageIndex + "\"," + "\"order\": \"" + order + "\"," + "\"sort\": \""
					+ sort + "\"}";
			
			if(fromDate == null && toDate == null && fromDate == null) {
				bodyData = "{\"altId\":" + altId + ", \"providerId\":" + providerId + ","
						+ " \"coverageTypeFilters\": " + coverageTypeFilters + ", " + "\"memberFilters\": " + memberFilters
						+ ", " + "\"statusFilters\":" + statusFilters + ", " + "\"fromDate\": " + fromDate + ", "
						+ "\"toDate\": " + toDate + ", " + "\"submissionId\":" + submissionId + ","
						+ "\"paymentNumber\": " + paymentNumber + "," + "\"includeUnmatchedSubmissions\": \""
						+ includeUnmatchedSubmissions + "\"," + "\"pageSize\": \"" + pageSize + "\"," + "\"eobTypeFilter\": \"" + eobTypeFilter + "\"," + "\"pageIndex\": \""
						+ pageIndex + "\"," + "\"order\": \"" + order + "\"," + "\"sort\": \""
						+ sort + "\"}";
			}

			HttpURLConnection con = (HttpURLConnection) urlObject.openConnection();
			con.setDoOutput(true);
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Authorization", "Bearer " + tokenId);
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
			

			String jsonString = response.toString();

			resp.getWriter().write(jsonString);

		} catch (Exception e) {
			logger.error("Error getting response ", e);
			resp.setStatus(504);
		}

	}
	
	public JSONArray getFilterArray(String filterString) {
		JSONArray filterArray = new JSONArray();
		if (filterString.contains(",")) {
			String[] filters = filterString.split(",");

			for (String filter : filters) {
				filterArray.put(Integer.parseInt(filter));
			}
		} else {
			filterArray.put(Integer.parseInt(filterString));
		}
		
		return filterArray;
		
	}

}
