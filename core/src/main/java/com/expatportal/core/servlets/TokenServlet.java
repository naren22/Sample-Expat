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
                   Constants.SERVICE_DESCRIPTION + "=Simple Demo Servlet",
                   "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                   
                   "sling.servlet.paths="+ "/bin/simple/serv",
                   "sling.servlet.extensions=" + "txt"
           })
public class TokenServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUid = 1L;

    @Reference
    private TokenService service;

    @Override
    protected void doGet(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        StringBuffer sb= new StringBuffer("Fetching Token ===>\n");
        try {
            Map map= service.readtoken(req);
            sb.append(map.get("FirstName"));
            sb.append("====\n");
            sb.append(map.get("msg"));
            sb.append("====\n");
            sb.append(map.get("key"));
        } catch (Exception e) {
            sb.append(e.getMessage());
        }
        resp.setContentType("text/plain");
        resp.getWriter().write("Name from  = " + sb.toString());
    }
    
    @Override
    protected void doPost(final SlingHttpServletRequest req,
            final SlingHttpServletResponse resp) throws ServletException, IOException {
        final Resource resource = req.getResource();
        StringBuffer sb= new StringBuffer("Fetching Token ===>\n");
        try {
            Map map= service.readtoken(req);
            sb.append(map.get("FirstName"));
            sb.append("====\n");
            sb.append(map.get("msg"));
            sb.append("====\n");
            sb.append(map.get("key"));
        } catch (Exception e) {
            sb.append(e.getMessage());
        }
        resp.setContentType("text/plain");
        resp.getWriter().write("Name from  = " + sb.toString());
    }
}
