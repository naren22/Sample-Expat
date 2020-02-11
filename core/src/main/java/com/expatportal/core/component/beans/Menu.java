package com.expatportal.core.component.beans;

import java.util.List;

public class Menu {

	private String linkName;
	
	private String linkURL;
	
	private boolean hasSubMenu;
	
	private String externalFlag;
	
	
	public String getExternalFlag() {
		return externalFlag;
	}

	public void setExternalFlag(String externalFlag) {
		this.externalFlag = externalFlag;
	}

	public boolean isHasSubMenu() {
		return hasSubMenu;
	}

	public void setHasSubMenu(boolean hasSubMenu) {
		this.hasSubMenu = hasSubMenu;
	}

	private List<SubMenu> subMenu;
	
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

	public List<SubMenu> getSubMenu() {
		return subMenu;
	}

	public void setSubMenu(List<SubMenu> subMenu) {
		this.subMenu = subMenu;
	}

	
	
}
