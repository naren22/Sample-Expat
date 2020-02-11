package com.expatportal.core.component.beans;

public class SubMenu {

	private String linkName;
	
	private String linkURL;
	
	private String externalFlag;
	
	private String openInNewTab;
	
	
	
	public String getOpenInNewTabFlag() {
		return openInNewTab;
	}

	public void setOpenInNewTabFlag(String openInNewTab) {
		this.openInNewTab = openInNewTab;
	}

	public String getExternalFlag() {
		return externalFlag;
	}

	public void setExternalFlag(String externalFlag) {
		this.externalFlag = externalFlag;
	}

	public String getLinkName() {
		return linkName;
	}

	public void setLinkName(String linkName) {
		this.linkName = linkName;
	}

	public String getLinkURL() {
		return linkURL;
	}

	public void setLinkURL(String linkURL) {
		this.linkURL = linkURL;
	}

	
	
}
