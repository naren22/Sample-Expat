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
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.expatportal.core.service.ModifyPreferenceService;
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
                   Constants.SERVICE_DESCRIPTION + "=Modify Prefrence Servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   "sling.servlet.resourceTypes="+ "mynew/components/structure/pref",
                   "sling.servlet.paths="+ "/bin/prefrence/modify",
                   "sling.servlet.extensions=" + "json"
           })
public class ModifyPrefrenceServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUid = 1L;
    
    Logger log = LoggerFactory.getLogger(ModifyPrefrenceServlet.class);

    @Reference
    private ModifyPreferenceService service;

	@Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
        JsonObject jo= new JsonObject();
        try {
        	String method = "POST";
        	String selectors[] =  req.getRequestPathInfo().getSelectors();
        	log.debug("sel :"+ selectors[0]);
        	if(selectors.length > 0 && "edit".equalsIgnoreCase(selectors[0])) {
        		method = "PUT";
        	} else if(selectors.length > 0 && "nopref".equalsIgnoreCase(selectors[0])) {
        		method = "POST";
        	}
        	String result=service.modifyPrefernce(req,method);
            
            jo.add("result",new Gson().toJsonTree(result.toString()));
            
        } catch (Exception e) {
        	jo.add("result",new Gson().toJsonTree("failed") );

        	jo.add("error" ,  new Gson().toJsonTree("Preference modification Failed ==>"+e));
        	log.error(e.getMessage());
        	
        }
        resp.setContentType("text/json");
        resp.getWriter().write(jo.toString());
    }
	

    public void setService(ModifyPreferenceService service) {
		this.service = service;
	}
}
