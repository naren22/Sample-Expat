package com.expatportal.core.pojo;

import java.io.StringReader;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.expatportal.core.soap.wsdl.ExcellaReturn;

@XmlRootElement(name="Return")
public class ExcellaMessage {
	
	private String Status;
	private String errorMsg;
	private String submissionId;
	
	@XmlElement(name="STATUS")
	public String getStatus() {
		return Status;
	}
	public void setStatus(String status) {
		Status = status;
	}
	@XmlElement(name="ERRORMESSAGE")
	public String getErrorMsg() {
		return errorMsg;
	}
	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	@XmlElement(name="HTN")
	public String getSubmissionId() {
		return submissionId;
	}
	public void setSubmissionId(String submissionId) {
		this.submissionId = submissionId;
	}
	
	
	public static void main(String[] args) {
		String xml="<Return><STATUS>Uploaded Successfully</STATUS><ERRORMESSAGE></ERRORMESSAGE><HTN>AA0025733192040100070</HTN></Return>";
		
		try {

			System.out.println(new ExcellaReturn().getSubmissionId(xml));
			
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("error" +e);
		}  
	}

}

