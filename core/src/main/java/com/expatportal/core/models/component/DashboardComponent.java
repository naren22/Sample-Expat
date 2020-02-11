package com.expatportal.core.models.component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

import com.expatportal.core.component.beans.Header;
import com.expatportal.core.component.beans.Menu;
import com.expatportal.core.component.beans.SubMenu;

@Model(adaptables = { SlingHttpServletRequest.class,
		Resource.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class DashboardComponent {

	private Header headerMenu;

	private Menu menu;

	private SubMenu subMenu;

	List<Menu> menuItems;

	List<SubMenu> subMenuItems;

	@SlingObject
	private SlingHttpServletRequest request;

	@Inject
	@Via("resource")
	private String rxMemberIdText;

	
	@Inject
	@Via("resource")
	private String dentalMemberIdText;

	@Inject
	@Via("resource")
	private String visionMemberIdText;

	@Inject
	@Via("resource")
	private String welcomeText;
	

	@Inject
	@Via("resource")
	private Resource rotatingMessages;

	public Resource getRotatingMessages() {
		return rotatingMessages;
	}

	public String getRxMemberIdText() {
		return rxMemberIdText;
	}

	public String getDentalMemberIdText() {
		return dentalMemberIdText;
	}

	public String getVisionMemberIdText() {
		return visionMemberIdText;
	}

	public String getWelcomeText() {
		return welcomeText;
	}

	@PostConstruct
	public void init() {
		
		Resource headerResource = request.getResource();
		
		
		if (headerResource != null) {
			
		}

	}

	public Header getHeaderMenu() {
		return headerMenu;
	}
}
