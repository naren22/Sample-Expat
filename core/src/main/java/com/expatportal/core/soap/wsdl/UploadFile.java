
package com.expatportal.core.soap.wsdl;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="UID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PassCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fsXml" type="{http://www.w3.org/2001/XMLSchema}base64Binary" minOccurs="0"/>
 *         &lt;element name="fsImage" type="{http://www.w3.org/2001/XMLSchema}base64Binary" minOccurs="0"/>
 *         &lt;element name="ImagefileName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "uid",
    "passCode",
    "fsXml",
    "fsImage",
    "imagefileName"
})
@XmlRootElement(name = "UploadFile")
public class UploadFile {

    @XmlElement(name = "UID")
    protected String uid;
    @XmlElement(name = "PassCode")
    protected String passCode;
    protected byte[] fsXml;
    protected byte[] fsImage;
    @XmlElement(name = "ImagefileName")
    protected String imagefileName;

    /**
     * Gets the value of the uid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUID() {
        return uid;
    }

    /**
     * Sets the value of the uid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUID(String value) {
        this.uid = value;
    }

    /**
     * Gets the value of the passCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPassCode() {
        return passCode;
    }

    /**
     * Sets the value of the passCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPassCode(String value) {
        this.passCode = value;
    }

    /**
     * Gets the value of the fsXml property.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getFsXml() {
        return fsXml;
    }

    /**
     * Sets the value of the fsXml property.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setFsXml(final byte[] value) {
        this.fsXml = value;
    }

    /**
     * Gets the value of the fsImage property.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getFsImage() {
        return fsImage;
    }

    /**
     * Sets the value of the fsImage property.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setFsImage(final byte[] value) {
        this.fsImage = value;
    }

    /**
     * Gets the value of the imagefileName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getImagefileName() {
        return imagefileName;
    }

    /**
     * Sets the value of the imagefileName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setImagefileName(String value) {
        this.imagefileName = value;
    }

}
