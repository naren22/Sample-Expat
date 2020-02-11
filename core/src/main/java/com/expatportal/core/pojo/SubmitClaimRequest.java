package com.expatportal.core.pojo;

import java.util.List;

public class SubmitClaimRequest {
	
	private int id,
	uploadTypeId,
	submissionTypeId,
	patientMemberId,
	
	numberOfClaimsInSubmission;
	
	

	private String altId;
	
	public String getAltId() {
		return altId;
	}
	public void setAltId(String altId) {
		this.altId = altId;
	}
	
	private Double billedAmount;
	
	private String exelaSubmissionId,
	statusCode,
	filmLocatorNumber1,
	patientName,
	patientDateOfBirth,
	patientCountryCode,
	providerName,
	providerCountryName,
	providerCountryCode,
	dateOfService,
	diagnosis,
	
	methodOfTreatment,
	billedCurrencyCode,
	nickname,
	lastUpdatedId,
	lastUpdatedDate,
	submissionDate,
	providerId,
	ProviderCityName;
	
	public String getProviderCountryCode() {
		return providerCountryCode;
	}
	public void setProviderCountryCode(String providerCountryCode) {
		this.providerCountryCode = providerCountryCode;
	}
	public String getPatientCountryCode() {
		return patientCountryCode;
	}
	public void setPatientCountryCode(String patientCountryCode) {
		this.patientCountryCode = patientCountryCode;
	}

	private List<SubmissionBankingDetail> submissionBankingDetails;
	
	public String getProviderCityName() {
		return ProviderCityName;
	}
	public void setProviderCityName(String providerCityName) {
		ProviderCityName = providerCityName;
	}
	public String getProviderId() {
		return providerId;
	}
	public void setProviderId(String providerId) {
		this.providerId = providerId;
	}
	
	
	public List<SubmissionBankingDetail> getSubmissionBankingDetails() {
		return submissionBankingDetails;
	}
	public void setSubmissionBankingDetails(List<SubmissionBankingDetail> submissionBankingDetails) {
		this.submissionBankingDetails = submissionBankingDetails;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUploadTypeId() {
		return uploadTypeId;
	}
	public void setUploadTypeId(int uploadTypeId) {
		this.uploadTypeId = uploadTypeId;
	}
	public int getSubmissionTypeId() {
		return submissionTypeId;
	}
	public void setSubmissionTypeId(int submissionTypeId) {
		this.submissionTypeId = submissionTypeId;
	}
	public int getPatientMemberId() {
		return patientMemberId;
	}
	public void setPatientMemberId(int patientMemberId) {
		this.patientMemberId = patientMemberId;
	}
	public int getNumberOfClaimsInSubmission() {
		return numberOfClaimsInSubmission;
	}
	public void setNumberOfClaimsInSubmission(int numberOfClaimsInSubmission) {
		this.numberOfClaimsInSubmission = numberOfClaimsInSubmission;
	}
	public Double getBilledAmount() {
		return billedAmount;
	}
	public void setBilledAmount(Double billedAmount) {
		this.billedAmount = billedAmount;
	}
	public String getExelaSubmissionId() {
		return exelaSubmissionId;
	}
	public void setExelaSubmissionId(String exelaSubmissionId) {
		this.exelaSubmissionId = exelaSubmissionId;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public String getFilmLocatorNumber1() {
		return filmLocatorNumber1;
	}
	public void setFilmLocatorNumber1(String filmLocatorNumber1) {
		this.filmLocatorNumber1 = filmLocatorNumber1;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPatientDateOfBirth() {
		return patientDateOfBirth;
	}
	public void setPatientDateOfBirth(String patientDateOfBirth) {
		this.patientDateOfBirth = patientDateOfBirth;
	}
	public String getProviderName() {
		return providerName;
	}
	public void setProviderName(String providerName) {
		this.providerName = providerName!=null ? providerName.trim() : providerName;
	}
	public String getProviderCountryName() {
		return providerCountryName;
	}
	public void setProviderCountryName(String providerCountryName) {
		this.providerCountryName =  providerCountryName!=null ? providerCountryName.trim() : providerCountryName;
	}
	public String getDateOfService() {
		return dateOfService;
	}
	public void setDateOfService(String dateOfService) {
		this.dateOfService = dateOfService;
	}
	public String getDiagnosis() {
		return diagnosis;
	}
	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}
	public String getMethodOfTreatment() {
		return methodOfTreatment;
	}
	public void setMethodOfTreatment(String methodOfTreatment) {
		this.methodOfTreatment = methodOfTreatment;
	}
	public String getBilledCurrencyCode() {
		return billedCurrencyCode;
	}
	public void setBilledCurrencyCode(String billedCurrencyCode) {
		this.billedCurrencyCode = billedCurrencyCode;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getLastUpdatedId() {
		return lastUpdatedId;
	}
	public void setLastUpdatedId(String lastUpdatedId) {
		this.lastUpdatedId = lastUpdatedId;
	}
	public String getLastUpdatedDate() {
		return lastUpdatedDate;
	}
	public void setLastUpdatedDate(String lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}
	public String getSubmissionDate() {
		return submissionDate;
	}
	public void setSubmissionDate(String submissionDate) {
		this.submissionDate = submissionDate;
	}
	

	

	
	
}


/*
 
 {
  
  "submissionBankingDetails": [
    {
      "id": 0,
      "bankingPreferenceId": 0,
      "bankingPreferenceTypeId": 1501,
      "claimSubmissionId": 123,
      "createDate": "2019-08-02T10:26:25.878Z",
      "createId": "string",
      "submissionOnetimePaymentDetail": {
        "id": 0,
        "memberId": 8408,
        "providerId": null,
        "currencyCode": "USD",
        "countryCode": "IN",
        "paymentMethodCode": "EFT",
        "bankingPreferenceTypeId": 1502,
        "submissionTypeId": 1551,
        "bankName": "string",
        "addressLine1": "string",
        "addressLine2": "string",
        "addressLine3": "string",
        "addressLine4": "string",
        "addressLine5": "string",
        "addressLine6": "string",
        "addressLine7": "string",
        "payeeName": "string",
        "bankingDetail1": "string",
        "bankingDetail2": "string",
        "bankingDetail3": "string",
        "bankingDetail4": "string",
        "bankingDetail5": "string",
        "bankingDetail6": "string",
        "bankingDetail7": "string",
        "bankingDetail8": "string",
        "bankingDetail9": "string",
        "bankingDetail10": "string",
        "bankingDetail11": "string",
        "bankingDetail12": "string",
        "bankingDetail13": "string",
        "bankingDetail14": "string",
        "bankingDetail15": "string",
        "isActive": true,
        "createId": "string",
        "createDate": "2019-08-02T10:26:25.878Z",
        "lastUpdateId": "string",
        "lastUpdateDate": "2019-08-02T10:26:25.878Z"
      }
    }
  ]
}

 */