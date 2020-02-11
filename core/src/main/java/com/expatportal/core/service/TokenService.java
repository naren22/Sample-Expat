package com.expatportal.core.service;

import com.pingidentity.opentoken.TokenException;
import org.apache.sling.api.SlingHttpServletRequest;

import java.io.IOException;
import java.util.Map;

import javax.jcr.RepositoryException;

public interface TokenService{
     
     
    // you can use this service directly with data-sly-use
    // like this example
    // <sly data-sly-use.service="com.adobe.examples.htl.core.service.MySimpleService"/>
    //
    // ${service.simpleValue}
         
    Map readtoken(SlingHttpServletRequest req);
     
	String createToken(SlingHttpServletRequest req) throws TokenException, IOException, RepositoryException;
}