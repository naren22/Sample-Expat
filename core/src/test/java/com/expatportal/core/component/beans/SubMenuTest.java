package com.expatportal.core.component.beans;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author vyandrap
 *
 */
public class SubMenuTest {

	@Test
	public void test() {
		SubMenu subMenu=new SubMenu();
		subMenu.setExternalFlag("externalFlag");
		subMenu.setLinkName("linkName");
		subMenu.setLinkURL("linkURL");
		Assert.assertEquals("Values Should Be Equal","externalFlag" ,subMenu.getExternalFlag());
		Assert.assertEquals("Values Should Be Equal","linkName" ,subMenu.getLinkName());
		Assert.assertEquals("Values Should Be Equal","linkURL" ,subMenu.getLinkURL());
	}

}
