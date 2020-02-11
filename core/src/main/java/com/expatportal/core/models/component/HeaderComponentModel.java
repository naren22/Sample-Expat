package com.expatportal.core.models.component;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import com.expatportal.core.component.beans.Header;
import com.expatportal.core.component.beans.Menu;
import com.expatportal.core.component.beans.SubMenu;

@Model(adaptables = { SlingHttpServletRequest.class,
		Resource.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeaderComponentModel {

	private Header headerMenu;

	private Menu menu;

	private SubMenu subMenu;

	List<Menu> menuItems;

	List<SubMenu> subMenuItems;

	@SlingObject
	private SlingHttpServletRequest request;

	@Inject
	@Named("logoImage")
	private String logoImage;

	@Inject
	private String logoAltText;

	@Inject
	private String menuLinkTitle1;

	@Inject
	private String menuLinkTitle2;

	@Inject
	private String menuLinkTitle3;

	@Inject
	private String menuLinkTitle4;

	@Inject
	private String menuLinkTitle5;

	@Inject
	@Named("links1")
	@Via("resource")
	private Resource submenu1;

	@Inject
	@Named("links2")
	@Via("resource")
	private Resource submenu2;

	@Inject
	@Named("links3")
	@Via("resource")
	private Resource submenu3;

	@Inject
	@Named("links4")
	@Via("resource")
	private Resource submenu4;

	@Inject
	@Named("links5")
	@Via("resource")
	private Resource submenu5;

	@PostConstruct
	public void init() {
		headerMenu = new Header();
		Resource headerResource = request.getResource();
		if (headerResource != null) {
			ValueMap headerMap = headerResource.getValueMap();
			headerMenu.setLogoImage(headerMap.containsKey("logoAltText") ? headerMap.get("logoImage").toString() : "");
			headerMenu.setLogoAltText(
					headerMap.containsKey("logoAltText") ? headerMap.get("logoAltText").toString() : "");
			headerMenu.setLogoLink(headerMap.containsKey("logoURL") ? headerMap.get("logoURL").toString() : "");
			headerMenu.setAccountSettingText(
					headerMap.containsKey("accountSettingText") ? headerMap.get("accountSettingText").toString() : "");
			headerMenu.setAccountSettingLink(
					headerMap.containsKey("accountSettingLink") ? headerMap.get("accountSettingLink").toString() : "");
			headerMenu.setAccountSettingProfileText(
					headerMap.containsKey("accountSettingProfileText") ? headerMap.get("accountSettingProfileText").toString() : "");
			headerMenu.setLogoutText(
					headerMap.containsKey("logoutText") ? headerMap.get("logoutText").toString() : "");
			headerMenu.setLogouLink(
					headerMap.containsKey("logoutLink") ? headerMap.get("logoutLink").toString() : "");
			headerMenu.setHelpText(
					headerMap.containsKey("helpText") ? headerMap.get("helpText").toString() : "");
			headerMenu.setHelpTextLink(
					headerMap.containsKey("helpTextLink") ? headerMap.get("helpTextLink").toString() : "");
			headerMenu.setExternalHelp(
					headerMap.containsKey("externalHelp") ? headerMap.get("externalHelp").toString() : "false");
			List<Menu> lstMenu = new ArrayList<>();
			for (int i = 1; i <= 5; i++) {
				menu = new Menu();
				menu.setLinkName(
						headerMap.containsKey("menuLinkTitle" + i) ? headerMap.get("menuLinkTitle" + i).toString()
								: "");
				menu.setLinkURL(
						headerMap.containsKey("menuLinkUrl" + i) ? headerMap.get("menuLinkUrl" + i).toString() : "");

				menu.setExternalFlag(
						headerMap.containsKey("external" + i) ? headerMap.get("external" + i).toString() : "false");

				Resource subMenuResource = headerResource.getChild("links" + i);
				if (subMenuResource != null && subMenuResource.hasChildren()) {
					List<SubMenu> lstSubMenu = new ArrayList<>();
					Iterable<Resource> resources = subMenuResource.getChildren();
					for (Resource resource : resources) {
						ValueMap subMenuMap = resource.getValueMap();
						subMenu = new SubMenu();
						subMenu.setLinkName(
								subMenuMap.containsKey("linkTitle") ? subMenuMap.get("linkTitle").toString() : "");
						subMenu.setLinkURL(
								subMenuMap.containsKey("linkUrl") ? subMenuMap.get("linkUrl").toString() : "");

						subMenu.setExternalFlag(
								subMenuMap.containsKey("external") ? subMenuMap.get("external").toString() : "false");
						subMenu.setOpenInNewTabFlag(
								subMenuMap.containsKey("openInNewTab") ? subMenuMap.get("openInNewTab").toString() : "false");
						lstSubMenu.add(subMenu);
					}
					if (lstSubMenu.size() > 0) {
						menu.setSubMenu(lstSubMenu);
						menu.setHasSubMenu(true);
					}
				}
				lstMenu.add(menu);

			}
			headerMenu.setMenu(lstMenu);
		}
	}

	public Header getHeaderMenu() {
		return headerMenu;
	}
	
	/**
	 * @param request the request to set
	 */
	public void setRequest(SlingHttpServletRequest request) {
		this.request = request;
	}
}
