/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.expatportal.core.servlets;

import java.io.IOException;

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

import com.expatportal.core.service.SubmitClaimService;
import com.expatportal.core.service.UploadFiles;
import com.expatportal.core.service.UploadServiceImpl;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "=Submit Claim Servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   "sling.servlet.resourceTypes="+ "mynew/components/structure/submit",
                   "sling.servlet.paths="+ "/bin/file/submit",
                   "sling.servlet.extensions=" + "json"
           })
public class SubmitClaimServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUid = 1L;
    Logger log = LoggerFactory.getLogger(SubmitClaimServlet.class);

    @Reference
    private SubmitClaimService service;
    
    @Reference
    private UploadFiles uploadservice;

    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
        JsonObject jo= new JsonObject();
       Long startTime = System.currentTimeMillis();
        try {
        	
        	String submissionId=uploadservice.zipFiles(req,null);
        	
        	String result=service.submitClaim(req,null,null);
            
            jo.add("result",new Gson().toJsonTree(result.toString()));
        log.info("Claim Submission completed in : "+(System.currentTimeMillis() - startTime)+" ms");
            
        } catch (Exception e) {
        	jo.add("result",new Gson().toJsonTree("failed") );
        	jo.add("error" ,  new Gson().toJsonTree("Submit Claim Failed ==>"+e));
        	log.error("Claim Submission failed in : "+(System.currentTimeMillis() - startTime)+" ms");
        	log.error("Excption="+e);
        }
        resp.setContentType("text/json");
        resp.getWriter().write(jo.toString());
    }
}
