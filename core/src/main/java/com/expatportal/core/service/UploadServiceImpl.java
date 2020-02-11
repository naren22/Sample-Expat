package com.expatportal.core.service;


import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.WebServiceClient;

import org.apache.commons.lang3.StringUtils;
//import org.apache.cxf.jaxrs.client.WebClient;
//import org.apache.cxf.transport.http.HTTPConduit;
import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.expatportal.core.pojo.Parameter;
import com.expatportal.core.pojo.SubmissionOnetimePaymentDetail;
import com.expatportal.core.pojo.SubmitClaimRequest;
import com.expatportal.core.pojo.WebIncoming;
import com.expatportal.core.soap.wsdl.ExcellaReturn;
import com.expatportal.core.soap.wsdl.OutputResult;
import com.expatportal.core.soap.wsdl.PCHMAWebService;
import com.expatportal.core.soap.wsdl.PCHMAWebServiceSoap;
import com.google.common.io.Files;
import com.google.gson.Gson;



@Component(service = UploadFiles.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = UploadFilesConfiguration.class)
public class UploadServiceImpl implements UploadFiles {

	
	Logger log = LoggerFactory.getLogger(UploadServiceImpl.class);
	
	@Reference
	private ResourceResolverFactory resourceFactory;
	
	@Reference
	private SubmitClaimService submitservice;

    private UploadFilesConfiguration serviceConfig;


    @Activate
    public void activate(UploadFilesConfiguration config) {
        this.serviceConfig = config;

    }
    
    public ResourceResolver getReadSystemResourceResolver() {
        ResourceResolver resourceResolver = null;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put(ResourceResolverFactory.SUBSERVICE, "expatReadService");
            resourceResolver = resourceFactory.getServiceResourceResolver(paramMap);
        } catch (LoginException e) {
            log.error("Login Exception : " + e);
        }
        return resourceResolver;
    }


    

    @Override
    public JSONObject upload(SlingHttpServletRequest req) throws IOException, ServletException, JSONException {


        final java.util.Map<String, org.apache.sling.api.request.RequestParameter[]> params = req.getRequestParameterMap();
        final org.apache.sling.api.request.RequestParameter[] pArr =params.get("file");
        log.debug("Got files");
        String path = this.serviceConfig.uploadDestination();
        final int allowedSize = this.serviceConfig.allowedFileSize();  //file size in config
        

        JSONObject result =new JSONObject();
        
        if(path.endsWith("/")) {
        	path+=req.getParameter("mbrId")+"/";
        }else {
        	path+="/"+req.getParameter("mbrId")+"/";

        }
        log.debug(path+File.separator);
        Long totalSize=0L;
        List<String> fileNames =new ArrayList<String>();

        StringBuffer infectedFiles = new StringBuffer();

        log.debug("file array : "+pArr);
        for( final org.apache.sling.api.request.RequestParameter fileParam:pArr){
        	log.debug("file : "+fileParam);
        	totalSize+=fileParam.getSize();
        	fileNames.add(fileParam.getFileName());

        	
        	if(!this.scan(fileParam.getInputStream(),fileParam.getFileName())) {
        		infectedFiles.append(fileParam.getFileName()+" \n");
        	}
        	
        }
        
        //check for infected files
        
        if(infectedFiles.length()>0) {
          result.put("status", "failed");
  		  result.put("infectedFiles", infectedFiles.toString());	
  		  return result;
  		}
        log.debug("calculated file size"+totalSize);
        log.debug("allowed file size"+allowedSize);
        if(!validSize(req,totalSize,path, Long.valueOf(allowedSize*1024*1024))) {
        	result.put("status", "failed");
        	result.put("msg", "filesize has exceeded the limit");
        	return result; 
        }
        log.debug("file size is valid");       
        log.debug("path ::: "+path); 
        if(path != null && !"".equals(path) ) {
        	deleteAllFiles(req);
	        for( final org.apache.sling.api.request.RequestParameter fileParam:pArr){
	        	log.debug("writing file to dam");
	        	wirteToDam(req,fileParam.getInputStream(),path,fileParam.getFileName(),fileParam.getContentType());
	        }
        }else {
        	result.put("status", "failed");
        	result.put("msg",  "path is not configured");
        	return result; 
        }
        
		result.put("status", "success");
		result.put("path",path);
		result.put("msg",  "files uploded succesfully");
       
        return result;    

    }
    
    //Validating file size
    private boolean validSize(SlingHttpServletRequest req, Long newFilesSize,String path, Long sizeLimit) {
    	

    	log.debug(path+" Pah from validSize");
    	Resource res = getReadSystemResourceResolver().getResource(path);

    	
    	/*Long fs=0L; //to hold the total size of uploaded files
    	if(res != null) {
	    	Asset asset=null;
	    	for (Resource childRes : res.getChildren()) { //getting total size of uploaded files
	    		asset=childRes.adaptTo(Asset.class);
	    		log.debug("asset="+asset);
	    		if(asset != null && asset.getMetadata("dam:size") instanceof Long) {
	    			fs+=(Long)asset.getMetadata("dam:size");
	    		}
	    	}
    	}*/
	    if( newFilesSize > sizeLimit ) { // validating if uploaded files size + size of new files are within given limit
	    	log.info("False return ");
	    	return false;
	    }
    	return true;
    }
    
    // Validating if file is already existing
    private boolean isDuplicate(SlingHttpServletRequest req, String path, List<String> fileNames) {
        boolean duplicate =false;

         try {

             Resource res = getReadSystemResourceResolver().getResource(path);

             if(res != null) {
	             for (Resource cRes : res.getChildren()) {// Validating if file is already exist
	                 if(fileNames.contains(cRes.getName())){
	                     duplicate=true;
	                     break;
	                 }
	             }
             }
         } catch (Exception e) {
        	 log.error("Something wrong while checking duplicates ->" + e);
         }

         return duplicate;
     }
    
    

    //Writing files to AEM
    private void wirteToDam(SlingHttpServletRequest req, InputStream is, String path, String fileName, String mimetype){
        try
        {
            

            //Use AssetManager to place the file into the AEM DAM
            com.day.cq.dam.api.AssetManager assetMgr = getReadSystemResourceResolver().adaptTo(com.day.cq.dam.api.AssetManager.class);

            String newFile = path+fileName ;
            log.debug("newFile ::::: "+newFile);
            assetMgr.createAsset(newFile, is, mimetype, true);
            log.debug("asset created::  ::::: "+newFile);
        }
        catch(Exception e)
        {
        	log.error("Something wrong while writing the files to AEM ->" + e);
        }
    }



	@Override
	public String deleteFile(SlingHttpServletRequest req) throws IOException, ServletException {

		String fileName = req.getParameter("fileName");
		boolean status=false;
		if ( fileName != null ) {
			String path = this.serviceConfig.uploadDestination();
			if(path.endsWith("/")) {
		        	path+=req.getParameter("mbrId")+"/";

		    }else {
	        	path+="/"+req.getParameter("mbrId")+"/";
	        }
			path+=fileName;
			log.debug("File to be deleted : "+ path);
	
			log.debug("creating session");
			Session session = getReadSystemResourceResolver().adaptTo(Session.class);
			try {
				log.debug("creating root node"+session);

				
				
				Node fileNode=session.getNode(path);
				if(fileNode != null) {
					fileNode.remove();
					status=true;
				}else {
					status=false;
				}
				
				if(session.hasPendingChanges()) {
					session.save();
				}
				
			} catch (RepositoryException e) {
				
				e.printStackTrace();
				log.debug("ERROR :"+e);
			}
			if(status) {
				return "File Removed Successfully :"+ fileName;
			}else {
				return "Oops! Could not delete the file:"+ fileName;
			}
		}else {
			return "Please provide a file to delete !";
		}

	}

	@Override
    public String deleteAllFiles(SlingHttpServletRequest req) {
        String fileName = req.getParameter("fileName");
        boolean status = false;
      
        String path = this.serviceConfig.uploadDestination();
        if (path.endsWith("/")) {
            path += req.getParameter("mbrId") + "/";

        }else {
        	path+="/"+req.getParameter("mbrId")+"/";

        }
        if (fileName != null) {
            path += fileName;
            log.debug("File to be deleted : " + path);
        }

        Session session = getReadSystemResourceResolver().adaptTo(Session.class);
        try {
            log.debug("creating root node" + session);
            
            if(session.getNode(path) != null) {
            	Node fileNode = session.getNode(path);
            	fileNode.remove();
            	status = true;
            	if (session.hasPendingChanges()) {
            		session.save();
            	}
            }
        } catch (RepositoryException e) {
            
            e.printStackTrace();
            log.debug("ERROR :" + e);
        }
        if (status) {
            return "File removed successfully from :" + path;
        } else {
            return "Oops! Could not delete the files from :" + path;
        }
    }

	@Override
	public String getFilesWithDetails(SlingHttpServletRequest req,String mbrId) throws IOException, ServletException {
		 String path = this.serviceConfig.uploadDestination();
		 StringBuffer sb =new StringBuffer(); 
	      if(path !=null && "".equalsIgnoreCase(path)) { 
	        if(!path.endsWith("/")) {
	        	path+="/";
	        }
	        path+=mbrId+"/";

	        Resource res= getReadSystemResourceResolver().getResource(path);

	        List<FileDetails> fileList=new ArrayList<FileDetails>();
	        if(res!=null) {
	        	for(Resource tempRes : res.getChildren()) {
	        		final Asset asset=tempRes.adaptTo(Asset.class);
	        		if(asset!=null) {
	        			final FileDetails fd =new FileDetails();
	        			fd.setName(asset.getName());
	        			fd.setPath(asset.getPath());
	        			fd.setSize(asset.getMetadata("dam:size").toString());
	        			
	        			fileList.add(fd);
	        			
	        		}
	        	}
	        	sb.append(new Gson().toJson(fileList));
	        }
	        
	      }
		return sb.toString();
	}
	

	
	private boolean scan(InputStream filestream,String name) {
		
		String url =  this.serviceConfig.getVirusScanAPI_URL()+ this.serviceConfig.getSpace_Id();
		try {
			log.debug("Getting OAuth token ");
			Token token=  new Gson().fromJson(getToken(), Token.class);
			log.debug("scanning file : "+name);
			if(token != null) {
				HttpClient client= HttpClients.createDefault();
				HttpPost post = new HttpPost(url);
				post.setHeader("Accept", "application/json");
				post.setHeader("ContentType", "multipart/form-data");
				post.setHeader("Authorization", token.getToken_type() + " " +token.getAccess_token());
				
				MultipartEntityBuilder builder = MultipartEntityBuilder.create();
				File parent = new File(System.getProperty("java.io.tmpdir"));  //Hard coded value does not lead to any injection 

				
				byte[] buffer = new byte[filestream.available()];
				filestream.read(buffer);
				
				
				File targetFile =new File(parent,name);//File.createTempFile(names[0], "."+names[1]);
			    OutputStream outStream = new FileOutputStream(targetFile);
			    
			    try {
					outStream.write(buffer);
				}finally {
					outStream.close();
				}
				
				builder.addPart(name, new FileBody(targetFile));
				post.setEntity(builder.build());
				
				HttpResponse response =client.execute(post);
				String content = EntityUtils.toString(response.getEntity());
				log.debug("scan result : "+ content);
				if(content !=null) {
					VirusScanResponse scanresp = new Gson().fromJson(content, VirusScanResponse.class);
					if(scanresp !=null) {
						for(Virusscan vs : scanresp.virusscan){
							if(!"CLEAN".equalsIgnoreCase(vs.getStatus())) {
								return false;
							}
						}
					}else {
						log.debug("Assuming file is infected ");
						return false;
					}
				}
				
			}else {
				log.debug("Token not found");
			}
			
		} catch (Exception e) {
			log.error("Error while scanning file : "+e);
		}
		return true;
	}
	
	
	public String getToken() {

		StringBuffer response = new StringBuffer();
		try {
			String tokenURL =this.serviceConfig.getOAuth_URL();
			URL tokenURLObject = new URL(tokenURL);
			
			log.debug(tokenURL);
			
			
			HttpClient client= HttpClients.createDefault();
			   List<NameValuePair> form = new ArrayList<>();
	            form.add(new BasicNameValuePair("grant_type", this.serviceConfig.getGrant_Type()));
	            form.add(new BasicNameValuePair("client_secret", this.serviceConfig.getClient_Secret()));
	            form.add(new BasicNameValuePair("client_id",  this.serviceConfig.getClient_Id()));
	            UrlEncodedFormEntity entity = new UrlEncodedFormEntity(form, Consts.UTF_8);

	            HttpPost httpPost = new HttpPost(tokenURL);
	            httpPost.setEntity(entity);
	            log.debug("Executing request " + httpPost.getRequestLine());

	            // Create a custom response handler
	            HttpResponse res =client.execute(httpPost);
				String content = EntityUtils.toString(res.getEntity());
				response.append(content);
			
		
			log.debug("Token String : "+response.toString());
		} catch (Exception e) {
			log.error("ERror getting token ", e);
		}

		return response.toString();
	}
	
	class Token {
		
		
		
		String token_type ;
		String access_token;
		int expires_in ;
		public String getToken_type() {
			return token_type;
		}
		public void setToken_type(String token_type) {
			this.token_type = token_type;
		}
		public String getAccess_token() {
			return access_token;
		}
		public void setAccess_token(String access_token) {
			this.access_token = access_token;
		}
		public int getExpires_in() {
			return expires_in;
		}
		public void setExpires_in(int expires_in) {
			this.expires_in = expires_in;
		}
		
		
		
	}
	

	private static class FileDetails{
		String path;
		String name;
		String size;
		public String getPath() {
			return path;
		}
		public void setPath(String path) {
			this.path = path;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getSize() {
			return size;
		}
		public void setSize(String size) {
			this.size = size;
		}

	}
	
	static class Virusscan
	{
		String filename;
	    String status ;
	    String status_code;
	    String description;
	    int file_size;
		public String getFilename() {
			return filename;
		}
		public void setFilename(String filename) {
			this.filename = filename;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public String getStatus_code() {
			return status_code;
		}
		public void setStatus_code(String status_code) {
			this.status_code = status_code;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public int getFile_size() {
			return file_size;
		}
		public void setFile_size(int file_size) {
			this.file_size = file_size;
		}
	    
	}
	class VirusScanResponse
	{
	    public List<Virusscan> virusscan;

		public List<Virusscan> getVirusscan() {
			return virusscan;
		}

		public void setVirusscan(List<Virusscan> virusscan) {
			this.virusscan = virusscan;
		}
	       
	}
	
	@Override
	public String zipFiles(SlingHttpServletRequest req,SubmitClaimRequest request) {
		
		final String mbrId=req.getParameter("mbrId") ;
		String SSP_SUBMISSION_ID=null;
		ZipOutputStream zos = null;
		try {
			if(null == mbrId || "".equalsIgnoreCase(mbrId)) {
			
			}else {
				String path = this.serviceConfig.uploadDestination();
				
				
				File tmpZip = File.createTempFile(mbrId, ".zip");
				 
				 zos = new ZipOutputStream(new FileOutputStream(tmpZip));
				
				byte bytes[] =new byte[2048];
				log.debug("getting assests");
				Resource res = getReadSystemResourceResolver().getResource(path+"/"+mbrId);
				if(res==null) {
					return "no images";
				}
				int fileCount=0;
				try {
					for(Resource childRes : res.getChildren()) {
						Asset asset = childRes.adaptTo(Asset.class);
						if(asset != null) {
							fileCount++;
							InputStream is = asset.getOriginal().getStream();
							BufferedInputStream bis = new BufferedInputStream(is);
							zos.putNextEntry(new ZipEntry(asset.getName()));
							
							log.debug("file added to zip : "+asset.getName());
							int byteReads;
							while((byteReads = bis.read(bytes)) != -1) {
								zos.write(bytes, 0, byteReads);
							}
							zos.closeEntry();
							is.close();
							bis.close();
						}
				
					}
				}finally {
					if(zos!=null){
						zos.flush();
					zos.close();
					}
				}
				
				if(fileCount ==0) {
					return "no images";
				}
				log.debug("Zip created");
				DateFormat df = new SimpleDateFormat("yyyyMMdd_hhmmss");
				Date dateobj = new Date();
				//System.out.println(df.format(dateobj));
				
				String filename="clm_sbmsn_"+mbrId+"_"+df.format(dateobj)+".zip";
				File xmlFile= getExcellaXMLFile(req,mbrId , filename, request);
				
				SSP_SUBMISSION_ID = submitToExcella(filename, Files.toByteArray(tmpZip),Files.toByteArray(xmlFile));
				//this.wirteToDam(req, new FileInputStream(tmpZip), path, filename, "application/zip");
				return SSP_SUBMISSION_ID;
			}
		}catch(Exception e) {
			log.error("Error while zipping file :",e);
		}
		
		return null;
		
	}
	
	private File getExcellaXMLFile(SlingHttpServletRequest req, String mbrId,String imageName,SubmitClaimRequest request) {
		DateFormat df = new SimpleDateFormat("yyyyMMdd_hhmmss");
		Date dateobj = new Date();
		
		try {
			File file = File.createTempFile("Excella_"+mbrId, ".xml");
			//SubmitClaimRequest request = submitservice.getSubmitClaimRequest(req);
			//Xml mapping
			String provideTwnCity =request.getProviderCityName();
			if(StringUtils.isNotBlank(provideTwnCity) ) {
				if( provideTwnCity.trim().length() > 100) {
					provideTwnCity = provideTwnCity.trim().substring(0,100);
				}else {
					provideTwnCity = provideTwnCity.trim();
				}
			}
			
	
			
			WebIncoming webincoming= new WebIncoming();
			webincoming.setProject("PCH");
			webincoming.setCustomer("UHC01");
			webincoming.setActionName("Webserviceincome");
			webincoming.addDetails(new Parameter("Member_ID",request.getAltId())); 
			
			webincoming.addDetails(new Parameter("Patient_Name",request.getPatientName().trim()));
			
			webincoming.addDetails(new Parameter("Patient_DOB",request.getPatientDateOfBirth() ));
			webincoming.addDetails(new Parameter("Member_PhoneNo", "9999999999"));
			webincoming.addDetails(new Parameter("Member_Email", "NA"));
			webincoming.addDetails(new Parameter("Patient_Street", "NA"));
			webincoming.addDetails(new Parameter("Patient_Town_city", "NA"));
			webincoming.addDetails(new Parameter("Patient_Province_State", "NA"));
			webincoming.addDetails(new Parameter("Patient_Country", request.getPatientCountryCode()));
			webincoming.addDetails(new Parameter("Patient_Postal_Code", "NA"));
			webincoming.addDetails(new Parameter("Provider_facility_name", request.getProviderName()));
			webincoming.addDetails(new Parameter("Provider_facility_correspondence_address", "NA"));
			webincoming.addDetails(new Parameter("Provider_Street", "NA"));
			webincoming.addDetails(new Parameter("Provider_Town_city",provideTwnCity));
			webincoming.addDetails(new Parameter("Provider_Province_State", "NA"));
			webincoming.addDetails(new Parameter("Provider_Country", request.getProviderCountryCode()));
			webincoming.addDetails(new Parameter("Provider_Postal_Code", "NA"));
			webincoming.addDetails(new Parameter("Provider_Currency_bill_submitted", request.getBilledCurrencyCode()));
			webincoming.addDetails(new Parameter("Provider_DOS",request.getDateOfService()));
			webincoming.addDetails(new Parameter("Payment_to", "1"));
			webincoming.addDetails(new Parameter("service_rendered", "9"));
			webincoming.addDetails(new Parameter("Other_briefly", request.getDiagnosis()));//get diagnosis
			String osr ="NA";
			String  ohpv =  request.getMethodOfTreatment();
			if(StringUtils.isNotBlank(ohpv) && ohpv.length() > 150) {
				osr = ohpv.substring(150);
				ohpv =ohpv.substring(0,150);
				}
			
			webincoming.addDetails(new Parameter("Other_healthcare_provider_visit",ohpv));//150 characters max
			webincoming.addDetails(new Parameter("Other_services_rendered", osr ));//151-200 of method of treatment or NA,get method of treatment
			int reimOption=1;
			String reim = "Yes";
			if(request.getSubmissionBankingDetails() != null && request.getSubmissionBankingDetails().size() >0 &&
					request.getSubmissionBankingDetails().get(0).getBankingPreferenceTypeId() == 1502) {
				reim = "No";
				String mthod = request.getSubmissionBankingDetails().get(0).getSubmissionOnetimePaymentDetail().getPaymentMethodCode();
				if("EFT".equalsIgnoreCase(mthod)) {
					reimOption = 3;
				} else {
					reimOption = 2;
				}
				
			}
			webincoming.addDetails(new Parameter("Reimbursement Options", String.valueOf(reimOption)));
			
			
			
			String payeeName="NA",bankName="NA",bankStreet="NA",bankTownCity="NA",
					bankProvinceState="NA",bankCountry="NA",bankPostalCode="NA", swiftCode="NA", iban = "NA", spCurr="NA";
			StringBuffer bankAddr=new StringBuffer("");
			if(request.getSubmissionBankingDetails() !=null &&
					request.getSubmissionBankingDetails().size()>0 &&
					request.getSubmissionBankingDetails().get(0).getSubmissionOnetimePaymentDetail() !=null) {
			
					SubmissionOnetimePaymentDetail sOTPD=	request.getSubmissionBankingDetails().get(0).getSubmissionOnetimePaymentDetail();
					payeeName = StringUtils.isNotBlank(sOTPD.getPayeeName())?sOTPD.getPayeeName():"NA";
					
					if(StringUtils.isNotBlank(sOTPD.getAddressLine1())) bankAddr.append(sOTPD.getAddressLine1()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine2())) bankAddr.append(sOTPD.getAddressLine2()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine3())) bankAddr.append(sOTPD.getAddressLine3()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine4())) bankAddr.append(sOTPD.getAddressLine4()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine5())) bankAddr.append(sOTPD.getAddressLine5()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine6())) bankAddr.append(sOTPD.getAddressLine6()).append(" ");
					if(StringUtils.isNotBlank(sOTPD.getAddressLine7())) bankAddr.append(sOTPD.getAddressLine7()).append(" ");
				
					if(bankAddr.toString().length() >100) {
						bankAddr = new StringBuffer(bankAddr.subSequence(0, 100));
					}
					
					bankName = sOTPD.getBankName();
					bankStreet =  sOTPD.getAddressLine1();
					bankTownCity = sOTPD.getAddressLine2();
					bankProvinceState = sOTPD.getAddressLine3();
					bankCountry = sOTPD.getCountryCode();
					bankPostalCode = sOTPD.getAddressLine4();
					swiftCode = sOTPD.getSwfitCode();
					iban = sOTPD.getIban();
					
					spCurr =sOTPD.getCurrencyCode();
			}
			
			webincoming.addDetails(new Parameter("Specify_currency_reimbursement", StringUtils.isNotBlank(spCurr)?spCurr:"NA"));
			webincoming.addDetails(new Parameter("Beneficiary_bank_routingcode", "NA"));

			
			webincoming.addDetails(new Parameter("SWIFT_BIC_Code", swiftCode));
			webincoming.addDetails(new Parameter("AccountNo_IBAN", iban));
			
			webincoming.addDetails(new Parameter("AccountName_Payee", payeeName));
			/**if(reimOption==3) 
			{
				webincoming.addDetails(new Parameter("Bank_address", bankAddr.toString().trim()));
				webincoming.addDetails(new Parameter("Bank_Street",bankStreet));
				webincoming.addDetails(new Parameter("Bank_Town_City", bankTownCity));
				webincoming.addDetails(new Parameter("Bank_Province_State", bankProvinceState));
				webincoming.addDetails(new Parameter("Bank_Country",bankCountry));
				webincoming.addDetails(new Parameter("Bank_postalcode", bankPostalCode));
				webincoming.addDetails(new Parameter("Bank_name",bankName));
			}
			else {
				webincoming.addDetails(new Parameter("Bank_address", "NA"));
				webincoming.addDetails(new Parameter("Bank_Street","NA"));
				webincoming.addDetails(new Parameter("Bank_Town_City", "NA"));
				webincoming.addDetails(new Parameter("Bank_Province_State", "NA"));
				webincoming.addDetails(new Parameter("Bank_Country",bankCountry));
				webincoming.addDetails(new Parameter("Bank_postalcode", "NA"));
				webincoming.addDetails(new Parameter("Bank_name","NA"));
			}**/
			
			webincoming.addDetails(new Parameter("Bank_address",StringUtils.isBlank(bankAddr.toString())? "NA" : bankAddr.toString().trim()));
            webincoming.addDetails(new Parameter("Bank_Street",StringUtils.isBlank(bankStreet)? "NA" :bankStreet));
            webincoming.addDetails(new Parameter("Bank_Town_City", StringUtils.isBlank(bankTownCity)? "NA" :bankTownCity));
            webincoming.addDetails(new Parameter("Bank_Province_State",StringUtils.isBlank( bankProvinceState)? "NA" :bankProvinceState));
            webincoming.addDetails(new Parameter("Bank_Country",StringUtils.isBlank(bankCountry)? "NA" :bankCountry));
            webincoming.addDetails(new Parameter("Bank_postalcode", StringUtils.isBlank(bankPostalCode)? "NA" :bankPostalCode));
            webincoming.addDetails(new Parameter("Bank_name", StringUtils.isBlank(bankName)? "NA" :bankName));

			
			
			webincoming.addDetails(new Parameter("Reimbursement", reim));
			webincoming.addDetails(new Parameter("UploadPage_Count", "1"));
			webincoming.addDetails(new Parameter("ImageName",imageName));
			webincoming.addDetails(new Parameter("ImageType", "Zip"));
			
			 //Create JAXB Context
            JAXBContext jaxbContext = JAXBContext.newInstance(WebIncoming.class);
            //Create Marshaller
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            //Required formatting??
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
            jaxbMarshaller.setProperty(Marshaller.JAXB_ENCODING, "UTF-8");
 
            StringWriter sw = new StringWriter();
            jaxbMarshaller.marshal(webincoming, sw);
            String xmlContent = sw.toString();
           log.debug( xmlContent );
             
            //Writes XML file to file-system
          jaxbMarshaller.marshal(webincoming, file);
           
			return file;
			
		}catch(Exception e) {
			log.error("Eror while xml creation "+e);
		}
		
		
		return null;
	}

	private String submitToExcella(String imagefileName, byte[] fsImage, byte[] fsXml) {
		String submissionId=null;
		long startime =System.currentTimeMillis();
		try {
		log.debug("Inside excella submition");
		URL url= new URL(serviceConfig.getExcellaUrl());
		log.debug("URL :"+url);
		
		System.getProperties().put("proxySet", "true");// setting system proxy
		System.getProperties().put("https.proxyHost",serviceConfig.getProxyHost());  // a10corp-bcprx.wip.uhc.com
		System.getProperties().put("https.proxyPort", serviceConfig.getProxyPort()); //8080
		System.getProperties().put("https.protocols", "TLSv1,TLSv1.1,TLSv1.2");
		System.setProperty("com.sun.xml.internal.ws.connect.timeout ", "60000"); 
		PCHMAWebService service = new PCHMAWebService(url);
		PCHMAWebServiceSoap soapservice =service.getPCHMAWebServiceSoap();
		
//		HTTPConduit conduit=WebClient.getConfig(soapservice).getHttpConduit();
//		conduit.getClient().setConnectionTimeout(1000 * 3);
//		conduit.getClient().setReceiveTimeout(1000 * 3);
		
		//((BindingProvider) soapservice).getRequestContext().put("javax.xml.ws.client.connectionTimeout", new Integer(10000));
		//((BindingProvider) soapservice).getRequestContext().put("javax.xml.ws.client.receiveTimeout", new Integer(10000));
		log.debug("Inside excella submition:service ");
		OutputResult result = soapservice.uploadFile(serviceConfig.getExcellaUID(), 
				serviceConfig.getExcellaPass(), fsXml, fsImage, imagefileName);
		
		
		log.debug("EXcella result in "+ (startime-System.currentTimeMillis()));
		log.debug("result msg:"+result.getMessage());
		log.debug("result status :"+result.getStatus());
		submissionId = new ExcellaReturn().getSubmissionId(result.getMessage());
		
		
		}catch(Exception e) {
			log.error("finished in "+ (startime-System.currentTimeMillis()));
			log.error("Exception in soap service : ", e);
		}
		return submissionId;
	}
	
	public String uploadDestination() {
		
		return serviceConfig.uploadDestination();
	}
	
	public int allowedFileSize() {
		
		return serviceConfig.allowedFileSize();
	}
	
	public String getOAuth_URL() {
		
		return serviceConfig.getOAuth_URL();
	}
	
	public String getVirusScanAPI_URL() {
		
		return serviceConfig.getVirusScanAPI_URL();
	}
	
	public String getClient_Id() {
		
		return serviceConfig.getClient_Id();
	}
	
	public String getClient_Secret() {
		
		return serviceConfig.getClient_Secret();
	}
	
	public String getGrant_Type() {
		
		return serviceConfig.getGrant_Type();
	}
	
	public String getRefresh_Token() {
		
		return serviceConfig.getRefresh_Token();
	}
	
	public String getSpace_Id() {
		
		return serviceConfig.getSpace_Id();
	}
	
	public String getStatus() {
		
		return serviceConfig.getStatus();
	}
	
	public String getExcellaUrl() {
		
		return serviceConfig.getExcellaUrl();
	}
	
	public String getExcellaPass() {
		
		return serviceConfig.getExcellaPass();
	}
	
	public String getExcellaUID() {
		
		return serviceConfig.getExcellaUID();
	}
	
	public int getExelaTimeOut() {
		
		return serviceConfig.getExelaTimeOut();
	}
}