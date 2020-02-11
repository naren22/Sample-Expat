package com.expatportal.core.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.reflect.Whitebox;

import com.expatportal.core.service.MemberService;

@PrepareForTest({ URL.class, HttpURLConnection.class })
public class GetCountriesListServletTest {

	private MemberService memberService = Mockito.mock(MemberService.class);

	private SlingHttpServletRequest request = Mockito.mock(SlingHttpServletRequest.class);

	private SlingHttpServletResponse response = Mockito.mock(SlingHttpServletResponse.class);

	@Test
	public void testDoGet() throws ServletException, IOException {
		HttpURLConnection httpConnection = PowerMockito.mock(HttpURLConnection.class);
		InputStream inputStream = IOUtils.toInputStream("test-data");
		Mockito.when(httpConnection.getInputStream()).thenReturn(inputStream);
		URLStreamHandler urlStreamHandler = new URLStreamHandler() {
			@Override
			protected URLConnection openConnection(URL u) throws IOException {
				return httpConnection;
			}
		};
		URL url = new URL(null, "https://www.google.com", urlStreamHandler);
		GetCountriesListServlet servlet = new GetCountriesListServlet();
		Mockito.when(memberService.getCountryEndpoint()).thenReturn("https://somevalidendpoint.com/endpoint");
		Mockito.when(response.getWriter()).thenReturn(new PrintWriter("test-data"));
		GetCountriesListServlet spyObject = Mockito.spy(servlet);
		Whitebox.setInternalState(spyObject, "memberService", memberService);
		Mockito.doReturn(url).when(spyObject).getNewURLObject(Mockito.anyString());
		spyObject.doGet(request, response);
		Mockito.when(response.getWriter()).thenReturn(null);
		spyObject.doGet(request, response);
		spyObject.doPost(request, response);
		Assert.assertNotNull(servlet.getNewURLObject("https://www.google.com"));
	}
}

