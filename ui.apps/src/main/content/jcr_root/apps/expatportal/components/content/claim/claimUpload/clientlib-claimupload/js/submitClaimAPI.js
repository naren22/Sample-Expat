function submitClaim(event){
    document.getElementById("system-error-note-loader").style.display = 'block';
	var targetHtml = $(event.target).html();
    if(targetHtml.indexOf('span') != -1){
			targetHtml = $(event.target).children().html();
    }
	tagPublishPostPageData(targetHtml,'trackNewClaimSubmitLinkClick');
     var formData = new FormData();
    //var memberId = 796; 
 	 var memberId = getMbrId();
    formData.append("mbrId",memberId);

     $.ajax({
        type: "POST",
     	//url: "/bin/file/submit.json",
        url: "/bin/file/zipAsset.json?mbrId="+memberId,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {

            }
            return myXhr;
        },
        success: function (data) {
         window.publishPostPageData ('trackClaimJourneyStep',{//9222

            "claims": { //Custom Link Tracking Fields    
                "claimStep": "step 4" //Claim journey step

            }});
            pageDataLayer.content.pageName = "submission failure";

        	if("no images" === data.result){///9222
                _satellite.track('trackClaimSubmitFailurePageLoad');
                 document.getElementById("system-error-note-loader").style.display = 'none';

                $("#file-missing-note").show();
        		
        	}else if(data.SubmissionResponse && data.submissionId){

			var submitResp = JSON.parse(data.SubmissionResponse);

                if(submitResp && submitResp.id){
               // _satellite.track('trackClaimSubmitSuccessPageLoad'); // Should be present already from Phase I
                // Global Pagedatalayer, which is already present from Phase I implementation  
    
                // Below publish post data function, for additional implementation 
                    var step1Json=JSON.parse(sessionStorage.getItem("step1_data"));
                    var otpMethod ="";

                   if(submitResp.submissionBankingDetails[0] && submitResp.submissionBankingDetails[0].submissionOnetimePaymentDetail
                      && submitResp.submissionBankingDetails[0].submissionOnetimePaymentDetail.paymentMethodCode)  { 
                      otpMethod = submitResp.submissionBankingDetails[0].submissionOnetimePaymentDetail.paymentMethodCode;
                   }
                window.publishPostPageData ('trackClaimSubmitDetails',{//9257
    
                    "claim": {
                        "claimId": submitResp.id, //need to capture claim submission ID (feasibility would be confirmed by the dev team )
                        "providerCountry": step1Json.providerCountry,// Name of the provider country            
                        "providerCity":$("#claim-info-file-preview .cityVal").text(), // Name of the provider city            
                        "billAmount": step1Json.billedAmount, //Claim amount  
                        "claimCurrency": step1Json.billedCurrency ? $("#checkCurrencyList-edit option[value='"+step1Json.billedCurrency+"']").data("currency"):"", //capture claim currency                         
                        "reimbursementMethod": otpMethod || defaultPrefernce, //capture type of reimbursement method selected on claim submission confirmation 
                        "serviceDate": getDateInDMY(step1Json.dateOfService) //capture claim service date                                                                 
                             }
                });

                //console.log("calling _satellite.track('trackClaimSubmitSuccessPageLoad')");
                // Satellite Function Call 
                    pageDataLayer.content.pageName = "submission confirmation";///9222 confirmation
                _satellite.track('trackClaimSubmitSuccessPageLoad'); // Note : This is already present in phase I implementation

                document.getElementById("system-error-note-loader").style.display = 'none';
				showSubmittedSuccess(data.submissionId);


                }else {
				_satellite.track('trackClaimSubmitFailurePageLoad');
                    document.getElementById("system-error-note-loader").style.display = 'none';
                    showTimeout();
           	 }
            }else {
				_satellite.track('trackClaimSubmitFailurePageLoad');
                document.getElementById("system-error-note-loader").style.display = 'none';
                showTimeout();
            }
            // your callback here
           // alert("Done Submitting");
        },
        error: function (error) {
             window.publishPostPageData ('trackClaimJourneyStep',{//222,failure scenerio

            "claims": { //Custom Link Tracking Fields    
                "claimStep": "step 4" //Claim journey step

            }});
            pageDataLayer.content.pageName = "submission failure";

            _satellite.track('trackClaimSubmitFailurePageLoad');

			document.getElementById("system-error-note-loader").style.display = 'none';
          //  document.getElementById("system-error-note").style.display = 'block';
            showTimeout();
/*
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
*/

        },
        async: true,
        data:getRequestData(),
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}

//date format setup in DMY format for GT 
function getDateInDMY(dString){

    var months ={
        "JAN":"01",
        "FEB":"02",
        "MAR":"03",
        "APR":"04",
        "MAY":"05",
        "JUN":"06",
        "JUL":"07",
        "AUG":"08",
        "SEP":"09",
        "OCT":"10",
        "NOV":"11",
        "DEC":"12"
    };

    var date=dString.split("-");
    date[1] = months[date[1].toUpperCase()];
	var formateddate=date.reverse();
    return formateddate.join("-");
}

//date format setup in MDY format for exela xml
function getDateInMDY(dString){
    var months ={
        "JAN":"01",
        "FEB":"02",
        "MAR":"03",
        "APR":"04",
        "MAY":"05",
        "JUN":"06",
        "JUL":"07",
        "AUG":"08",
        "SEP":"09",
        "OCT":"10",
        "NOV":"11",
        "DEC":"12"
    };
    var date=dString.split("-");
    date[1] = months[date[1].toUpperCase()];
	var formateddate=date[1] + "/" + date[0] + "/" + date[2];
    return formateddate;
}

function getDateInMDY(dString){

    var months ={
        "JAN":"01",
        "FEB":"02",
        "MAR":"03",
        "APR":"04",
        "MAY":"05",
        "JUN":"06",
        "JUL":"07",
        "AUG":"08",
        "SEP":"09",
        "OCT":"10",
        "NOV":"11",
        "DEC":"12"
    };

    var date=dString.split("-");
    date[1] = months[date[1].toUpperCase()];
	var formateddate=date[1] + "/" + date[0] + "/" + date[2];
    return formateddate;
}

function getCurrentDateISO(){

return new Date().toISOString().slice(0, 19);
}

//mapping API response to feilds in step1

function getRequestData(){

    //requesting data from API

	var requestJSON={"BANK_PAY_TYPE_ID":1,"UPLOAD_TYP_IND":2,"PAT_MBR_ID":1,"SBMTD_TYPE_ID":1,"SSP_SUBMISSION_ID":"sample string 3","PROV_ID":1,"DT_OF_SRVC":"21/11/2018","TOT_BLD_AMT":"10","CRNCY_CD":"sample string 6","SSP_CLM_NM":"sample string 7","SSP_NUM_CLMS":8,"PROV_NM":"sample string 9","PROV_ADR_CTY_NM":"sample string 10","PROV_ADR_CNTRY_NM":"sample string 11","OTP_CRNCY_CD":"sample string 12","OTP_CNTRY_CD":"sample string 13","OTP_PAY_METH_CD":"sample string 14","OTP_ORG_NM":"sample string 15","OTP_BNK_DTL_1_TXT":"sample string 16","OTP_BNK_DTL_2_TXT":"sample string 17","OTP_BNK_DTL_3_TXT":"sample string 18","OTP_BNK_DTL_4_TXT":"sample string 19","OTP_BNK_DTL_5_TXT":"sample string 20","OTP_ADR_LN_1_TXT":"sample string 21","OTP_ADR_LN_2_TXT":"sample string 22","OTP_ADR_LN_3_TXT":"sample string 23","OTP_ADR_LN_4_TXT":"sample string 24","OTP_ADR_LN_5_TXT":"sample string 25","OTP_ADR_LN_6_TXT":"sample string 26","OTP_ADR_LN_7_TXT":"sample string 27","OTP_PAYEE_NM":"sample string 28","DIAGNOSIS":"sample string 29","DESC_OF_TREATMENT":"sample string 30"};
	var step1Json=JSON.parse(sessionStorage.getItem("step1_data"));

    var crncy="";
    var OTP_CRNCY_CD ="";
    var cnty ="";
    var OTP_CNTRY_CD = "";
	var otpMethod="";
	var payeeName= "";
    var orgName="";

    var build_crncy= step1Json.billedCurrency ? $("#checkCurrencyList-edit option[value=\""+step1Json.billedCurrency+"\"]").data("currency"):"";

  var swift ="NA";
    var iban ="NA";
    if(otpMethodSelected === "eft"){
        otpMethod = "EFT";
        crncy=$('#eft-method .payee-currency-text').text().trim();
    	OTP_CRNCY_CD =crncy ? $("#checkCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";

    	cnty =$('#eft-method  .payee-country-text').text().trim();
    	OTP_CNTRY_CD =cnty ? $("#checkCountryList-edit option[value=\""+cnty+"\"]").data("code") : "";
        payeeName= $('#eft-method .payee-name-text').text();
    	orgName=$('#eft-method .payee-bank-text').text();
         swift = $('#SWIFT')?$('#SWIFT').val()||"NA": "NA";
        iban =  ($('#IBAN')?$('#IBAN').val() : "NA" )|| "NA";
    }else if(otpMethodSelected === "chk"){
        otpMethod = "CHK";
        crncy=$('#check-method .payee-currency-text').text().trim();
        OTP_CRNCY_CD =crncy ? $("#checkCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";

    	cnty =$('#check-method  .payee-country-text').text().trim();
        OTP_CNTRY_CD =cnty ? $("#checkCountryList-edit option[value=\""+cnty+"\"]").data("code") : "";
        payeeName= $('#check-method .payee-name-text').text();
       // orgName=$('#eft-method .payee-bank-text').text();
    }

	var BPTI=1501;
    if(otpMethod){
		BPTI=1502;
    }else{

if(defaultPrefernce == 'EFT'){
        crncy=$('#eft-method .payee-currency-text').text().trim();
    	OTP_CRNCY_CD =crncy ? $("#checkCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";

    	cnty =$('#eft-method  .payee-country-text').text().trim();
    	OTP_CNTRY_CD =cnty ? $("#checkCountryList-edit option[value=\""+cnty+"\"]").data("code") : "";
        payeeName= $('#eft-method .payee-name-text').text();
    	orgName=$('#eft-method .payee-bank-text').text();
        swift = $('#SWIFT-edit')?$('#SWIFT-edit').val()||"NA": "NA";
        iban =  ($('#IBAN-edit')?$('#IBAN-edit').val() : "NA" )|| "NA";
    }else if(defaultPrefernce == 'CHK'){
        otpMethod = "CHK";
        crncy=$('#check-method .payee-currency-text').text().trim();
        OTP_CRNCY_CD =crncy ? $("#checkCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";

    	cnty =$('#check-method  .payee-country-text').text().trim();
        OTP_CNTRY_CD =cnty ? $("#checkCountryList-edit option[value=\""+cnty+"\"]").data("code") : "";
        payeeName= $('#check-method .payee-name-text').text();

       // orgName=$('#eft-method .payee-bank-text').text();
    }
    }


    var info =step1Json.memberInfo.split(" ");
    var memberDob =info[info.length - 1];

    var memname= step1Json.memberInfo.replace(memberDob,"");

    var curdate =getCurrentDateISO();
    var tmpMemId=step1Json.memberName;

    if(otpMethod) { 
		tmpMemId = getMbrId();

    }



	var submitClaimAPIRequest ={

  "id": 0,
  "exelaSubmissionId": "AA0025733191260112344",
  "submissionDate": curdate,
  "uploadTypeId": 3,
  "submissionTypeId": 1551,
  "statusCode": "SA",
  "filmLocatorNumber1": "",
  "altId": altMemId,
  "patientMemberId": step1Json.memberName,
  "patientName": memname,
  "patientDateOfBirth": getDateInMDY(memberDob),
  "patientCountryCode": "NA",
  "providerId": null,
  "providerName": step1Json.providerName,
  "providerCountryName":  step1Json.providerCountry,
  "providerCountryCode":  $("#checkCountryList-edit option[value=\""+step1Json.providerCountry+"\"]").data("code")||"NA",
  "ProviderCityName": $("#claim-info-file-preview .cityVal").text(),
  "dateOfService":  getDateInMDY(step1Json.dateOfService),
  "diagnosis": step1Json.diagnosisText,
  "methodOfTreatment": step1Json.treatmentDescription,
  "billedAmount": step1Json.billedAmount,
  "billedCurrencyCode": build_crncy,
  "nickname": step1Json.claimNickName,
  "numberOfClaimsInSubmission": 1,
  "lastUpdatedId": getMbrId(),
  "lastUpdatedDate": curdate,
  "submissionBankingDetails": [
    {
      "id": 0,
      "bankingPreferenceId": bankPreferenceId,
      "bankingPreferenceTypeId": BPTI,
      "claimSubmissionId": 123,
      "createDate": curdate,
      "createId": getMbrId(),
      "submissionOnetimePaymentDetail": {
        "id": 0,
        "memberId": tmpMemId,
        "providerId": null,
        "currencyCode": OTP_CRNCY_CD,
        "countryCode": OTP_CNTRY_CD ||"",
        "paymentMethodCode": otpMethod || defaultPrefernce,
        "bankingPreferenceTypeId": BPTI,
        "submissionTypeId": 1551,
        "bankName": orgName||"",
        "addressLine1": "",
        "addressLine2": "",
        "addressLine3": "",
        "addressLine4": "",
        "addressLine5": "",
        "addressLine6": "",
        "addressLine7": "",
        "payeeName": payeeName||"NA",
        "bankingDetail1": "",
        "bankingDetail2": "",
        "bankingDetail3": "",
        "bankingDetail4": "",
        "bankingDetail5": "",
        "bankingDetail6": "",
        "bankingDetail7": "",
        "bankingDetail8": "",
        "bankingDetail9": "",
        "bankingDetail10": "",
        "bankingDetail11": "",
        "bankingDetail12": "",
        "bankingDetail13": "",
        "bankingDetail14": "",
        "bankingDetail15": "",
        "isActive": true,
        "createId": getMbrId(),//same as last update
        "createDate": curdate,
        "lastUpdateId": getMbrId(),
          "swfitCode":swift,
          "iban":iban, 
        "lastUpdateDate": curdate,
      }
    }
  ]
};

 /*   var submitClaimAPIRequestold = {
  //"PAT_MBR_ID": getMbrId(),
  "PAT_MBR_ID": step1Json.memberName,
  "PROV_NM": step1Json.providerName,
  "PROV_ADR_CNTRY_NM": step1Json.providerCountry,
  "PROV_ADR_CTY_NM": step1Json.providerCity,
  "SSP_CLM_NM": step1Json.claimNickName,
  "TOT_BLD_AMT": step1Json.billedAmount,
  "CRNCY_CD": build_crncy,
  "DT_OF_SRVC":  getDateInDMY(step1Json.dateOfService),
  "DIAGNOSIS":  step1Json.diagnosisText,
  "DESC_OF_TREATMENT": step1Json.treatmentDescription,
  "IS_DFLT_BNK_DTL":0,
  "SBMTD_TYPE_ID": 1551,
  "SSP_NUM_CLMS": 1,
  "UPLOAD_TYP_IND": 1,
  "SSP_SUBMISSION_ID": "AA0025733191770101201",
  "BANK_PAY_TYPE_ID": BPTI,

  "OTP_PAY_METH_CD": otpMethod || defaultPrefernce,
  "OTP_CRNCY_CD": OTP_CRNCY_CD,
  "OTP_CNTRY_CD": OTP_CNTRY_CD ||"",
  "OTP_ORG_NM":orgName||"",
  "OTP_PAYEE_NM":payeeName||"",

  "OTP_BNK_DTL_1_TXT": "",
  "OTP_BNK_DTL_2_TXT": "",
  "OTP_BNK_DTL_3_TXT": "",
  "OTP_BNK_DTL_4_TXT": "",
  "OTP_BNK_DTL_5_TXT": "",
  "OTP_BNK_DTL_6_TXT": "",
  "OTP_BNK_DTL_7_TXT": "",
  "OTP_BNK_DTL_8_TXT": "",
  "OTP_BNK_DTL_9_TXT": "",
  "OTP_BNK_DTL_10_TXT": "",
  "OTP_BNK_DTL_11_TXT":"",
  "OTP_BNK_DTL_12_TXT":"",
  "OTP_BNK_DTL_13_TXT":"",
  "OTP_BNK_DTL_14_TXT": "",
  "OTP_BNK_DTL_15_TXT": "",

        "OTP_ADR_LN_1_TXT":eftSelected ? $('#eft-method .valAddress1').text():"",
        "OTP_ADR_LN_2_TXT":eftSelected ? $('#eft-method .valAddress2').text():"",
        "OTP_ADR_LN_3_TXT":eftSelected ? $('#eft-method .valAddress3').text():"",
        "OTP_ADR_LN_4_TXT":eftSelected ? $('#eft-method .valAddress4').text():"",
        "OTP_ADR_LN_5_TXT":eftSelected ? $('#eft-method .valAddress5').text():"",
        "OTP_ADR_LN_6_TXT":eftSelected ? $('#eft-method .valAddress6').text():"",
        "OTP_ADR_LN_7_TXT":eftSelected ? $('#eft-method .valAddress7').text():""

};*/



		submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine1 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress1:not(:hidden)').text():"";
    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine2 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT') ? $('#eft-method .valAddress2:not(:hidden)').text():"";

    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine3 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress3:not(:hidden)').text():"";

    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine4 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress4:not(:hidden)').text():"";

    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine5 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress5:not(:hidden)').text():"";

    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine6 = otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress6:not(:hidden)').text():"";

    	submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail.addressLine7 = otpMethod == "EFT" || ( BPTI==1501 && defaultPrefernce == 'EFT')? $('#eft-method .valAddress7:not(:hidden)').text():"";



    var DynamicRowsData = $("#dynamic-fields input[type=text].form-control");

    if(DynamicRowsData){
        for(i=0; i<DynamicRowsData.length ; i++){

        	 submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail["bankingDetail"+(i+1)] =  otpMethod == "EFT" ||  ( BPTI==1501 && defaultPrefernce == 'EFT')? DynamicRowsData[i].value : "";
   		 }
      }

      if(BPTI==1501){
      // delete submitClaimAPIRequest.submissionBankingDetails[0].submissionOnetimePaymentDetail;
      }

    return JSON.stringify(submitClaimAPIRequest);


}


