package com.expatportal.core.pojo;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="WebIncoming")
@XmlAccessorType(XmlAccessType.FIELD)
public class WebIncoming {
 private String Project;
 private String Customer;
 private String ActionName;
 
//XmLElementWrapper generates a wrapper element around XML representation
@XmlElementWrapper(name = "Details") 
// XmlElement sets the name of the entities
@XmlElement(name = "Parameter")
List<Parameter> details;


// Getter Methods 
 public String getProject() {
  return Project;
 }

 public String getCustomer() {
  return Customer;
 }

 public String getActionName() {
  return ActionName;
 }
 
 // Setter Methods 
 public void setProject(String Project) {
  this.Project = Project;
 }

 public void setCustomer(String Customer) {
  this.Customer = Customer;
 }

 public void setActionName(String ActionName) {
  this.ActionName = ActionName;
 }
 
 public void addDetails(Parameter param) {
	 if(details == null) {
		 details = new ArrayList<Parameter>();
	 }
	 details.add(param);
 }

}
