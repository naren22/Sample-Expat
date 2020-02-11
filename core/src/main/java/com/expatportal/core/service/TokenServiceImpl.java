package com.expatportal.core.service;

import com.expatportal.core.servlets.WriteTokenServlet;
import com.expatportal.core.utills.AES;
import com.pingidentity.opentoken.Agent;
import com.pingidentity.opentoken.AgentConfiguration;
import com.pingidentity.opentoken.TokenException;


import org.apache.commons.collections.map.HashedMap;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.settings.SlingSettingsService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


@Component(service = TokenService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = TokenConfiguration.class)
public class TokenServiceImpl implements TokenService {

    // to use the OSGi annotations
    // use version 3.2.0 of maven-bundle-plugin

    private TokenConfiguration serviceConfig;
    
    private final Logger logger = LoggerFactory.getLogger(TokenService.class);

    private boolean author;
    
    final String secretKey = "Pingfedkey!!!!";
    final String keySeprator = "|";
    final String keyName = "key";

    private AgentConfiguration config;

    @Reference
    private SlingSettingsService settings;

    @Activate
    public void activate(TokenConfiguration config) {
        this.serviceConfig = config;

    }

   
    @Override
    public Map readtoken(SlingHttpServletRequest req)  {

        Map map = new HashMap<>();
        try {
            Agent agent = this.getAgent(req);
            String token= (String) req.getParameter("opentoken");
             map = agent.readToken(token);
             map.put(keyName, getKey(map));
        } catch (Exception e) {
            e.printStackTrace();
            map.put("msg",e.getMessage());
        }

        return map;
    }

    private String getKey(Map map) {

        StringBuffer sb= new StringBuffer();

        sb.append(map.get(Agent.TOKEN_SUBJECT)).append(keySeprator);
        sb.append(map.get("FirstName")).append(keySeprator);
        sb.append(map.get("LastName")).append(keySeprator);
        sb.append(map.get("MemberID")).append(keySeprator);
        sb.append(map.get("DateOfBirth")).append(keySeprator);
        sb.append(map.get("GroupID")).append(keySeprator);
        //sb.append(map.get("ghmbrId")).append(keySeprator);
        //sb.append(map.get("AltId")).append(keySeprator);
        
        
        



        return AES.encrypt(sb.toString(),secretKey);
    }

    private Agent getAgent(SlingHttpServletRequest req) throws RepositoryException, IOException {

        //Node node = req.getResourceResolver().getResource(serviceConfig.configValue().trim()).adaptTo(Node.class);
   //return new Agent(node.getNode("jcr:content").getProperty("jcr:data").getStream());
        
        File agentConf=new  File(serviceConfig.configValue().trim());
        return new Agent(new FileInputStream(agentConf));

    }
  

    @Override
    public String createToken(SlingHttpServletRequest req) throws TokenException, IOException, RepositoryException {

        Agent agent = this.getAgent(req);

        String key = (String) req.getParameter(keyName);
        
        String[] values = AES.decrypt(key,secretKey).split("\\|");
        Map<String,String> map= new HashMap<String, String>();
        map.put(Agent.TOKEN_SUBJECT,values[0]);
        map.put("FirstName",values[1]);
        map.put("LastName",values[2]);
        map.put("MemberID",values[3]);
        map.put("DateOfBirth",values[4].trim());
        map.put("GroupID",values[5]);
        //map.put("ghmbrId",values[6]);
        //map.put("AltId",values[6]);
      
        return agent.writeToken(map);

    }
    
    public String configValue() {
    	
    	return serviceConfig.configValue();
    }

    public int getNumberValue() {
    	return serviceConfig.getNumberValue();
    }


}