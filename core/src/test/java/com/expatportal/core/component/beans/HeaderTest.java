package com.expatportal.core.component.beans;

import java.util.ArrayList;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author vyandrap
 *
 */
public class HeaderTest {

	@Test
	public void testGetterSetter() {
		Header header=new Header();
		header.setAccountSettingLink("accountSettingLink");
		header.setAccountSettingText("accountSettingText");
		header.setLogoAltText("logoAltText");
		header.setLogoImage("logoImage");
		header.setLogoLink("logoLink");
		header.setMenu(new ArrayList<>());
		Assert.assertEquals("Should Be Equal","accountSettingLink" ,header.getAccountSettingLink());
		Assert.assertEquals("Should Be Equal","accountSettingText" ,header.getAccountSettingText());
		Assert.assertEquals("Should Be Equal","logoAltText" ,header.getLogoAltText());
		Assert.assertEquals("Should Be Equal", "logoImage",header.getLogoImage());
		Assert.assertEquals("Should Be Equal","logoLink" ,header.getLogoLink());
		Assert.assertEquals("Should Be Equal", 0,header.getMenu().size());
	}

}
