package com.expatportal.core.soap.wsdl;

import java.io.StringReader;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.expatportal.core.pojo.ExcellaMessage;

public class ExcellaReturn {

	
	public String getSubmissionId(String message) throws JAXBException {
		
		JAXBContext jaxbContext = JAXBContext.newInstance(ExcellaMessage.class);  
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();  
		ExcellaMessage em = (ExcellaMessage) jaxbUnmarshaller.unmarshal(new StringReader(message));
		
		return em.getSubmissionId() ;
	}
}
