package com.expatportal.core.component.beans;

import java.util.List;

public class Header {
	
	private String logoLink;
	
	private String logoImage;
	
	private String logoAltText;
	
	private String accountSettingLink;
	
	private String accountSettingText;
	
	private String accountSettingProfileText;
	
	

	private String logoutText;
	
	private String logoutLink;
	
	

	private String helpTextLink;
	
	private String externalHelp;
	
	public String getExternalHelp() {
		return externalHelp;
	}

	public void setExternalHelp(String externalHelp) {
		this.externalHelp = externalHelp;
	}

	public String getHelpTextLink() {
		return helpTextLink;
	}

	public void setHelpTextLink(String helpTextLink) {
		this.helpTextLink = helpTextLink;
	}

	public String getHelpText() {
		return helpText;
	}

	public void setHelpText(String helpText) {
		this.helpText = helpText;
	}

	private String helpText;
	
	List<Menu> menu;

	public String getAccountSettingLink() {
		return accountSettingLink;
	}

	public void setAccountSettingLink(String accountSettingLink) {
		this.accountSettingLink = accountSettingLink;
	}

	public String getAccountSettingText() {
		return accountSettingText;
	}

	public void setAccountSettingText(String accountSettingText) {
		this.accountSettingText = accountSettingText;
	}

	public String getLogoLink() {
		return logoLink;
	}

	public void setLogoLink(String logoLink) {
		this.logoLink = logoLink;
	}

	public String getLogoImage() {
		return logoImage;
	}

	public void setLogoImage(String logoImage) {
		this.logoImage = logoImage;
	}

	public String getLogoAltText() {
		return logoAltText;
	}

	public void setLogoAltText(String logoAltText) {
		this.logoAltText = logoAltText;
	}

	public List<Menu> getMenu() {
		return menu;
	}

	public void setMenu(List<Menu> menu) {
		this.menu = menu;
	}
	
	public String getAccountSettingProfileText() {
		return accountSettingProfileText;
	}

	public String getLogoutText() {
		return logoutText;
	}

	public void setAccountSettingProfileText(String accountSettingProfileText) {
		this.accountSettingProfileText = accountSettingProfileText;
	}

	public void setLogoutText(String logoutText) {
		this.logoutText = logoutText;
	}
	
	public String getLogoutLink() {
		return logoutLink;
	}

	public void setLogouLink(String logoutLink) {
		this.logoutLink = logoutLink;
	}
}
