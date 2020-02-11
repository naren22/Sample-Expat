var countryList = [];
var countryResponse = [];
var currencyResponse = [];
var currencyList = [];
var currencyCodes = [];
var globalJsonResp;
var submitClaimUrl;
var globalPayeeName;
var emailId = '';
var updateDB = false;
var memId ;

var inputEvent = document.createEvent('Event');
inputEvent.initEvent('input', true, true);

var settings = {
		"async": true,
		cache:false,
		"crossDomain": true,
		"url": "",
		"method": "GET",
		"headers": {
			"Content-Type": "application/json",
			"cache-control": "no-cache"
		},
		"processData": false
};
function getPaymentPreferences(){
	var memberId = getMbrId();
    //settings.url = $('#paymentPreferencesServiceURL').val();
	settings.url ="/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.paymentpreference.json"+ "?memberId=" + memberId;

	$.ajax(settings).done(function(response) {
		if (response && response.preferences && response.preferences.length > 0) {
			var preferences = response.preferences[0];
			if(typeof globalJsonResp == 'undefined'){
				globalJsonResp = preferences;
               // sessionStorage.setItem("memberData", preferences);
			}
			getPayeeName();			
			sessionStorage.setItem('emailAddress', preferences.PRI_EMAIL_ADR_TXT);
			if(preferences.CNTRYDefIndicator != 'undefined' && preferences.CNTRYDefIndicator != 'null' && preferences.CNTRYDefIndicator == 'Yes'){				
				$('.no-preference-block').show();
				$('.viewpreference').hide();
			}else if(preferences.CNTRYDefIndicator == 'undefined' || preferences.CNTRYDefIndicator == 'null'){
				$('.no-preference-block').show();
				$('.viewpreference').hide();
			}
            if(typeof preferences.CNTRYDefIndicator != 'undefined'){
				sessionStorage.setItem('CNTRYDefIndicator', preferences.CNTRYDefIndicator);
            }

			if(preferences.PRI_EMAIL_ADR_TXT == 'undefined' || preferences.PRI_EMAIL_ADR_TXT == 'null' && (typeof emailId == 'undefined' || emailId == '')){
				emailId= preferences.PRI_EMAIL_ADR_TXT;
			}
			//populateEditData(preferences);			
		} else if(response && response.preferences && response.preferences.length == 0){
			$('.no-preference-block').show();
			$('.viewpreference').hide();
			getPayeeName();		
		}
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
       $('.no-preference-block').show();
	   $('.viewpreference').hide();
	});
}

function getPaymentDefaultPref(){
	var memberId = getMbrId();
    //settings.url = $('#paymentPreferencesServiceURL').val();
	settings.url ="/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.paymentpreference.json"+ "?memberId=" + memberId;

	$.ajax(settings).done(function(response) {
		if (response && response.preferences) {           
			globalJsonResp = response.preferences[0];
		} 
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}

function getCountries(){
	//settings.url = $('#claimCountryURL').val();
	settings.url = '/content/expatportal/claims/submitnewclaims/_jcr_content/par/submitclaimsform.claimService.countries.json';
	var countriesList, currencyList;
	$.ajax(settings).done(function(response) {
		if (response && response.countries && response.countries.length > 0) {
			var countriesData = response.countries;
			//sorting countries 
			countriesData.sort(function(a, b){
				var country1=a.name.toLowerCase(), country2=b.name.toLowerCase()
				if (country1 < country2) 
					return -1 
					if (country1 > country2)
						return 1
						return 0
			});
			countryResponse = countriesData;
			$("#country").empty();
			$("#checkCountryList, #eftCountryList").empty();
			for (var i = 0; i < countriesData.length; i++) {
                $("#country").append(

						"<option value=\"" +
                 countriesData[i].name + "\" data-currency='" + countriesData[i].currencyCode + "' data-country='" + countriesData[i].code + "'/>");


				$(" #eftCountryList, #checkCountryList").append(
						"<option value=\"" +
						countriesData[i].name + "\" data-code='" + countriesData[i].code + "' data-currency='" + countriesData[i].currencyCode + "' />");
				countryList[i] = countriesData[i].name;

			}
		} else {
			console.log('response success zero result ' + response.length);
		}
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}

function getCurrencies(){
    //settings.url = $('#claimCurrencyURL').val();
	settings.url = '/content/expatportal/claims/submitnewclaims/_jcr_content/par/submitclaimsform.claimService.currencies.json';
	$.ajax(settings).done(function(response) {
		if (response && response.currencies && response.currencies.length > 0) {
			var currenciesData = response.currencies;
			currenciesData.sort(function(a, b){
				var currency1=a.name.toLowerCase(), currency2=b.name.toLowerCase()
				if (currency1 < currency2) //sort string ascending
					return -1 
					if (currency1 > currency2)
						return 1
						return 0
			});
			currencyResponse = currenciesData;
			$("#currency").empty();
			$("#checkCurrencyList, #eftCurrencyList").empty();
			for (var i = 0; i < currenciesData.length; i++) {
				$("#currency").append(
						"<option value='" +
						currenciesData[i].name + "' data-currency='" + currenciesData[i].code + "' />");
				$("#checkCurrencyList, #eftCurrencyList, #eftCurrencyList, #checkCurrencyList").append(
						"<option value='" +
						currenciesData[i].name + "' data-currency='" + currenciesData[i].code + "' />");
				currencyList[i] = currenciesData[i].name;
				currencyCodes[i] = currenciesData[i].code;
			}
		} else {
			console.log('response success zero result ' + response.length);
		}
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}

function getPayeeName(){

	var memberId = getMbrId();
    //settings.url = $('#claimMemberServiceURL').val();
	settings.url = "/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.members.json?memberId=" + memberId;
	$.ajax(settings).done(function(response) {
		if (response && response.members && response.members.length > 0) {
			var membersData = response.members;

			if(membersData.length > 0){					
				globalPayeeName = membersData[0].FirstName + " " + membersData[0].LastName;
				$('.profile-name h1, #eftPayeeName, #checkPayeeName').text(globalPayeeName);
				//populateEditData(null);					
			}
		} else {
			console.log('response success zero result ' + response.length);
		}			
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}

function getPayeeInfo(){
	var memberId = getMbrId();
    //settings.url = $('#claimMemberServiceURL').val();
	settings.url = "/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.members.json?memberId=" + memberId;
    var cntryDefIndicator = sessionStorage.getItem('CNTRYDefIndicator');
	$.ajax(settings).done(function(response) {
		if (response && response.members && response.members.length > 0) {
			var membersData = response.members;
            
            if(membersData.length == 1){

                var dependentCodesArray = ["01","02","09","15","17","19","20","21","23","36","38","53","60"];
                if($.inArray(membersData[0].REL_TYP_CD, dependentCodesArray) != -1 && cntryDefIndicator != 'No'){
                    $('.dependentNoPref').show();
                    $('.editPreference').hide();
                    $('.no-preference-block').hide();
                }
            }
		} else {
			console.log('response success zero result ' + response.length);
		}			
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}





/*function populateEditData(jsonResp){
	if(jsonResp){
		globalJsonResp = jsonResp;
	}
	var payeeName = globalJsonResp != null ?globalJsonResp.PAYEE_NM : '';

	if(payeeName != undefined && payeeName.length > 0){
		$("#checkPayeeName").val(payeeName);
		$("#eftPayeeName").val(payeeName);
	} else {
		$("#checkPayeeName").val(globalPayeeName);
		$("#eftPayeeName").val(globalPayeeName);		
	}
}*/


function showNoPrefLandingBlock(){

	cancelNoPref();

	$('.no-preference-block').show();
	$('.no-pref-container').hide();
}


function showAddPreferenceOptions(){
	$('.no-preference-block').hide();
	if($('#dynamic-fields .row').length  > 0){
		cancelNoPref();
	}
	$('.no-pref-container').show();

	if($("#eftPayeeName").val() == ''){
		var payeeName = globalJsonResp != null ?globalJsonResp.PAYEE_NM : '';

		if(globalPayeeName != undefined && globalPayeeName.length > 0) {
			$("#checkPayeeName").val(globalPayeeName);
			$("#eftPayeeName").val(globalPayeeName);		
		} else if(payeeName != undefined && payeeName.length > 0){
			$("#checkPayeeName").val(payeeName);
			$("#eftPayeeName").val(payeeName);
		} 
	}
}

function displayNoPreferenceBlock() {
	getPaymentPreferences();
}

function openNoPrefPayeeNote() {
    $('.noPrefPayeeNote').css('display','block');
}

function closeNoPrefPayeeNote() {
     $('.noPrefPayeeNote').css('display','none');
}



//Save functionality
//Save functionality validation checker
function saveNoPrefInfo() {
	formErrors = [];
	var check='Check';
	var eft = 'EFT';


	// verify submit
	if (checkSelected) {
		document.getElementById('method-check-req-msg').style.display = "none";
		payeeNameCheckChecker(); /// recheck fields before to submit
		countryCheckChecker();
		countryCheckListChecker();
		currencyCheckChecker();
		currencyCheckListChecker();
	} else if (eftSelected) {
		document.getElementById('method-check-req-msg').style.display = "none";
		payeeNameEftChecker(); /// recheck fields before to submit
		countryEftChecker();
		countryEftListChecker();
		currencyEftChecker();
		currencyEftListChecker();
		bankNameEftChecker();
		dynamicFields.bankDetails.forEach(function (data) { /// recheck the dynamic banking fields before submiting 
			dynamicBankingFieldRequiredValidation(data);
		});

		for (var index in dynamicFields.bankDetails) { /// check if all required fields in dynamic banking details have a value
			if (dynamicFields.bankDetails[index].fieldRequiredError) {
				dynamicBankingFieldsReq = true;
				break;
			} else {
				dynamicBankingFieldsReq = false;
			}
		}
		for (var index in dynamicFields.bankDetails) { /// check if all required fields in dynamic banking details have a value
			if (dynamicFields.bankDetails[index].fieldCharacterError) {
				dynamicBankingFieldsChar = true;
				break;
			} else {
				dynamicBankingFieldsChar = false;
			}
		}
	} else {
		document.getElementById('method-check-req-msg').style.display = "block"; /// display error messege if no method selected
	}
	if (checkSelected && !payeeNameCheckError && !countryCheckError && !countryCheckValidError && !
			currencyCheckError && !currencyCheckValidError) { // if check method no error messeges exist in order ro submit
		removeAllMessages(); // if success remove all existing messeges
		saveNoPrefDefault();

	}

	if (eftSelected && !payeeNameEftError && !countryEftError && !countryEftValidError && !currencyEftError && !
			currencyEftValidError && !bankNameEftError && !dynamicBankingFieldsReq & !dynamicBankingFieldsChar) { // if eft method no error messeges exist in order ro submit
		removeAllMessages(); // if success remove all existing messeges
		saveNoPrefDefault();           
	}

	$("html, body").animate({
		scrollTop : 0
	}, "fast");


}


//Save functionality getting json info

function saveNoPrefDefault(){
	var cntryDef="";
	var cntryCodeDef="";
	var payeeNameDef="";
	var crncyCodeDef="";
	var crncyDef="";
	var prefDescDef="";
	var dynamicBankingFieldsReq=false;

	var dynamicBankingFieldsChar=false;
	var prefMethodDef = "eft";
	
	if (eftSelected) {
		payeeNameEftChecker(); /// recheck fields before to submit
		countryEftChecker();
		countryEftListChecker();
		currencyEftChecker();
		currencyEftListChecker();
		bankNameEftChecker();		
		payeeNameDef=$("#eftPayeeName").val();
		cntryDef= $("#eftCountry").val();
		/*if(cntryDef){
			var cntryTemp = $("#checkCountryList option[value='"+cntryDef+"']")[0];
			cntryCodeDef = $(cntryTemp).data("code");
		}*/
		cntryCodeDef=cntryDef?$("#eftCountryList option[value=\""+cntryDef+"\"]").data("code"):"";
		crncyDef=$("#eftCurrency").val();

		crncyCodeDef=crncyDef?$("#eftCurrencyList option[value='"+crncyDef+"']").data("currency"):"";		
		prefDescDef="Electronic Fund Transfer";

	}else if (checkSelected) {
		payeeNameCheckChecker(); /// recheck fields before to submit
		countryCheckChecker();
		countryCheckListChecker();
		currencyCheckChecker();
		currencyCheckListChecker();

		payeeNameDef=$("#checkPayeeName").val();
		cntryDef= $("#checkCountry").val();

		cntryCodeDef=cntryDef?$("#checkCountryList option[value=\""+cntryDef+"\"]").data("code"):"";
		
		crncyDef=$("#checkCurrency").val();
		
        crncyCodeDef=crncyDef?$("#checkCurrencyList option[value='"+crncyDef+"']").data("currency"):"";

		prefDescDef="Check";
		prefMethodDef = "chk";
	}else{
		payeeNameEftChecker(); /// recheck fields before to submit
		countryEftChecker();
		countryEftListChecker();
		currencyEftChecker();
		currencyEftListChecker();
		bankNameEftChecker();
		document.getElementById('method-check-req-msg').style.display = "block";
		return false;
	}
	cntryDef = encodeURIComponent(cntryDef);
	var bnkDetailId = -1;

	var bnkMbrId = getMbrId();

	var emailAddress = sessionStorage.getItem('emailAddress') ? sessionStorage.getItem('emailAddress') : '';

	if(typeof globalJsonResp == 'undefined'){
		getPaymentDefaultPref();
	}


	if(emailId != '' && emailAddress == '' ){
		emailAddress = emailId;
	}

	if(typeof globalJsonResp != 'undefined' && globalJsonResp.BNK_DTL_ID != 'undefined' ){
		bnkDetailId = globalJsonResp.BNK_DTL_ID;
	}

	if(typeof globalJsonResp != 'undefined' && globalJsonResp.MBR_ID != 'undefined' ){
		bnkMbrId = globalJsonResp.MBR_ID;
	}
	
	var preferncceData1={
			"BNK_DTL_ID": bnkDetailId,
			"MBR_ID": bnkMbrId,
			"BNK_DTL_1_TXT": "",
			"BNK_DTL_2_TXT": "",
			"BNK_DTL_3_TXT": "",
			"BNK_DTL_4_TXT": "",
			"BNK_DTL_5_TXT": "",
			"BNK_DTL_6_TXT": "",
			"BNK_DTL_7_TXT": "",
			"BNK_DTL_8_TXT": "",
			"BNK_DTL_9_TXT": "",
			"BNK_DTL_10_TXT": "",
			"BNK_DTL_11_TXT": "",
			"BNK_DTL_12_TXT": "",
			"BNK_DTL_13_TXT": "",
			"BNK_DTL_14_TXT": "",
			"BNK_DTL_15_TXT": "",
			"ORG_NM": "",
			"CRNCY_CD": crncyCodeDef||"",
			"CNTRY_CD": cntryCodeDef||"",
			"CNTRY_NM": cntryDef||"",
			"CRNCY_NM": crncyDef||"",
			//"BNK_EFF_DT": "2017-04-21T00:00:00",
			//"BNK_END_DT": "9999-12-31T00:00:00",
			"ADR_LN_1_TXT": "",
			"ADR_LN_2_TXT": "",
			"ADR_LN_3_TXT": "",
			"ADR_LN_4_TXT": "",
			"ADR_LN_5_TXT": "",
			"ADR_LN_6_TXT": "",
			"ADR_LN_7_TXT": "",
			"ACTV_IND": "1",
			"CRE_ID": bnkMbrId,
			"LST_UPDT_ID": bnkMbrId,
			"CRE_DT": "2017-05-11T14:12:39.267",
			//"LST_UPDT_DT": "2017-05-11T14:12:39.267",
			"PAY_METH_CD": prefMethodDef.toUpperCase()||"",
			"BNK_PMNT_TYP": "",
			"PAY_METH_DESC": prefDescDef||"",
			"ATR_DESC_1": "",
			"ATR_DESC_2": "",
			"ATR_DESC_3": "",
			"ATR_DESC_4": "",
			"ATR_DESC_5": "",
			"ATR_DESC_6": "",
			"ATR_DESC_7": "",
			"ATR_DESC_8": "",
			"ATR_DESC_9": "",
			"ATR_DESC_10": "",
			"ATR_DESC_11": "",
			"ATR_DESC_12": "",
			"ATR_DESC_13": "",
			"ATR_DESC_14": "",
			"ATR_DESC_15": "",
			"RPT_CNTRY_CD": cntryCodeDef||"",
			"PAYEE_NM": payeeNameDef || "",
			"PRI_EMAIL_ADR_TXT": emailAddress,
			"CNTRYDefIndicator": "No",
			"SRC_CD": "EXPTGG",
			"RPT_PAYEE_NM": payeeNameDef || "",
			"IS_DFLT_PAYEE_NM": 0
	};

	if(eftSelected){
		//setting Dynamic filed values
		var dynamicFieldData=$("#dynamic-fields input[type=text].form-control");

		if(countryBankPreference1.length > 0){            
			$.each(dynamicFieldData, function(index){
				var valueIndex=index+1;            		
				var indexVal = countryBankPreference1[index].attributeLineNumber;
				preferncceData1["BNK_DTL_"+indexVal+"_TXT"]=$(this).val();
				preferncceData1["ATR_DESC_"+indexVal]=$(this).attr("aria-labelledby");

			});
		}


		preferncceData1.ORG_NM=$("#bankName").val();			
		preferncceData1.ADR_LN_1_TXT=$("#bankAddress1").val();
		preferncceData1.ADR_LN_2_TXT=$("#bankAddress2").val();
		preferncceData1.ADR_LN_3_TXT=$("#bankAddress3").val();
		preferncceData1.ADR_LN_4_TXT=$("#bankAddress4").val();
	}

	if(bnkDetailId == -1){
		editNoPreference(JSON.stringify(preferncceData1) , "nopref");
	} else{
		editNoPreference(JSON.stringify(preferncceData1) , null);
	}
	eftSelected = false;
	checkSelected = false;
}


//Save the data.

function editNoPreference(requestData, type){
	var ajaxUrl = "";
	if(type == "nopref"){
		ajaxUrl = "/bin/prefrence/modify.nopref.json";
	} else {
		ajaxUrl = "/bin/prefrence/modify.edit.json";
	}


	$.ajax({
		type: "POST",
		url: ajaxUrl,
		xhr: function () {
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) {

			}
			return myXhr;
		},
		success: function (data) {
			sessionStorage.setItem('CNTRYDefIndicator', "No" );	
			if(typeof submitClaimUrl != 'undefined' ){	
			}
            console.log(ieBrowser);
            if(ieBrowser){
				window.location.href = location.href;
            }else{
				window.location.reload(true); 
            }
		},
		error: function (error) {
            $("#system-error-note-loader").hide();
			document.getElementById("system-error-note-nopref").style.display = 'block';

		},
		async: true,
		data: requestData,
		cache: false,
		contentType: false,      
		processData: false,
		timeout: 60000
	});


}




function cancelNoPref() {    	
	removeAllMessages(); // if cancel remove all existing messeges and redirect to specific page

	$('.no-pref-container input').val('');

	$('#bnkNme').attr('hidden','hidden');
	$('#dynamic-fields').empty();
	//$('#dynamic-fields').html("");
	$('#bnkAdd1').attr('hidden','hidden');
	$('#bnkAdd2').attr('hidden','hidden');
	$('#bnkAdd3').attr('hidden','hidden');
	$('#bnkAdd4').attr('hidden','hidden');

	if(eftSelected || checkSelected){
		document.getElementById('otp-eft-method').style.display = "block";
		document.getElementById('otp-check-method').style.display = "none";
		document.getElementById("eftTxt").style.color = "black";
		document.getElementById("checkTxt").style.color = "black";
		$('.eft-selector').css("background-color", "white");
		$('.check-selector').css("background-color", "white"); 						 
	} 
	eftSelected = false;
	checkSelected = false;   

}




$("#eftCurrency").on("change",function(inputEvent){
	var cnty=$(this).val();
	var oldval=$("#checkCurrency").val();
	if((cnty !="") && (oldval !== cnty)){

		$("#checkCurrency").val(cnty);
		$("#checkCurrency")[0].dispatchEvent(inputEvent);
		var cntryCode = $("#eftCountryList option[value=\""+$("#eftCountry").val()+"\"]").data("code");
		var crnCode = $("#eftCurrencyList option[value='"+cnty+"']").data("currency");
        getBankDetailsByCountryCode(cntryCode ,null,crnCode);
		$("#bankName").val("");
		$("#bankAddress1").val("");
		$("#bankAddress2").val("");
		$("#bankAddress3").val("");
		$("#bankAddress4").val("");
	}});


$("#checkCurrency").on("change",function(){
	var cnty=$(this).val();
	var oldval=$("#eftCurrency").val();
	if(oldval !== cnty){
		$("#eftCurrency").val(cnty);
		$("#eftCurrency")[0].dispatchEvent(inputEvent);
		$("#eftCurrency").trigger("change");
	}
});




function getBankDetailsByCountryCode (countryCode , values, currencyCode) {
	var settings = {
			"async": true,
			"crossDomain": true,
			"url": "",
			"method": "GET",
			"headers": {
				"Content-Type": "application/json",
				"cache-control": "no-cache",
			},
			"processData": false
	};
	settings.url = "/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.getPaymentInfoByCountry.json" + "?countryCode=" + countryCode+"&currencyCode="+currencyCode;
	$.ajax(settings).done(function(response) {
		if (response && response.getPaymentInfoByCountry && response.getPaymentInfoByCountry.length > 0) {


			console.log('response success ' + response.getPaymentInfoByCountry.length);
			countryBankPreference = response.getPaymentInfoByCountry;
			dynamicFields.bankDetails = [];
			for(var i=0 ; i<response.getPaymentInfoByCountry.length ; i++){
				var paymentInfo = response.getPaymentInfoByCountry[i];
				var bankObj = {
						label: paymentInfo.atrributeDescription,
						attributeType: paymentInfo.attributeType,
						regex: paymentInfo.expression,
						errorMessage:paymentInfo.expressionMessage,
						minLength: paymentInfo.minLength,
						maxLength: paymentInfo.maxLength,
						isReq: paymentInfo.isRequired,
						fieldRequiredError: paymentInfo.isRequired == true ? true : false , // if isReq is true set as true otherwise false
								fieldCharacterError: false // default false
				}
				dynamicFields.bankDetails.push(bankObj)
			}

			document.getElementById('bnkNme').removeAttribute('hidden');
			// if (!createdBankingFieldsEdit) {
			if(values != null && dynamicFields.bankDetails.length != values.length){
				var dynamicValues={};
				for(i=0;i<countryBankPreference.length;i++){
					var key =countryBankPreference[i].atrributeDescription;
					if(key){
						var val = globalJsonResp['BNK_DTL_'+countryBankPreference[i].attributeLineNumber+'_TXT'];
						dynamicValues[key]=val;
					}

				}
				displayDynamicFields(dynamicValues);
			} else{
				displayDynamicFields(values);
			}                  
			createdBankingFields = true;
			//  }
			document.getElementById('bnkAdd1').removeAttribute('hidden');
			document.getElementById('bnkAdd2').removeAttribute('hidden');
			document.getElementById('bnkAdd3').removeAttribute('hidden');
			document.getElementById('bnkAdd4').removeAttribute('hidden');

		} else {
			console.log('response success zero result ' + response.length);
			$('#dynamic-fields').empty("");
			dynamicFields.bankDetails = []
			document.getElementById('bnkNme').removeAttribute('hidden');
			document.getElementById('bnkAdd1').removeAttribute('hidden');
			document.getElementById('bnkAdd2').removeAttribute('hidden');
			document.getElementById('bnkAdd3').removeAttribute('hidden');
			document.getElementById('bnkAdd4').removeAttribute('hidden');
			;
		}
	}).fail(function(response) {
        $("#system-error-note-loader").hide();
		document.getElementById("system-error-note-nopref").style.display = 'block';
		console.log('response success zero result ' + response.length);
		$('#dynamic-fields').empty("");
		dynamicFields.bankDetails = []


		document.getElementById('bnkNme').removeAttribute('hidden');
		document.getElementById('bnkAdd1').removeAttribute('hidden');
		document.getElementById('bnkAdd2').removeAttribute('hidden');
		document.getElementById('bnkAdd3').removeAttribute('hidden');
		document.getElementById('bnkAdd4').removeAttribute('hidden');
	});
}



$(document).ready(function() { 
    console.log("configuring nopref");
	/*$('.globalFooter').hide();
	setTimeout(function(){
		displayNoPreferenceBlock();
		getCountries();
		getCurrencies();
        setTimeout(function(){
		getPayeeInfo();
       },500);
		submitClaimUrl = $('#save-pref-btn').data('link');
	},300);*/
	$("#viewPreference").on("nopref", function(){
        console.log("loading nopref");
        displayNoPreferenceBlock();
        getCountries();
        getCurrencies();
        getPayeeInfo();
        submitClaimUrl = $('#save-pref-btn').data('link');

	});
});



