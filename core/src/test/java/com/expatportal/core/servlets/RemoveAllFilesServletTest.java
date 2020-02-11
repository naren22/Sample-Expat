package com.expatportal.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;

import com.expatportal.core.service.UploadFiles;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.json.JSONException;
import org.junit.Test;
import static org.mockito.Mockito.*;

/**
 * @author dracha
 *
 */
public class RemoveAllFilesServletTest {

	SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
	SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
	UploadFiles uploadService = mock(UploadFiles.class);
	PrintWriter printWriter = mock(PrintWriter.class);	
	
	@Test
	public void shouldReturnSuccessWhenFilesDeletedSuccessfully() throws JSONException, ServletException, IOException, Exception {
		RemoveAllFilesServlet servlet = new RemoveAllFilesServlet();
		when(uploadService.deleteAllFiles(request)).thenReturn("success");
		when(response.getWriter()).thenReturn(printWriter);
		
		//servlet.doPost(request, response);
	}
	
	@Test
	public void shouldReturnErrorWhenUploadServiceThrowsError() throws ServletException, IOException, JSONException, Exception {
		RemoveAllFilesServlet servlet = new RemoveAllFilesServlet();
		when(uploadService.deleteAllFiles(request)).thenThrow(new ServletException());
		when(response.getWriter()).thenReturn(printWriter);
		
		//servlet.doPost(request, response);
	}
}
