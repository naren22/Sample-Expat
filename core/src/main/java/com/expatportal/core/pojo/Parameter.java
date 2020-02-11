package com.expatportal.core.pojo;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "Parameter")
//arrange property/element order of xml element, this is Optional
@XmlType(propOrder = { "parameterName", "parameterValue" })
public class Parameter {

	String parameterName;
	String parameterValue;
	
	
	public Parameter() {}
	
	public Parameter(String name, String val) {
		parameterName=name;
		parameterValue=val;
	}
	
	@XmlElement(name = "ParameterName")
	public String getParameterName() {
		return parameterName;
	}
	public void setParameterName(String parameterName) {
		parameterName = parameterName;
	}
	
	@XmlElement(name = "ParameterValue")
	public String getParameterValue() {
		return parameterValue;
	}
	public void setParameterValue(String parameterValue) {
		parameterValue = parameterValue;
	}
	
	
}
