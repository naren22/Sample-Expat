package com.expatportal.core.service;

import java.io.IOException;

import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;

import com.expatportal.core.pojo.SubmitClaimRequest;

public interface UploadFiles {

	public JSONObject upload(SlingHttpServletRequest req) throws IOException, ServletException, JSONException;

	
	public String deleteFile(SlingHttpServletRequest req) throws IOException, ServletException;
	
	public String getFilesWithDetails(SlingHttpServletRequest req, String mbrId) throws IOException, ServletException;
	
	public String deleteAllFiles(SlingHttpServletRequest req) throws IOException, ServletException;




	public String zipFiles(SlingHttpServletRequest req, SubmitClaimRequest request);
}
