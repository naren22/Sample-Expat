package com.expatportal.core.component.beans;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author vyandrap
 *
 */
public class MenuTest {

	@Test
	public void test() {
		Menu menu=new Menu();
		menu.setExternalFlag("externalFlag");
		menu.setHasSubMenu(true);
		menu.setLinkName("linkName");
		menu.setLinkURL("linkURL");
		menu.setSubMenu(new ArrayList<SubMenu>());
		Assert.assertEquals("Values Should Be Equal","externalFlag" ,menu.getExternalFlag());
		Assert.assertEquals("Values Should Be Equal",true ,menu.isHasSubMenu());
		Assert.assertEquals("Values Should Be Equal","linkName" ,menu.getLinkName());
		Assert.assertEquals("Values Should Be Equal","linkURL" ,menu.getLinkURL());
		Assert.assertEquals("Values Should Be Equal",0 ,menu.getSubMenu().size());
	}

}
