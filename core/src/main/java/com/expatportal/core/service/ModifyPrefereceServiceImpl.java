package com.expatportal.core.service;


import java.io.BufferedReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;



@Component(service = ModifyPreferenceService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = ModifyPreferenceConfiguration.class)
public class ModifyPrefereceServiceImpl implements ModifyPreferenceService {

	
	Logger log = LoggerFactory.getLogger(ModifyPrefereceServiceImpl.class);
	
	@Reference
	private ResourceResolverFactory resourceFactory;
	

    private ModifyPreferenceConfiguration serviceConfig;


    @Activate
    public void activate(ModifyPreferenceConfiguration config) {
        this.serviceConfig = config;

    }
    
    public ResourceResolver getReadSystemResourceResolver() {
        ResourceResolver resourceResolver = null;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put(ResourceResolverFactory.SUBSERVICE, "expatReadService");
            resourceResolver = resourceFactory.getServiceResourceResolver(paramMap);
        } catch (LoginException e) {
            log.error("Login Exception : " + e);
        }
        return resourceResolver;
    }


   
	

    @Override
	public String modifyPrefernce(SlingHttpServletRequest req,String method) {
		
		String url =  this.serviceConfig.getPrefrenceAPI_URL();
		String content =null;
		try {
			log.debug("Getting OAuth token ");
			Token token=  new Gson().fromJson(getToken(), Token.class);
			log.debug("successfully generated token");
			if(token != null) {
				HttpClient client= HttpClients.createDefault();
				HttpEntityEnclosingRequestBase post = null;
				log.debug("method :"+ method);
				if(HttpPost.METHOD_NAME.equalsIgnoreCase(method)){
					 post = new HttpPost(url);
				}else {
					 post = new HttpPut(url);
				}
				post.setHeader("Accept", "application/json");
				post.setHeader("Content-type", "application/json");
				post.setHeader("Authorization", token.getToken_type() + " " +token.getAccess_token());
				
				BufferedReader reader =req.getReader();
				String line = null;
				StringBuffer requestBody = new StringBuffer();
				
				while((line = reader.readLine()) != null) {
					requestBody.append(line);
				}
				log.debug("request body :"+requestBody.toString() );
				StringEntity requestJson=new StringEntity(requestBody.toString());
				post.setEntity(requestJson);
				
				HttpResponse response =client.execute(post);
				content = EntityUtils.toString(response.getEntity());
				log.debug(" Result  : "+ content);
				
				
			}else {
				log.debug("Token not found");
			}
			
		} catch (Exception e) {
			log.error("Error while saving prefrence : "+e);
			content = e.getMessage();
		}
		return content;
	}
	
	@Override
	public String getToken() {

		StringBuffer response = new StringBuffer();
		try {
			String tokenURL =this.serviceConfig.getOAuth_URL();
			URL tokenURLObject = new URL(tokenURL);
			
			log.debug(tokenURL);
			
			
			HttpClient client= HttpClients.createDefault();
			   List<NameValuePair> form = new ArrayList<>();
	            form.add(new BasicNameValuePair("grant_type", this.serviceConfig.getGrant_Type()));
	            form.add(new BasicNameValuePair("client_secret", this.serviceConfig.getClient_Secret()));
	            form.add(new BasicNameValuePair("client_id",  this.serviceConfig.getClient_Id()));
	            UrlEncodedFormEntity entity = new UrlEncodedFormEntity(form, Consts.UTF_8);

	            HttpPost httpPost = new HttpPost(tokenURL);
	            httpPost.setEntity(entity);
	            log.debug("Executing request " + httpPost.getRequestLine());

	            // Create a custom response handler
	            HttpResponse res =client.execute(httpPost);
				String content = EntityUtils.toString(res.getEntity());
				response.append(content);
			
		
			log.debug("Token String : "+response.toString());
		} catch (Exception e) {
			log.error("ERror getting token ", e);
		}

		return response.toString();
	}
	
	class Token {
		
		
		
		String token_type ;
		String access_token;
		int expires_in ;
		public String getToken_type() {
			return token_type;
		}
		public void setToken_type(String token_type) {
			this.token_type = token_type;
		}
		public String getAccess_token() {
			return access_token;
		}
		public void setAccess_token(String access_token) {
			this.access_token = access_token;
		}
		public int getExpires_in() {
			return expires_in;
		}
		public void setExpires_in(int expires_in) {
			this.expires_in = expires_in;
		}

		
		public String getOAuth_URL() {
			
			return serviceConfig.getOAuth_URL();
			
		}
		
		public String getPrefrenceAPI_URL() {
			
			return serviceConfig.getPrefrenceAPI_URL();
		}
		
		public String getClient_Id() {
			
			return serviceConfig.getClient_Id();
			
		}
		
		public String getClient_Secret() {
			
			return serviceConfig.getClient_Secret();
		}
		
		public String getGrant_Type() {
			
			return serviceConfig.getGrant_Type();
		}
	}

	public String getOAuth_URL() {
		// TODO Auto-generated method stub
		return serviceConfig.getOAuth_URL();
	}

	public String getPrefrenceAPI_URL() {
		// TODO Auto-generated method stub
		return serviceConfig.getPrefrenceAPI_URL();
	}

	public String getClient_Id() {
		// TODO Auto-generated method stub
		return serviceConfig.getClient_Id();
	}

	public String getClient_Secret() {
		// TODO Auto-generated method stub
		return serviceConfig.getClient_Secret();
	}

	public String getGrant_Type() {
		// TODO Auto-generated method stub
		return serviceConfig.getGrant_Type();

			

	}

}