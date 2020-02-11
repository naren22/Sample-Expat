/**
 * 
 */
package com.expatportal.core.service;

import static org.junit.Assert.*;

import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

/**
 * @author zsheik1
 *
 */
public class UploadServiceTest {

	
	UploadFilesConfiguration config=Mockito.mock(UploadFilesConfiguration.class);

	/**
	 * Test method for {@link com.expatportal.core.service.TokenServiceImpl#activate(com.expatportal.core.service.UploadFilesConfiguration)}.
	 */
	@Test
	public void testActivate() {

		Mockito.when(config.uploadDestination()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.allowedFileSize()).thenReturn(5);
		Mockito.when(config.getOAuth_URL()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getVirusScanAPI_URL()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getClient_Id()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getClient_Secret()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getGrant_Type()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getRefresh_Token()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getSpace_Id()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getStatus()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getExcellaUrl()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getExcellaPass()).thenReturn("UploadFilesConfiguration");
		Mockito.when(config.getExcellaUID()).thenReturn("UploadFilesConfiguration");
		
		
		UploadServiceImpl serviceImpl=new UploadServiceImpl();
		serviceImpl.activate(config);
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.uploadDestination());
		Assert.assertEquals("Values SHould Be Equal",5, serviceImpl.allowedFileSize());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getOAuth_URL());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getVirusScanAPI_URL());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getClient_Id());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getClient_Secret());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getGrant_Type());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getRefresh_Token());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getSpace_Id());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getStatus());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getExcellaUrl());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getExcellaPass());
		Assert.assertEquals("Values SHould Be Equal","UploadFilesConfiguration", serviceImpl.getExcellaUID());
		
		
	}

}
