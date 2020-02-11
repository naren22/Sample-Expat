/**
 * 
 */
package com.expatportal.core.models.component;

import static org.mockito.Mockito.when;
import java.util.ArrayList;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

/**
 * @author vyandrap
 *
 */
public class HeaderComponentModelTest {

	HeaderComponentModel headerComponentModel=new HeaderComponentModel();
	
	SlingHttpServletRequest request=Mockito.mock(SlingHttpServletRequest.class);
	
	Resource resource=Mockito.mock(Resource.class);
	
	ValueMap resourceValueMap=Mockito.mock(ValueMap.class);
	
	/**
	 * Test method for {@link com.expatportal.core.models.component.HeaderComponentModel#init()}.
	 */
	@Test
	public void testInit() {
		java.util.List<Resource> listOfResource=new ArrayList<>();
		listOfResource.add(resource);
		Iterable<Resource> resourceIterable=listOfResource;
		headerComponentModel.setRequest(request);
		when(request.getResource()).thenReturn(resource);
		when(resource.getChild(Mockito.anyString())).thenReturn(resource);
		when(resource.hasChildren()).thenReturn(true);
		when(resource.getChildren()).thenReturn(resourceIterable);
		when(resource.getValueMap()).thenReturn(resourceValueMap);
		when(resourceValueMap.containsKey(Mockito.any())).thenReturn(true);
		when(resourceValueMap.get(Mockito.any())).thenReturn("Sample");
		headerComponentModel.init();
		when(resourceValueMap.containsKey(Mockito.any())).thenReturn(false);
		headerComponentModel.init();
		when(resource.hasChildren()).thenReturn(false);
		headerComponentModel.init();		
		when(resource.getChild(Mockito.anyString())).thenReturn(null);
		headerComponentModel.init();
		Assert.assertNotNull(headerComponentModel.getHeaderMenu());
		when(request.getResource()).thenReturn(null);
		headerComponentModel.init();
	}


}
