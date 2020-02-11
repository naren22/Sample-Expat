
package com.expatportal.core.soap.wsdl;

import javax.xml.ws.Endpoint;

/**
 * This class was generated by Apache CXF 2.5.7
 * 2019-07-21T22:35:47.389-05:00
 * Generated source version: 2.5.7
 * 
 */
 
public class PCHMAWebServiceHttpPost_PCHMAWebServiceHttpPost_Server{

    protected PCHMAWebServiceHttpPost_PCHMAWebServiceHttpPost_Server() throws java.lang.Exception {
        System.out.println("Starting Server");
        Object implementor = new PCHMAWebServiceHttpPostImpl();
        String address = "https://www.hovs-pch.com/PCHMA_SSP/PCH_MAWebService.asmx";
        Endpoint.publish(address, implementor);
    }
    
    public static void main(String args[]) throws java.lang.Exception { 
        new PCHMAWebServiceHttpPost_PCHMAWebServiceHttpPost_Server();
        System.out.println("Server ready..."); 
        
        Thread.sleep(5 * 60 * 1000); 
        System.out.println("Server exiting");
        System.exit(0);
    }
}
