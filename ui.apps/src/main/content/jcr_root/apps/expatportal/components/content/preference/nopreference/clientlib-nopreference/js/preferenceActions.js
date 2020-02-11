var eftSelected = false;
var checkSelected = false;
var countryEftValidError = false;
var currencyEftValidError = false;
var countryBankPreference1 = [];
var ieBrowser = isIEBrowser();
var createdBankingFields = false;

var eftPayeeName = document.getElementById('eftPayeeName');
var eftCountry = document.getElementById('eftCountry');
var eftCurrency = document.getElementById('eftCurrency');
var eftBankName = document.getElementById('bankName');
var eftBankAdd1 = document.getElementById('bankAddress1');
var eftBankAdd2 = document.getElementById('bankAddress2');
var eftBankAdd3 = document.getElementById('bankAddress3');
var eftBankAdd4 = document.getElementById('bankAddress4');

var checkPayeeName = document.getElementById('checkPayeeName');
var checkCountry = document.getElementById('checkCountry');
var checkCurrency = document.getElementById('checkCurrency');

var payeeNameCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
var countryCharValidation = /^[a-zA-Z&(),\.\-'\sÅôé]{0,100}$/;
var currencyCharValidation = /^[A-Za-z.&'-\s]*$/;
var bankCharValidation;
var addressCharValidation;

var BankNameCharValidationMsg = document.getElementById('bankname-eft-char-msg');
var addressCharValidationMsg1 = document.getElementById('bankaddress1-eft-char-msg');
var addressCharValidationMsg2 = document.getElementById('bankaddress2-eft-char-msg');
var addressCharValidationMsg3 = document.getElementById('bankaddress3-eft-char-msg');
var addressCharValidationMsg4 = document.getElementById('bankaddress4-eft-char-msg');

var payeeNameCheckError = false;
var countryCheckError = false;
var countryCheckValidError = false;
var currencyCheckError = false;
var currencyCheckValidError = false;

var payeeNameEftError = false;
var countryEftError = false;
var countryEftValidError = false;
var currencyEftError = false;
var currencyEftValidError = false;
var bankNameEftError = true;
var dynamicBankingFieldsReq = false;
var dynamicBankingFieldsChar = false;

var tempBankData = [];

var dynamicFields = {
		bankDetails: [{
			label: "SWIFT Code",//ATR_DESC
			attributeType: "SWIFT",//ATR_LN_TYP_CD
			regex: "^(([a-zA-Z0-9]{8})|([a-zA-Z0-9]{11}))$",//VLD_EXP
			errorMessage: "EFT field error : Please enter valid SWIFT Code of either 8 or 11 characters in length & alphanumeric",//VLD_MSG
			maxLength: 11,//MAX_LEN_NBR
			isReq: true,//IS_REQ
			fieldRequiredError: true, // if isReq is true set as true otherwise false
			fieldCharacterError: false // default false
		}, {
			label: "IBAN",
			attributeType: "IBAN",
			regex: "^((F|f)(R|r))[0-9]{2}[0-9]{5}[0-9]{5}[0-9a-zA-Z]{11}[0-9]{2}$",
			errorMessage: "EFT field error : IBAN for France needs to start with FR and valid format should be FR2!n5!n5!n11!c2!n",
			maxLength: 27,
			isReq: false,
			fieldRequiredError: false, // if isReq is true set as true otherwise false
			fieldCharacterError: false // default false
		}, {
			label: "Bank Account Number",
			attributeType: "ACCT",
			regex: "^[a-zA-Z0-9]+$",
			errorMessage: "EFT field error : Please enter valid Account Number of alphanumeric",
			maxLength: 50,
			isReq: true,
			fieldRequiredError: true, // if isReq is true set as true otherwise false
			fieldCharacterError: false // default false
		}]
}

function updateValidations() { /// display eft method as default and assign regex validation and message

	document.getElementById('method-check-req-msg').style.display = "none";
	/// assign an actual value below
	bankCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
	BankNameCharValidationMsg.innerHTML = "Bank Name " + "allows only alphanumeric characters and . - & '";
	addressCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
	addressCharValidationMsg1.innerHTML = "Bank Address 1 " + "allows only alphanumeric characters and . - & '";
	addressCharValidationMsg2.innerHTML = "Bank Address 2 " + "allows only alphanumeric characters and . - & '";
	addressCharValidationMsg3.innerHTML = "Bank Address 3 " + "allows only alphanumeric characters and . - & '";
	addressCharValidationMsg4.innerHTML = "Bank Address 4 " + "allows only alphanumeric characters and . - & '";

}

function eftFunction(){
	/// when eft selector method clicked

	var chkCountryVal = $('#checkCountry').val();
	var chkCurrencyVal = $('#checkCurrency').val();
	var eftCountryVal = $('#eftCountry').val();
	var eftCurrencyVal = $('#eftCurrency').val();
	var chkPayeeName = $('#checkPayeeName').val();

	if(chkPayeeName && chkPayeeName != ''){
		$('#eftPayeeName').val(chkPayeeName);
	}
     var eftCountryFlag= false;
	if(chkCountryVal != undefined && (chkCountryVal != ""  || (chkCountryVal == "" && $('#country-check-req-msg').is(':visible')))&& (eftCountryVal == "" || eftCountryVal != chkCountryVal)){
		$('#eftCountry').val(chkCountryVal);
		eftCountryChangeEvent(null);
        if( $('#country-check-req-msg').is(':visible')){
            eftCountryFlag = true;

        }
	}//start


var eftCurrFlag = false;

	if(chkCurrencyVal != undefined && (chkCurrencyVal != "" || (chkCurrencyVal == "" && $('#currency-check-req-msg').is(':visible'))) && (eftCurrencyVal == "" || eftCurrencyVal != chkCurrencyVal)){
		$('#eftCurrency').val(chkCurrencyVal);
		if($('#currency-check-req-msg').is(':visible')){
			eftCurrFlag = true;
			$('#currency-eft-req-msg').css('display','block');
		}
		
	} 


	eftSelected = true;
	checkSelected = false;
	document.getElementById('method-check-req-msg').style.display = "none";
	if(!eftCurrFlag){
		document.getElementById('currency-check-req-msg').style.display = "none";
		document.getElementById('currency-eft-req-msg').style.display = "none";		
    } 


	document.getElementById('currency-check-valid-msg').style.display = "none";
	document.getElementById('currency-check-char-msg').style.display = "none";

    if(!eftCountryFlag){
	document.getElementById('country-check-req-msg').style.display = "none";
	document.getElementById('country-eft-req-msg').style.display = "none";
    }
	document.getElementById('country-check-valid-msg').style.display = "none";
	document.getElementById('country-check-char-msg').style.display = "none";

	document.getElementById('otp-eft-method').style.display = "block";
	document.getElementById('otp-check-method').style.display = "none";
	document.getElementById("eftTxt").style.color = "white";
	$('.eft-selector').css("background-color", "#003DA1");
	document.getElementById("checkTxt").style.color = "black";
	$('.check-selector').css("background-color", "white");
	if (eftSelected && whiteSpaceTrim(eftCountry.value.toString()) !== "" && whiteSpaceTrim(eftCurrency.value.toString()) !==
		"" && eftSelected && !currencyEftValidError && !countryEftValidError) {

		document.getElementById('bnkNme').removeAttribute('hidden');
		
		var countryCode = $('#eftCountryList').find("option[value=\""+ whiteSpaceTrim(eftCountry.value.toString()) + "\"]").attr('data-code');
		var currencyCode = $('#eftCurrencyList').find("option[value='"+ whiteSpaceTrim(eftCurrency.value.toString()) + "']").data('currency');
		if($('#dynamic-fields .row').length <= 0 )
			getBankDetailsByCountryCode(countryCode,currencyCode);

		document.getElementById('bnkAdd1').removeAttribute('hidden');
		document.getElementById('bnkAdd2').removeAttribute('hidden');
		document.getElementById('bnkAdd3').removeAttribute('hidden');
		document.getElementById('bnkAdd4').removeAttribute('hidden');
	} else { /// remove dynamic fields when there is no valid country and currency
		var list = document.getElementById('dynamic-fields');
		while (list.hasChildNodes()) {
			createdBankingFields = false;
			list.removeChild(list.firstChild);
		}
	}

    if(eftCurrFlag && $('#bnkAdd1').is(':visible')){
		document.getElementById('currency-eft-req-msg').style.display = "none";	
    }
	//prefillOTPDATAifCountryunChanged();
	//end
}

function checkFunction(){
	/// when check selector method clicked

	checkSelected = true;
	eftSelected = false;
	var checCurrFlag = false;
    var checkCountryFlag = false;
	if($('#currency-eft-req-msg').is(':visible')){
		checCurrFlag = true;
	}

    if($('#country-eft-req-msg').is(':visible')){
		checkCountryFlag = true;
	}
	var eftReqVal = $('#country-eft-req-msg').is(':visible');
	document.getElementById('method-check-req-msg').style.display = "none";
	document.getElementById('otp-check-method').style.display = "block";
	document.getElementById('otp-eft-method').style.display = "none";


	//document.getElementById('currency-check-req-msg').style.display = "none";

	document.getElementById('currency-eft-req-msg').style.display = "none";
	document.getElementById('currency-check-valid-msg').style.display = "none";
	document.getElementById('currency-check-char-msg').style.display = "none";
	document.getElementById('country-check-req-msg').style.display = "none";
	document.getElementById('country-eft-req-msg').style.display = "none";
	document.getElementById('country-check-valid-msg').style.display = "none";
	document.getElementById('country-check-char-msg').style.display = "none";
	document.getElementById("eftTxt").style.color = "black";
	$('.eft-selector').css("background-color", "white");
	document.getElementById("checkTxt").style.color = "white";
	$('.check-selector').css("background-color", "#003DA1");
	var eftCountryVal = $('#eftCountry').val(); 
	var chkCountryVal = $('#checkCountry').val();
	var eftCurrencyVal = $('#eftCurrency').val();
	var chkCurrencyVal = $('#checkCountry').val();
	var eftPayeeName = $('#eftPayeeName').val();

	if(eftPayeeName && eftPayeeName != ''){
		$('#checkPayeeName').val(eftPayeeName);
	}

	
	if(eftCountryVal != undefined && (eftCountryVal != "" || (eftCountryVal.length == 0 && eftReqVal)) && (chkCountryVal == "" || eftCountryVal != chkCountryVal)){
		
		$('#checkCountry').val(eftCountryVal);
		checkCountryChangeEvent(null);
	}

    if(checkCountryFlag){
		$('#country-check-req-msg').css('display','block');
	}

	//if(eftCurrencyVal != undefined && (eftCurrencyVal != "" || (eftCurrencyVal == "" && $('#currency-eft-req-msg').is(':visible')))  && (chkCurrencyVal == "" || eftCurrencyVal != chkCurrencyVal)){
	$('#checkCurrency').val(eftCurrencyVal);
	if(eftCurrencyVal != undefined && eftCurrencyVal != "" && $('#currency-check-req-msg').is(':visible')){
		document.getElementById('currency-check-req-msg').style.display = "none";		
	}
	//}
	if(checCurrFlag){
		$('#currency-check-req-msg').css('display','block');
	}

	removeOtpEftMessages();   
}

function whiteSpaceTrim(x) {
	return x.replace(/^\s+|\s+$/gm, '');
}

function getBankDetailsByCountryCode (countryCode,currencyCode) {
	$('#dynamic-fields').empty();

	//var memberId = $("#header").attr("data-mmid");
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
	//settings.url = $('#onetimepaymentServiceURL').val() + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode;
	settings.url = '/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.getPaymentInfoByCountry.json' + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode;
	$.ajax(settings).done(function(response) {
		if (response && response.getPaymentInfoByCountry && response.getPaymentInfoByCountry.length > 0) {
			
			countryBankPreference1 = response.getPaymentInfoByCountry;

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
			//if (!createdBankingFields) {
			displayDynamicFields();
			createdBankingFields = true;
			// }
			document.getElementById('bnkAdd1').removeAttribute('hidden');
			document.getElementById('bnkAdd2').removeAttribute('hidden');
			document.getElementById('bnkAdd3').removeAttribute('hidden');
			document.getElementById('bnkAdd4').removeAttribute('hidden');

			// prefillOTPDATAifCountryunChanged();

		} else {
			$('#dynamic-fields').empty();
			console.log('response success zero result ' + response.length);
			dynamicFields.bankDetails = [];
		}
	}).fail(function(response) {
		$('#dynamic-fields').empty();
		dynamicFields.bankDetails = [];
		document.getElementById("system-error-note-nopref").style.display = 'block';
	});
}

function setInputFilterDynamicBankingFields(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			}
		});
	});
}

function displayDynamicFields() { /// dynamic banking fields builder
	var dynamicBankingFieldsHTML = document.getElementById("dynamic-reference").children[0]; // get reference html
	$('#dynamic-fields').empty();
	dynamicFields.bankDetails.forEach(function (data) {
		var cloneHTML = dynamicBankingFieldsHTML.cloneNode(true); /// clone a reference html for dynamic banking field

		cloneHTML.classList.remove("hidden-banking-dynamic-container"); /// remove hidden on the cloned html

		cloneHTML.children[1].children[0].setAttribute("aria-labelledby", data.label); /// add aria-labelledby to input field
		if (data.isReq) { /// add require label and error message
			cloneHTML.children[0].children[0].innerHTML = data.label + "*"; // add required indicator
			cloneHTML.children[1].children[1].innerHTML = data.label + " is required."; // add required message
			cloneHTML.children[1].children[1].id = data.attributeType + "-req-msg"; // add ID for required message
		} else { /// add label 
			cloneHTML.children[0].children[0].innerHTML = data.label; // display not required label
		}

		cloneHTML.children[1].children[0].id = data.attributeType; /// set ID of the input field
		cloneHTML.children[1].children[0].maxLength = data.maxLength; /// set maximum character
		if (data.regex && data.regex !== "null" && data.regex !== "NULL" && data.regex !== null && data.regex !==
		"") {
			cloneHTML.children[1].children[2].innerHTML = data.errorMessage; // add regex error message
			cloneHTML.children[1].children[2].id = data.attributeType + "-char-msg";
		}
		document.getElementById('dynamic-fields').appendChild(cloneHTML); /// append the created field
		dynamicBankingFieldRequiredChecker(data); /// create a dynamic required checker field for dynamic banking fields

		var dynamicInputID = document.getElementById(data.attributeType);
		setInputFilterDynamicBankingFields(dynamicInputID, function (value) { /// create a dynamic character checker for dynamic banking fields
			var fieldRegex = new RegExp(data.regex);
			if(data.regex && document.getElementById(data.attributeType + "-char-msg") != null){
				if (fieldRegex.test(value)) {
					document.getElementById(data.attributeType + "-char-msg").style.display = "none";
					data.fieldCharacterError = false;
					return fieldRegex.test(value);
				} else {
					if (value) {
						document.getElementById(data.attributeType + "-char-msg").style.display =
							"block";
						data.fieldCharacterError = true;
					} else {
						document.getElementById(data.attributeType + "-char-msg").style.display =
							"none";
						data.fieldCharacterError = false;
					}

				}
			}
		});
	});
}

function dynamicBankingFieldRequiredValidation(data) { /// dynamic validation for required fields
	var field = document.getElementById(data.attributeType);
	if (data.isReq) {
		var errorId = data.attributeType + "-req-msg"
		if (field != null) {
			if (whiteSpaceTrim(field.value.toString()) !== "") {
				document.getElementById(errorId).style.display = "none";
				data.fieldRequiredError = false;
			} else {
				document.getElementById(errorId).style.display = "block";
				data.fieldRequiredError = true;
			}
		}
	}
}

function dynamicBankingFieldRequiredChecker(data) { /// dynamic function for required fields
	var field = document.getElementById(data.attributeType);
	["input", "blur", "change"].forEach(function (event) {
		field.addEventListener(event, function (event) {
			var isInputInValid = event.type == "input" && event.currentTarget.value == "";
			if((ieBrowser && !isInputInValid) || !ieBrowser){

				dynamicBankingFieldRequiredValidation(data);
			}
		});
	});
}

["input", "blur", "change"].forEach(function (event) {
	checkPayeeName.addEventListener(event, function (event) {

		payeeNameCheckChecker();

	});
});

["input", "blur", "change"].forEach(function (event) {
	checkCountry.addEventListener(event, function (event) {
		var isInputInValid = event.type == "input" && event.currentTarget.value == "";
		if((ieBrowser && !isInputInValid) || !ieBrowser){
			checkCountryChangeEvent(event);
		}
	});
});
function checkCountryChangeEvent(event){
	document.getElementById('currency-check-req-msg').style.display = "none";
	document.getElementById('currency-check-valid-msg').style.display = "none";
	document.getElementById('currency-eft-valid-msg').style.display = "none";
	//payeeNameCheckChecker();
	if(event){
		countryCheckChecker();
		countryCheckListChecker();
	}

	var countryVal = countryList.filter(function (country) {
		if (checkCountry.value.toUpperCase() === country.toUpperCase()) {
			return country;
		}
	});

	if (countryVal.length > 0) {
		$('#checkCountry').val(countryVal[0]);
	}

	var currencyCode =  $('#checkCountryList').find("option[value=\""+ checkCountry.value + "\"]").attr('data-currency');
	var currencyName =  $('#checkCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();

	if(currencyName != undefined && currencyName !=''){
		$('#checkCurrency').val(currencyName);
	} else{
		document.getElementById('currency-check-req-msg').style.display = "none";
	}

}

["input", "blur", "change"].forEach(function (event) {
	checkCurrency.addEventListener(event, function (event) {
		var isInputInValid = event.type == "input" && event.currentTarget.value == "";

		if((ieBrowser && !isInputInValid) || !ieBrowser){
			payeeNameCheckChecker();
			countryCheckChecker();
			countryCheckListChecker();
			currencyCheckChecker();
			currencyCheckListChecker();
		}
	});
});

function checkCountryChangeEvent(event){
	document.getElementById('currency-check-req-msg').style.display = "none";
	document.getElementById('currency-check-valid-msg').style.display = "none";
	document.getElementById('currency-eft-valid-msg').style.display = "none";
	//payeeNameCheckChecker();
	if(event){
		countryCheckChecker();
		countryCheckListChecker();}
	var countryVal = countryList.filter(function (country) {
		if (checkCountry.value.toUpperCase() === country.toUpperCase()) {
			return country;
		}
	});

	if (countryVal.length > 0) {
		$('#checkCountry').val(countryVal[0]);
	}

	var currencyCode =  $('#checkCountryList').find("option[value=\""+ checkCountry.value + "\"]").attr('data-currency');
	var currencyName =  $('#checkCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();
	if(currencyName != undefined && currencyName !=''){
		$('#checkCurrency').val(currencyName);
	} else{
		document.getElementById('currency-check-req-msg').style.display = "none";
		$('#checkCurrency').val('');
	}       
}

function countryCheckChecker() {
	if (whiteSpaceTrim(checkCountry.value.toString()) !== "") {
		document.getElementById('country-check-req-msg').style.display = "none";
		countryCheckError = false;
	} else {
		document.getElementById('country-check-req-msg').style.display = "block";
		document.getElementById('currency-check-req-msg').style.display = "block";
		document.getElementById('country-check-valid-msg').style.display = "none";
		countryCheckError = true;
	}
}

function countryCheckListChecker() {
	if (checkCountry.value !== "" && countryCharValidation.test(checkCountry.value)) {
		var matchedCountry = countryList.filter(function (country) {
			if (checkCountry.value.toUpperCase() === country.toUpperCase()) {
				return checkCountry.value;
			}
		});
		if (matchedCountry.length == 0) {
			countryCheckValidError = true;
			document.getElementById('country-check-valid-msg').style.display = "block";
		} else {
			countryCheckValidError = false;
			document.getElementById('country-check-valid-msg').style.display = "none";
		}
	}
}

function currencyCheckChecker() {
	if (whiteSpaceTrim(checkCurrency.value.toString()) !== "") {
		document.getElementById('currency-check-req-msg').style.display = "none";
		currencyCheckError = false;
	} else {
		var chkCntyVal = $(checkCountry).val();
		var chkCntyCode =  $('#checkCountryList').find("option[value=\""+ chkCntyVal + "\"]").attr('data-currency');
		var chkcurrencyName =  $('#eftCurrencyList').find("option[data-currency='"+ chkCntyCode + "']").val();
		if(chkcurrencyName == undefined){
			document.getElementById('currency-check-req-msg').style.display = "block";
			currencyCheckError = false;
		} else{
			document.getElementById('currency-check-req-msg').style.display = "block";
			tagFormError(document.getElementById('currency-check-req-msg').innerHTML,'trackFormErrorLoad');
			document.getElementById('currency-check-valid-msg').style.display = "none";
			currencyCheckError = true;
		}

	}
}

function currencyCheckListChecker() {
	if (checkCurrency.value !== "" && currencyCharValidation.test(checkCurrency.value)) {
		var matchedCurrency = currencyList.filter(function (country) {
			if (checkCurrency.value.toUpperCase() === country.toUpperCase()) {
				return checkCurrency.value;
			}
		});

		if (matchedCurrency.length == 0 && checkCurrency.value != "") {
			currencyCheckValidError = true;
			document.getElementById('currency-check-valid-msg').style.display = "block";
		} else {
			currencyCheckValidError = false;
			document.getElementById('currency-check-valid-msg').style.display = "none";
		}
    } else{
		document.getElementById('currency-check-valid-msg').style.display = "none";
    }
}

function currencyEftChecker() {
	if (whiteSpaceTrim(eftCurrency.value.toString()) !== "") {
		document.getElementById('currency-eft-req-msg').style.display = "none";
		currencyEftError = false;
	} else {
		document.getElementById('currency-eft-req-msg').style.display = "block";
		document.getElementById('currency-eft-valid-msg').style.display = "none";
		currencyEftError = true;
	}
}

function currencyEftListChecker() {
	if (eftCurrency.value !== "" && currencyCharValidation.test(eftCurrency.value)) {
		var matchedCurrency = currencyList.filter(function (country) {
			if (eftCurrency.value.toUpperCase() === country.toUpperCase()) {
				return eftCurrency.value;
			}
		});
		if (matchedCurrency.length == 0) {
			currencyEftValidError = true;
			document.getElementById('currency-eft-valid-msg').style.display = "block";
		} else {
			currencyEftValidError = false;
			document.getElementById('currency-eft-valid-msg').style.display = "none";
		}
	}
}

function removeOtpEftMessages() { /// remove existing OTP EFT messages that are being displayed
	$('#bankname-eft-req-msg').hide()
	$('#dynamic-fields .text-danger').hide();
}

function eftCountryChangeEventevent(){
	//payeeNameEftChecker();
	countryEftChecker();
	countryEftListChecker();
	displayBankingDetailsForm();

	var countryVal = countryList.filter(function (country) {
		if (eftCountry.value.toUpperCase() === country.toUpperCase()) {
			return country;
		}
	});

	if (countryVal.length > 0) {
		$('#eftCountry').val(countryVal[0]);
	}

	var currencyCode =  $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-currency');
	var currencyName =  $('#eftCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();
    var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');

	$('#eftCurrency').val(currencyName);
	if(currencyName != undefined){
		currencyEftChecker();
	}
	if( eftSelected && countryCode && countryCode != undefined && currencyName != undefined && countryCode != '' && event != null){
		tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);

	}

	//claimCurrencyListChecker();
	if(event == null  || (event != null && event.type =='change')){
		clearBankAndAddressFields();  
		removeOtpEftMessages();
	}   	
}

["input", "blur", "change"].forEach(function (event) {
	eftPayeeName.addEventListener(event, function (event) {
		payeeNameEftChecker();
	});
});
["input", "change"].forEach(function (event) {
	eftCountry.addEventListener(event, function (event) {
		//console.log('event called country',event.currentTarget.value);

		var isInputInValid = event.type == "input" && event.currentTarget.value == "";
		if((ieBrowser && !isInputInValid) || !ieBrowser){
			eftCountryChangeEvent(event); 
		}
	});
});






function eftCountryChangeEvent(event){
	//payeeNameEftChecker();
	countryEftChecker();
	countryEftListChecker();
	displayBankingDetailsForm();

	var countryVal = countryList.filter(function (country) {
		if (eftCountry.value.toUpperCase() === country.toUpperCase()) {
			return country;
		}
	});

	if (countryVal.length > 0) {
		$('#eftCountry').val(countryVal[0]);
	}
	//for binding provider country and claim currency
	var currencyCode =  $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-currency');
	var currencyName =  $('#eftCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();
	var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');

	$('#eftCurrency').val(currencyName);
	if(currencyName != undefined){
		currencyEftChecker();
	}
	if( eftSelected && countryCode && countryCode != undefined && currencyName != undefined && countryCode != '' && event != null){
		tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);

	}

	//claimCurrencyListChecker();
	if(event == null  || (event != null && event.type =='change')){
		clearBankAndAddressFields();  
		removeOtpEftMessages();
	}

}
function clearBankAndAddressFields(){
	$(eftBankName).val("");
	$('#bnkAdd1 input').val("");
	$('#bnkAdd2 input').val("");
	$('#bnkAdd3 input').val("");
	$('#bnkAdd4 input').val(""); 
}

["input","blur", "change"].forEach(function (event) {
	eftCurrency.addEventListener(event, function (event) {
		var isInputInValid = event.type == "input" && event.currentTarget.value == "";

		//if((ieBrowser && !isInputInValid) || !ieBrowser){
		if(!isInputInValid){
			removeOtpEftMessages();
			payeeNameEftChecker();
			countryEftChecker();
			countryEftListChecker();
			currencyEftChecker();
			currencyEftListChecker();
			displayBankingDetailsForm();

			//eftCountryChangeEvent(event); 
			var eftCurrencyValue = $('#eftCurrency').val();
			var eftCountryValue = $('#eftCountry').val();
			var currencyCode =  $('#eftCurrencyList').find("option[value='"+ eftCurrencyValue + "']").attr('data-currency');
			var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountryValue + "\"]").attr('data-code');

			/// $('#eftCurrency').val(currencyName);
			if( eftSelected && currencyCode && currencyCode!= undefined && currencyCode != '' && 
					countryCode && countryCode != undefined && countryCode != '' && event != null && eftCurrencyValue){
				tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);

			}
			clearBankAndAddressFields();
		}
	});
});

["input", "blur", "change"].forEach(function (event) {
	eftBankName.addEventListener(event, function (event) {
		var isInputInValid = event.type == "input" && event.currentTarget.value == "";
		if((ieBrowser && !isInputInValid) || !ieBrowser){
			payeeNameEftChecker();
			countryEftChecker();
			countryEftListChecker();
			currencyEftChecker();
			currencyEftListChecker();
			displayBankingDetailsForm();
			bankNameEftChecker();
		}
	});
});

function payeeNameEftChecker() {
	if (whiteSpaceTrim(eftPayeeName.value.toString()) !== "") {
		document.getElementById('payee-name-eft-req-msg').style.display = "none";
		if(!checkSelected && !eftSelected){
			var eftValuePayeeNameVal = $('#eftPayeeName').val();
			if(eftValuePayeeNameVal != undefined && eftValuePayeeNameVal != ''){
				$('#checkPayeeName').val(eftValuePayeeNameVal);
			}
		}
		payeeNameEftError = false;
	} else {
		document.getElementById('payee-name-eft-req-msg').style.display = "block";
		payeeNameEftError = true;
	}
}



function setInputFilterPayeeNameEft(textbox, inputFilter) {
        ["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
            });
        });
    }
    setInputFilterPayeeNameEft(eftPayeeName, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('payee-name-eft-char-msg').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-eft-char-msg').style.display = "block";
           // return false;
        }
    })


function countryEftChecker() {
	if (whiteSpaceTrim(eftCountry.value.toString()) !== "") {
		document.getElementById('country-eft-req-msg').style.display = "none";
		countryEftError = false;
	} else {
		document.getElementById('country-eft-req-msg').style.display = "block";
		document.getElementById('country-eft-valid-msg').style.display = "none";
		countryEftError = true;
	}
}

function countryEftListChecker() {
	if (eftCountry.value !== "" && countryCharValidation.test(eftCountry.value)) {
		var matchedCountry = countryList.filter(function (country) {
			if (eftCountry.value.toUpperCase() === country.toUpperCase()) {
				return eftCountry.value;
			}
		});
		if (matchedCountry.length == 0) {
			countryEftValidError = true;
			document.getElementById('country-eft-valid-msg').style.display = "block";
		} else {
			countryEftValidError = false;
			document.getElementById('country-eft-valid-msg').style.display = "none";
		}
	}
}

function isIEBrowser() {
	var is_ie = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1

	return is_ie; 
}

function displayBankingDetailsForm() {
	if (whiteSpaceTrim(eftCountry.value.toString()) !== "" && whiteSpaceTrim(eftCurrency.value.toString()) !== "" &&
			eftSelected && !currencyEftValidError && !countryEftValidError) {
		document.getElementById('bnkNme').removeAttribute('hidden');
		if (!createdBankingFields) {
			displayDynamicFields();
			createdBankingFields = true;
		}
		document.getElementById('bnkAdd1').removeAttribute('hidden');
		document.getElementById('bnkAdd2').removeAttribute('hidden');
		document.getElementById('bnkAdd3').removeAttribute('hidden');
		document.getElementById('bnkAdd4').removeAttribute('hidden');
	} else {
		document.getElementById('bnkNme').hidden = true;
		var list = document.getElementById('dynamic-fields');
		while (list.hasChildNodes()) {
			list.removeChild(list.firstChild);
			createdBankingFields = false;
		}
		document.getElementById('bnkAdd1').hidden = true;
		document.getElementById('bnkAdd2').hidden = true;
		document.getElementById('bnkAdd3').hidden = true;
		document.getElementById('bnkAdd4').hidden = true;
	}
}

function bankNameEftChecker() {
	if (whiteSpaceTrim(eftBankName.value.toString()) !== "") {
		document.getElementById('bankname-eft-req-msg').style.display = "none";
		bankNameEftError = false;
	} else {
		if (!countryEftError && !currencyEftError && !countryEftValidError && !currencyEftValidError && (
				checkSelected || eftSelected)) {
			document.getElementById('bankname-eft-req-msg').style.display = "block";
		}
		bankNameEftError = true;
	}
}

function payeeNameCheckChecker() {
	if (whiteSpaceTrim(checkPayeeName.value.toString()) !== "") {
		document.getElementById('payee-name-check-req-msg').style.display = "none";
		payeeNameCheckError = false;
	} else {
		document.getElementById('payee-name-check-req-msg').style.display = "block";
		payeeNameCheckError = true;
	}
}



 function setInputFilterPayeeName(textbox, inputFilter) {
        ["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
            });
        });
    }
    setInputFilterPayeeName(checkPayeeName, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('payee-name-check-char-msg').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-check-char-msg').style.display = "block";
        }
    });




function setInputFilterCountryEft(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
setInputFilterCountryEft(eftCountry, function (value) {
	if (countryCharValidation.test(value)) {
		document.getElementById('country-eft-char-msg').style.display = "none";
		return countryCharValidation.test(value);
	} else {
		document.getElementById('country-eft-char-msg').style.display = "block";
	}
});

function setInputFilterCurrencyEft(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
setInputFilterCurrencyEft(eftCurrency, function (value) {
	if (currencyCharValidation.test(value)) {
		document.getElementById('currency-eft-char-msg').style.display = "none";
		return currencyCharValidation.test(value);
	} else {
		document.getElementById('currency-eft-char-msg').style.display = "block";
	}
});


function setInputFilterBankName(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
setInputFilterBankName(eftBankName, function (value) {
	if (bankCharValidation.test(value)) {
		document.getElementById('bankname-eft-char-msg').style.display = "none";
		return bankCharValidation.test(value);
	} else {
		document.getElementById('bankname-eft-char-msg').style.display = "block";
	}
});

function setInputFilterAddress(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
[eftBankAdd1, eftBankAdd2, eftBankAdd3, eftBankAdd4].forEach(
		function (field, index) {
			setInputFilterAddress(field, function (value) {
				if (addressCharValidation.test(value)) {
					switch (index) {
					case 0: //eftBankAdd1
					{
						document.getElementById('bankaddress1-eft-char-msg').style.display =
							"none";
						break;
					}
					case 1: //eftBankAdd2
					{
						document.getElementById('bankaddress2-eft-char-msg').style.display =
							"none";
						break;
					}
					case 2: //eftBankAdd3
					{
						document.getElementById('bankaddress3-eft-char-msg').style.display =
							"none";
						break;
					}
					case 3: //eftBankAdd4
					{
						document.getElementById('bankaddress4-eft-char-msg').style.display =
							"none";
						break;
					}
					default:
						break;
					}
					return addressCharValidation.test(value);
				} else {
					switch (index) {
					case 0:
					{
						document.getElementById('bankaddress1-eft-char-msg').style.display =
							"block";
						break;
					}
					case 1:
					{
						document.getElementById('bankaddress2-eft-char-msg').style.display =
							"block";
						break;
					}
					case 2:
					{
						document.getElementById('bankaddress3-eft-char-msg').style.display =
							"block";
						break;
					}
					case 3:
					{
						document.getElementById('bankaddress4-eft-char-msg').style.display =
							"block";
						break;
					}
					default:
						break;
					}
				}
			});
		}
); 

function setInputFilterCountry(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
setInputFilterCountry(checkCountry, function (value) {
	if (countryCharValidation.test(value)) {
		document.getElementById('country-check-char-msg').style.display = "none";
		return countryCharValidation.test(value);
	} else {
		document.getElementById('country-check-char-msg').style.display = "block";
	}
});

function setInputFilterCurrency(textbox, inputFilter) {
	["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
		textbox.addEventListener(event, function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	});
}
setInputFilterCurrency(checkCurrency, function (value) {
	if (currencyCharValidation.test(value)) {
		document.getElementById('currency-check-char-msg').style.display = "none";
		return currencyCharValidation.test(value);
	} else {
		document.getElementById('currency-check-char-msg').style.display = "block";
	}
});



function removeAllMessages() { /// remove existing messeges that being display
	document.getElementById('payee-name-check-req-msg').style.display = "none";
	document.getElementById('payee-name-check-char-msg').style.display = "none";
	document.getElementById('country-check-req-msg').style.display = "none";
	document.getElementById('country-check-valid-msg').style.display = "none";
	document.getElementById('country-check-char-msg').style.display = "none";
	document.getElementById('currency-check-req-msg').style.display = "none";
	document.getElementById('currency-check-valid-msg').style.display = "none";
	document.getElementById('currency-check-char-msg').style.display = "none";

	document.getElementById('payee-name-eft-req-msg').style.display = "none";
	document.getElementById('payee-name-eft-char-msg').style.display = "none";
	document.getElementById('country-eft-req-msg').style.display = "none";
	document.getElementById('country-eft-valid-msg').style.display = "none";
	document.getElementById('country-eft-char-msg').style.display = "none";
	document.getElementById('currency-eft-req-msg').style.display = "none";
	document.getElementById('currency-eft-valid-msg').style.display = "none";
	document.getElementById('currency-eft-char-msg').style.display = "none";
	document.getElementById('bankname-eft-req-msg').style.display = "none";

	document.getElementById('method-check-req-msg').style.display = "none";
}

function closeSystemErrorNote() {
	document.getElementById("system-error-note-nopref").style.display = 'none';
}



$(document).ready(function() { 
	updateValidations(); 	
});