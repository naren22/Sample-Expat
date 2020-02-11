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

import com.expatportal.core.service.TokenService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.pingidentity.opentoken.TokenException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Map;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service=Servlet.class,
           property={
                   Constants.SERVICE_DESCRIPTION + "=Generate Token Servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   "sling.servlet.resourceTypes="+ "mynew/components/structure/page",
                   "sling.servlet.paths="+ "/bin/token/gen",
                   "sling.servlet.extensions=" + "txt"
           })
public class WriteTokenServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUid = 1L;

    @Reference
    private TokenService service;
    
    private final Logger logger = LoggerFactory.getLogger(WriteTokenServlet.class);

    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        StringBuffer sb= new StringBuffer("Fetching Token ===>\n");
        JsonObject jo= new JsonObject();
        try {
            sb.append(service.createToken(req));
            jo.add("token",new Gson().toJsonTree(service.createToken(req)) );
            
        } catch (Exception e) {
           // sb.append("error"+e);
        	jo.add("error" ,  new Gson().toJsonTree("Error while generating token ==>"+e));
        }
        resp.setContentType("text/json");
        resp.getWriter().write(jo.toString());
    }
}
