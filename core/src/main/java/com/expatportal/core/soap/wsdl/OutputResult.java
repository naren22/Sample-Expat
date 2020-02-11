
package com.expatportal.core.soap.wsdl;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for OutputResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="OutputResult">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Message" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="proxyAddress" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="proxyUserName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="proxyPassword" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="WorkFlowURL" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="WorkFlowPathHWP" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "OutputResult", propOrder = {
    "status",
    "message",
    "proxyAddress",
    "proxyUserName",
    "proxyPassword",
    "workFlowURL",
    "workFlowPathHWP"
})
public class OutputResult {

    @XmlElement(name = "Status")
    protected String status;
    @XmlElement(name = "Message")
    protected String message;
    protected String proxyAddress;
    protected String proxyUserName;
    protected String proxyPassword;
    @XmlElement(name = "WorkFlowURL")
    protected String workFlowURL;
    @XmlElement(name = "WorkFlowPathHWP")
    protected String workFlowPathHWP;

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatus(String value) {
        this.status = value;
    }

    /**
     * Gets the value of the message property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the value of the message property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMessage(String value) {
        this.message = value;
    }

    /**
     * Gets the value of the proxyAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProxyAddress() {
        return proxyAddress;
    }

    /**
     * Sets the value of the proxyAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProxyAddress(String value) {
        this.proxyAddress = value;
    }

    /**
     * Gets the value of the proxyUserName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProxyUserName() {
        return proxyUserName;
    }

    /**
     * Sets the value of the proxyUserName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProxyUserName(String value) {
        this.proxyUserName = value;
    }

    /**
     * Gets the value of the proxyPassword property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProxyPassword() {
        return proxyPassword;
    }

    /**
     * Sets the value of the proxyPassword property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProxyPassword(String value) {
        this.proxyPassword = value;
    }

    /**
     * Gets the value of the workFlowURL property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWorkFlowURL() {
        return workFlowURL;
    }

    /**
     * Sets the value of the workFlowURL property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWorkFlowURL(String value) {
        this.workFlowURL = value;
    }

    /**
     * Gets the value of the workFlowPathHWP property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWorkFlowPathHWP() {
        return workFlowPathHWP;
    }

    /**
     * Sets the value of the workFlowPathHWP property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWorkFlowPathHWP(String value) {
        this.workFlowPathHWP = value;
    }

}
