package com.expatportal.core.pojo;

public class SubmissionBankingDetail {
	/*
	 
	  "id": 0,
      "bankingPreferenceId": 0,
      "bankingPreferenceTypeId": 1501,
      "claimSubmissionId": 123,
      "createDate": "2019-08-02T10:26:25.878Z",
      "createId": "string",
     
	 */
	
	private int //id,
	bankingPreferenceTypeId,
	claimSubmissionId,
	bankingPreferenceId;
	
	private String createDate,
	createId;
	
	private SubmissionOnetimePaymentDetail submissionOnetimePaymentDetail;
	
	
	
	/*public int getId() {
		return id;
	}*/



	/*public void setId(int id) {
		this.id = id;
	}*/



	public int getBankingPreferenceTypeId() {
		return bankingPreferenceTypeId;
	}



	public void setBankingPreferenceTypeId(int bankingPreferenceTypeId) {
		this.bankingPreferenceTypeId = bankingPreferenceTypeId;
	}



	public int getClaimSubmissionId() {
		return claimSubmissionId;
	}



	public void setClaimSubmissionId(int claimSubmissionId) {
		this.claimSubmissionId = claimSubmissionId;
	}



	public int getBankingPreferenceId() {
		return bankingPreferenceId;
	}



	public void setBankingPreferenceId(int bankingPreferenceId) {
		this.bankingPreferenceId = bankingPreferenceId;
	}



	public String getCreateDate() {
		return createDate;
	}



	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}



	public String getCreateId() {
		return createId;
	}



	public void setCreateId(String createId) {
		this.createId = createId;
	}



	public SubmissionOnetimePaymentDetail getSubmissionOnetimePaymentDetail() {
		return submissionOnetimePaymentDetail;
	}



	public void setSubmissionOnetimePaymentDetail(SubmissionOnetimePaymentDetail submissionOnetimePaymentDetail) {
		this.submissionOnetimePaymentDetail = submissionOnetimePaymentDetail;
	}



	

}
