package com.expatportal.core.service;

import java.io.BufferedReader;
import java.net.URL;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import  com.expatportal.core.pojo.SubmitClaimRequest;

import com.expatportal.core.service.ModifyPrefereceServiceImpl.Token;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Component(service = SubmitClaimService.class,configurationPolicy=ConfigurationPolicy.REQUIRE)
@Designate(ocd = SubmitClaimConfiguration.class)
public class SubmitClaimServiceImpl implements SubmitClaimService {

	Logger log = LoggerFactory.getLogger(SubmitClaimServiceImpl.class);
	@Reference
	private ModifyPreferenceService tokenservice;
	private SubmitClaimConfiguration config;

	
	@Activate void activate(SubmitClaimConfiguration config) {
		this.config=config;
	}
	
	
	@Override
	public String submitClaim(SlingHttpServletRequest req,SubmitClaimRequest request,String submissionId) {
		// TODO Auto-generated method stub
		StringBuffer response = new StringBuffer();
		Long startTime = 0L;
		try {
			log.debug("Getting OAuth token ");
			String tokenString=tokenservice.getToken();
			Token token=  new Gson().fromJson(tokenString, Token.class);
			log.debug("successfully generated token:"+tokenString);
			if(token != null) {
				if (request == null) request = getSubmitClaimRequest(req);
				log.debug("request object :" + request);
				String submitClaimURL= config.getSubmitClaimAPIURL();
				log.debug("request URL :" + submitClaimURL);
				
				HttpClient client= HttpClients.createDefault();
				HttpPost httpPost = new HttpPost(submitClaimURL);

				if(submissionId != null) {
				request.setExelaSubmissionId(submissionId);
				}
				log.debug("new request json :"+new Gson().toJson(request));
				StringEntity entity =new StringEntity(new Gson().toJson(request),"UTF-8");

		        httpPost.setEntity(entity);
		        httpPost.setHeader("Content-Type", "application/json");
		        httpPost.setHeader("Accept", "application/json");
				//post.setHeader("Content-type", "application/json");
		        httpPost.setHeader("Authorization", token.getToken_type() + " " +token.getAccess_token());
		        
				log.debug("Executing request " + httpPost.getRequestLine());
		        startTime = System.currentTimeMillis();
		         // Create a custom response handler
		         HttpResponse res =client.execute(httpPost);
				 String content = EntityUtils.toString(res.getEntity());
				 log.debug("response :"+content);
				 response.append(content);
				 log.info("Claim Submission API completed in : "+(System.currentTimeMillis() - startTime)+" ms");
			}
		}catch(Exception e) {
			log.error("Claim Submission API failed in : "+(System.currentTimeMillis() - startTime)+" ms");
			log.error("Error while submitting claim : "+e);
			response.append(e.getMessage());
		}
		return response.toString();
	}
	
	/*
	class SubmitClaimRequestold {

		int BANK_PAY_TYPE_ID;
		int UPLOAD_TYP_IND;
		int PAT_MBR_ID;
		int SBMTD_TYPE_ID;
		String SSP_SUBMISSION_ID;
		String PROV_ID;
		String DT_OF_SRVC;
		String TOT_BLD_AMT;
		String CRNCY_CD;
		String SSP_CLM_NM;
		int SSP_NUM_CLMS;
		String PROV_NM;
		String PROV_ADR_CTY_NM;
		String PROV_ADR_CNTRY_NM;
		String OTP_CRNCY_CD;
		String OTP_CNTRY_CD;
		String OTP_PAY_METH_CD;
		String OTP_ORG_NM;
		String OTP_BNK_DTL_1_TXT;
		String OTP_BNK_DTL_2_TXT;
		String OTP_BNK_DTL_3_TXT;
		String OTP_BNK_DTL_4_TXT;
		String OTP_BNK_DTL_5_TXT;
		String OTP_BNK_DTL_6_TXT;
		String OTP_BNK_DTL_7_TXT;
		String OTP_BNK_DTL_8_TXT;
		String OTP_BNK_DTL_9_TXT;
		String OTP_BNK_DTL_10_TXT;
		String OTP_BNK_DTL_11_TXT;
		String OTP_BNK_DTL_12_TXT;
		String OTP_BNK_DTL_13_TXT;
		String OTP_BNK_DTL_14_TXT;
		String OTP_BNK_DTL_15_TXT;
		public String getOTP_BNK_DTL_6_TXT() {
			return OTP_BNK_DTL_6_TXT;
		}
		public void setOTP_BNK_DTL_6_TXT(String oTP_BNK_DTL_6_TXT) {
			OTP_BNK_DTL_6_TXT = oTP_BNK_DTL_6_TXT;
		}
		public String getOTP_BNK_DTL_7_TXT() {
			return OTP_BNK_DTL_7_TXT;
		}
		public void setOTP_BNK_DTL_7_TXT(String oTP_BNK_DTL_7_TXT) {
			OTP_BNK_DTL_7_TXT = oTP_BNK_DTL_7_TXT;
		}
		public String getOTP_BNK_DTL_8_TXT() {
			return OTP_BNK_DTL_8_TXT;
		}
		public void setOTP_BNK_DTL_8_TXT(String oTP_BNK_DTL_8_TXT) {
			OTP_BNK_DTL_8_TXT = oTP_BNK_DTL_8_TXT;
		}
		public String getOTP_BNK_DTL_9_TXT() {
			return OTP_BNK_DTL_9_TXT;
		}
		public void setOTP_BNK_DTL_9_TXT(String oTP_BNK_DTL_9_TXT) {
			OTP_BNK_DTL_9_TXT = oTP_BNK_DTL_9_TXT;
		}
		public String getOTP_BNK_DTL_10_TXT() {
			return OTP_BNK_DTL_10_TXT;
		}
		public void setOTP_BNK_DTL_10_TXT(String oTP_BNK_DTL_10_TXT) {
			OTP_BNK_DTL_10_TXT = oTP_BNK_DTL_10_TXT;
		}
		public String getOTP_BNK_DTL_11_TXT() {
			return OTP_BNK_DTL_11_TXT;
		}
		public void setOTP_BNK_DTL_11_TXT(String oTP_BNK_DTL_11_TXT) {
			OTP_BNK_DTL_11_TXT = oTP_BNK_DTL_11_TXT;
		}
		public String getOTP_BNK_DTL_12_TXT() {
			return OTP_BNK_DTL_12_TXT;
		}
		public void setOTP_BNK_DTL_12_TXT(String oTP_BNK_DTL_12_TXT) {
			OTP_BNK_DTL_12_TXT = oTP_BNK_DTL_12_TXT;
		}
		public String getOTP_BNK_DTL_13_TXT() {
			return OTP_BNK_DTL_13_TXT;
		}
		public void setOTP_BNK_DTL_13_TXT(String oTP_BNK_DTL_13_TXT) {
			OTP_BNK_DTL_13_TXT = oTP_BNK_DTL_13_TXT;
		}
		public String getOTP_BNK_DTL_14_TXT() {
			return OTP_BNK_DTL_14_TXT;
		}
		public void setOTP_BNK_DTL_14_TXT(String oTP_BNK_DTL_14_TXT) {
			OTP_BNK_DTL_14_TXT = oTP_BNK_DTL_14_TXT;
		}
		public String getOTP_BNK_DTL_15_TXT() {
			return OTP_BNK_DTL_15_TXT;
		}
		public void setOTP_BNK_DTL_15_TXT(String oTP_BNK_DTL_15_TXT) {
			OTP_BNK_DTL_15_TXT = oTP_BNK_DTL_15_TXT;
		}
		String OTP_ADR_LN_1_TXT;
		String OTP_ADR_LN_2_TXT;
		String OTP_ADR_LN_3_TXT;
		String OTP_ADR_LN_4_TXT;
		String OTP_ADR_LN_5_TXT;
		String OTP_ADR_LN_6_TXT;
		String OTP_ADR_LN_7_TXT;
		String OTP_PAYEE_NM;
		String DIAGNOSIS;
		String DESC_OF_TREATMENT;
		public int getBANK_PAY_TYPE_ID() {
			return BANK_PAY_TYPE_ID;
		}
		public void setBANK_PAY_TYPE_ID(int bANK_PAY_TYPE_ID) {
			BANK_PAY_TYPE_ID = bANK_PAY_TYPE_ID;
		}
		public int getUPLOAD_TYP_IND() {
			return UPLOAD_TYP_IND;
		}
		public void setUPLOAD_TYP_IND(int uPLOAD_TYP_IND) {
			UPLOAD_TYP_IND = uPLOAD_TYP_IND;
		}
		public int getPAT_MBR_ID() {
			return PAT_MBR_ID;
		}
		public void setPAT_MBR_ID(int pAT_MBR_ID) {
			PAT_MBR_ID = pAT_MBR_ID;
		}
		public int getSBMTD_TYPE_ID() {
			return SBMTD_TYPE_ID;
		}
		public void setSBMTD_TYPE_ID(int sBMTD_TYPE_ID) {
			SBMTD_TYPE_ID = sBMTD_TYPE_ID;
		}
		public String getSSP_SUBMISSION_ID() {
			return SSP_SUBMISSION_ID;
		}
		public void setSSP_SUBMISSION_ID(String sSP_SUBMISSION_ID) {
			SSP_SUBMISSION_ID = sSP_SUBMISSION_ID;
		}
		public String getPROV_ID() {
			return PROV_ID;
		}
		public void setPROV_ID(String pROV_ID) {
			PROV_ID = pROV_ID;
		}
		public String getDT_OF_SRVC() {
			return DT_OF_SRVC;
		}
		public void setDT_OF_SRVC(String dT_OF_SRVC) {
			DT_OF_SRVC = dT_OF_SRVC;
		}
		public String getTOT_BLD_AMT() {
			return TOT_BLD_AMT;
		}
		public void setTOT_BLD_AMT(String tOT_BLD_AMT) {
			TOT_BLD_AMT = tOT_BLD_AMT;
		}
		public String getCRNCY_CD() {
			return CRNCY_CD;
		}
		public void setCRNCY_CD(String cRNCY_CD) {
			CRNCY_CD = cRNCY_CD;
		}
		public String getSSP_CLM_NM() {
			return SSP_CLM_NM;
		}
		public void setSSP_CLM_NM(String sSP_CLM_NM) {
			SSP_CLM_NM = sSP_CLM_NM;
		}
		public int getSSP_NUM_CLMS() {
			return SSP_NUM_CLMS;
		}
		public void setSSP_NUM_CLMS(int sSP_NUM_CLMS) {
			SSP_NUM_CLMS = sSP_NUM_CLMS;
		}
		public String getPROV_NM() {
			return PROV_NM;
		}
		public void setPROV_NM(String pROV_NM) {
			PROV_NM = pROV_NM;
		}
		public String getPROV_ADR_CTY_NM() {
			return PROV_ADR_CTY_NM;
		}
		public void setPROV_ADR_CTY_NM(String pROV_ADR_CTY_NM) {
			PROV_ADR_CTY_NM = pROV_ADR_CTY_NM;
		}
		public String getPROV_ADR_CNTRY_NM() {
			return PROV_ADR_CNTRY_NM;
		}
		public void setPROV_ADR_CNTRY_NM(String pROV_ADR_CNTRY_NM) {
			PROV_ADR_CNTRY_NM = pROV_ADR_CNTRY_NM;
		}
		public String getOTP_CRNCY_CD() {
			return OTP_CRNCY_CD;
		}
		public void setOTP_CRNCY_CD(String oTP_CRNCY_CD) {
			OTP_CRNCY_CD = oTP_CRNCY_CD;
		}
		public String getOTP_CNTRY_CD() {
			return OTP_CNTRY_CD;
		}
		public void setOTP_CNTRY_CD(String oTP_CNTRY_CD) {
			OTP_CNTRY_CD = oTP_CNTRY_CD;
		}
		public String getOTP_PAY_METH_CD() {
			return OTP_PAY_METH_CD;
		}
		public void setOTP_PAY_METH_CD(String oTP_PAY_METH_CD) {
			OTP_PAY_METH_CD = oTP_PAY_METH_CD;
		}
		public String getOTP_ORG_NM() {
			return OTP_ORG_NM;
		}
		public void setOTP_ORG_NM(String oTP_ORG_NM) {
			OTP_ORG_NM = oTP_ORG_NM;
		}
		public String getOTP_BNK_DTL_1_TXT() {
			return OTP_BNK_DTL_1_TXT;
		}
		public void setOTP_BNK_DTL_1_TXT(String oTP_BNK_DTL_1_TXT) {
			OTP_BNK_DTL_1_TXT = oTP_BNK_DTL_1_TXT;
		}
		public String getOTP_BNK_DTL_2_TXT() {
			return OTP_BNK_DTL_2_TXT;
		}
		public void setOTP_BNK_DTL_2_TXT(String oTP_BNK_DTL_2_TXT) {
			OTP_BNK_DTL_2_TXT = oTP_BNK_DTL_2_TXT;
		}
		public String getOTP_BNK_DTL_3_TXT() {
			return OTP_BNK_DTL_3_TXT;
		}
		public void setOTP_BNK_DTL_3_TXT(String oTP_BNK_DTL_3_TXT) {
			OTP_BNK_DTL_3_TXT = oTP_BNK_DTL_3_TXT;
		}
		public String getOTP_BNK_DTL_4_TXT() {
			return OTP_BNK_DTL_4_TXT;
		}
		public void setOTP_BNK_DTL_4_TXT(String oTP_BNK_DTL_4_TXT) {
			OTP_BNK_DTL_4_TXT = oTP_BNK_DTL_4_TXT;
		}
		public String getOTP_BNK_DTL_5_TXT() {
			return OTP_BNK_DTL_5_TXT;
		}
		public void setOTP_BNK_DTL_5_TXT(String oTP_BNK_DTL_5_TXT) {
			OTP_BNK_DTL_5_TXT = oTP_BNK_DTL_5_TXT;
		}
		public String getOTP_ADR_LN_1_TXT() {
			return OTP_ADR_LN_1_TXT;
		}
		public void setOTP_ADR_LN_1_TXT(String oTP_ADR_LN_1_TXT) {
			OTP_ADR_LN_1_TXT = oTP_ADR_LN_1_TXT;
		}
		public String getOTP_ADR_LN_2_TXT() {
			return OTP_ADR_LN_2_TXT;
		}
		public void setOTP_ADR_LN_2_TXT(String oTP_ADR_LN_2_TXT) {
			OTP_ADR_LN_2_TXT = oTP_ADR_LN_2_TXT;
		}
		public String getOTP_ADR_LN_3_TXT() {
			return OTP_ADR_LN_3_TXT;
		}
		public void setOTP_ADR_LN_3_TXT(String oTP_ADR_LN_3_TXT) {
			OTP_ADR_LN_3_TXT = oTP_ADR_LN_3_TXT;
		}
		public String getOTP_ADR_LN_4_TXT() {
			return OTP_ADR_LN_4_TXT;
		}
		public void setOTP_ADR_LN_4_TXT(String oTP_ADR_LN_4_TXT) {
			OTP_ADR_LN_4_TXT = oTP_ADR_LN_4_TXT;
		}
		public String getOTP_ADR_LN_5_TXT() {
			return OTP_ADR_LN_5_TXT;
		}
		public void setOTP_ADR_LN_5_TXT(String oTP_ADR_LN_5_TXT) {
			OTP_ADR_LN_5_TXT = oTP_ADR_LN_5_TXT;
		}
		public String getOTP_ADR_LN_6_TXT() {
			return OTP_ADR_LN_6_TXT;
		}
		public void setOTP_ADR_LN_6_TXT(String oTP_ADR_LN_6_TXT) {
			OTP_ADR_LN_6_TXT = oTP_ADR_LN_6_TXT;
		}
		public String getOTP_ADR_LN_7_TXT() {
			return OTP_ADR_LN_7_TXT;
		}
		public void setOTP_ADR_LN_7_TXT(String oTP_ADR_LN_7_TXT) {
			OTP_ADR_LN_7_TXT = oTP_ADR_LN_7_TXT;
		}
		public String getOTP_PAYEE_NM() {
			return OTP_PAYEE_NM;
		}
		public void setOTP_PAYEE_NM(String oTP_PAYEE_NM) {
			OTP_PAYEE_NM = oTP_PAYEE_NM;
		}
		public String getDIAGNOSIS() {
			return DIAGNOSIS;
		}
		public void setDIAGNOSIS(String dIAGNOSIS) {
			DIAGNOSIS = dIAGNOSIS;
		}
		public String getDESC_OF_TREATMENT() {
			return DESC_OF_TREATMENT;
		}
		public void setDESC_OF_TREATMENT(String dESC_OF_TREATMENT) {
			DESC_OF_TREATMENT = dESC_OF_TREATMENT;
		}
		
		
	}*/
	
	@Override
	public SubmitClaimRequest getSubmitClaimRequest(SlingHttpServletRequest req) {
		SubmitClaimRequest request=null;
		try {
			StringBuffer jstring= new StringBuffer();
			BufferedReader reader =req.getReader();
			String line=null;
			
			while((line = reader.readLine()) != null) {
				jstring.append(line);
			}
			log.debug("request >> "+jstring.toString());
			
			GsonBuilder gb =new GsonBuilder();
			Gson gson = gb.serializeNulls().create();
			request = gson.fromJson(jstring.toString(), SubmitClaimRequest.class);
			
		}catch(Exception e) {
			log.error("Error While converting reqdata to object"+e);
		}
		
		return request;
	}
	
	
	public String getSubmitClaimAPIURL() {
		
		return config.getSubmitClaimAPIURL();
	}
	

}


