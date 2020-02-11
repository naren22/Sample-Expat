var otpMethodSelected = "";
var eftSelected = false;
var checkSelected = false;
var payeeName  = "";
var countryBankPreference1 = [];
var updateDB = false;
var ieBrowser = isIEBrowser();

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

    var countryList = ["United States Of America", "Philippines", "India", "United Kingdom", "Australia", "Japan"];
    var currencyList = ["US Dollar", "Philippine Peso", "Euro", "Singaporean Dollar", "South Korean Won",
        "New Zealand Dollar"
    ];
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
    window.onload = function () { /// display eft method as default and assign regex validation and message
        document.getElementById('method-check-req-msg').style.display = "none";
        //document.getElementById('eft-method').style.display = "block";

        /// assign an actual value below
        bankCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
        BankNameCharValidationMsg.innerHTML = "Bank Name " + "allows only alphanumeric characters and . - & '";
        addressCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
        addressCharValidationMsg1.innerHTML = "Bank Address 1 " + "allows only alphanumeric characters and . - & '";
        addressCharValidationMsg2.innerHTML = "Bank Address 2 " + "allows only alphanumeric characters and . - & '";
        addressCharValidationMsg3.innerHTML = "Bank Address 3 " + "allows only alphanumeric characters and . - & '";
        addressCharValidationMsg4.innerHTML = "Bank Address 4 " + "allows only alphanumeric characters and . - & '";

    }

    // white space checker
    function whiteSpaceTrim(x) {
        return x.replace(/^\s+|\s+$/gm, '');
    }
    // end white space checker

    function openPayeeNote() {
        document.getElementById("payee-note").style.display = "block";
    }

    function closePayeeNote() {
        document.getElementById("payee-note").style.display = "none";
    }
    /////// EFT and Check
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

    function dynamicBankingFieldRequiredValidation(data) { /// dynamic validation for required fields
       // var field = document.getElementById(data.attributeType + "-edit");
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


var createdBankingFields = false;
    function eftFunction() { /// when eft selector method clicked
    	
    	var chkCountryVal = $('#checkCountry').val();
    	var chkCurrencyVal = $('#checkCurrency').val();
    	var eftCountryVal = $('#eftCountry').val();
    	var eftCurrencyVal = $('#eftCurrency').val();
        var chkPayeeName = $('#checkPayeeName').val();
        
       // trackAnalyticsData('EFT','button to enable eft section on preference popover');
    	
    	if(chkPayeeName && chkPayeeName != ''){
    		$('#eftPayeeName').val(chkPayeeName);
    	}
		if(chkCountryVal != undefined && chkCountryVal != "" && (eftCountryVal == "" || eftCountryVal != chkCountryVal)){
        	$('#eftCountry').val(chkCountryVal);
        	eftCountryChangeEvent(null);
        }//start
        
        
        if(chkCurrencyVal != undefined && chkCurrencyVal != "" && (eftCurrencyVal == "" || eftCurrencyVal != chkCurrencyVal)){
        	$('#eftCurrency').val(chkCurrencyVal);
        }

    	
        eftSelected = true;
        checkSelected = false;
        document.getElementById('method-check-req-msg').style.display = "none";
        document.getElementById('otp-eft-method').style.display = "block";
        document.getElementById('otp-check-method').style.display = "none";
        document.getElementById("eftTxt").style.color = "white";
        $('.eft-selector').css("background-color", "#003DA1");
        document.getElementById("checkTxt").style.color = "black";
        $('.check-selector').css("background-color", "white");
        if (eftSelected && whiteSpaceTrim(eftCountry.value.toString()) !== "" && whiteSpaceTrim(eftCurrency.value.toString()) !==
            "" && eftSelected && !currencyEftValidError && !countryEftValidError) {

            document.getElementById('bnkNme').removeAttribute('hidden');
            /*if (!createdBankingFields) { /// create a dynamic fields when there is a valid country and currency
                displayDynamicFields();
                createdBankingFields = true;
            }*/

          //  var countryCode = $('#eftCountryList').find("option[value='"+ whiteSpaceTrim(eftCountry.value.toString()) + "']").attr('data-code');
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
        //prefillOTPDATAifCountryunChanged();
        //end
    }
    
    function removeOtpEftMessages() { /// remove existing OTP EFT messages that are being displayed
        $('#bankname-eft-req-msg').hide()
        $('#dynamic-fields .text-danger').hide();
    }

    function checkFunction() { /// when check selector method clicked
    	 
        checkSelected = true;
        eftSelected = false;
        document.getElementById('method-check-req-msg').style.display = "none";
        document.getElementById('otp-check-method').style.display = "block";
        document.getElementById('otp-eft-method').style.display = "none";
        document.getElementById("eftTxt").style.color = "black";
        $('.eft-selector').css("background-color", "white");
        document.getElementById("checkTxt").style.color = "white";
        $('.check-selector').css("background-color", "#003DA1");
       // trackAnalyticsData('CHECK','button to enable check section on otp preference popover');

        var eftCountryVal = $('#eftCountry').val(); 
        var chkCountryVal = $('#checkCountry').val();
        var eftCurrencyVal = $('#eftCurrency').val();
        var chkCurrencyVal = $('#checkCountry').val();
        var eftPayeeName = $('#eftPayeeName').val();
    	
    	if(eftPayeeName && eftPayeeName != ''){
    		$('#checkPayeeName').val(eftPayeeName);
    	}

        if(eftCountryVal != undefined && eftCountryVal != "" && (chkCountryVal == "" || eftCountryVal != chkCountryVal)){
        	$('#checkCountry').val(eftCountryVal);
        	checkCountryChangeEvent(null);
        }
        
        if(eftCurrencyVal != undefined && eftCurrencyVal != "" && (chkCurrencyVal == "" || eftCurrencyVal != chkCurrencyVal)){
        	$('#checkCurrency').val(eftCurrencyVal);
        }

        removeOtpEftMessages();
        
    }

    /// start eft fields checker
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
    /// end  eft fields checker
    /// start of handle restricted character validation input for eft
    /// Restricts input for the given textbox to the given inputFilter.
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
    /// end of handle restricted character validation input for eft
    // start of field events
    ["input", "blur", "change"].forEach(function (event) {
        eftPayeeName.addEventListener(event, function (event) {
            payeeNameEftChecker();
        });
    });
    ["input", "blur", "change"].forEach(function (event) {
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
        // var currencyCode =  $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-currency');
       //  var currencyName =  $('#eftCurrencyList').find("option[data-currency=\""+ currencyCode + "\"]").val();
        // var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');

        // var currencyCode =  $('#eftCountryList').find("option[value='"+ eftCountry.value + "']").attr('data-currency');
        var currencyCode =  $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-currency');
        var currencyName =  $('#eftCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();
       // var countryCode = $('#eftCountryList').find("option[value='"+ eftCountry.value + "']").attr('data-code');
        var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');
        
        $('#eftCurrency').val(currencyName);
        if(currencyName != undefined){
        	currencyEftChecker();
        }
        if( eftSelected && countryCode && countryCode != undefined && currencyName != undefined && countryCode != '' && event != null){
        	tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);
        	
        }
        	
        claimCurrencyListChecker();
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

    ["input", "blur", "change"].forEach(function (event) {
        eftCurrency.addEventListener(event, function (event) {

            var isInputInValid = event.type == "input" && event.currentTarget.value == "";
            
            console.log('isInputInValid ' + isInputInValid);
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
           // var currencyName =  $('#eftCurrencyList').find("option[data-currency='"+ currencyCode + "']").val();
           // var countryCode = $('#eftCountryList').find("option[value='"+ eftCountryValue + "']").attr('data-code');
             var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountryValue + "\"]").attr('data-code');
            
           /// $('#eftCurrency').val(currencyName);
            if( eftSelected && currencyCode && currencyCode!= undefined && currencyCode != '' && 
            		countryCode && countryCode != undefined && countryCode != '' && event != null){
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
    //// end of field events 
    ///////////////////////////////////////////////////////////////////////////////////////
    // Start of check Method Validation
    function payeeNameCheckChecker() {
        if (whiteSpaceTrim(checkPayeeName.value.toString()) !== "") {
            document.getElementById('payee-name-check-req-msg').style.display = "none";
            payeeNameCheckError = false;
        } else {
            document.getElementById('payee-name-check-req-msg').style.display = "block";
            payeeNameCheckError = true;
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
            if (matchedCurrency.length == 0) {
                currencyCheckValidError = true;
                document.getElementById('currency-check-valid-msg').style.display = "block";
            } else {
                currencyCheckValidError = false;
                document.getElementById('currency-check-valid-msg').style.display = "none";
            }
        }
    }
    // End of check Method Validation
    // start of field events for check
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
        countryCheckChecker();
        countryCheckListChecker();
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
            
            console.log('isInputInValid ' + isInputInValid);
        	if((ieBrowser && !isInputInValid) || !ieBrowser){
            payeeNameCheckChecker();
            countryCheckChecker();
            countryCheckListChecker();
            currencyCheckChecker();
            currencyCheckListChecker();
        	}
        });
    });
    // end of field events for check

    /// start of handle restricted character validation input for check
    /// Restricts input for the given textbox to the given inputFilter.
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

    
    /// end of handle restricted character validation input for check

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

    function savePref() {
    	formErrors = [];
    	var check='Check';
        var eft = 'EFT';
        
        trackAnalyticsData('SAVE PREFERENCE','button to save preference on one time preference popover');
		sessionStorage.setItem('substep', '3.2');
		if(sessionStorage.getItem('isDependent') == 'true'){
            check = 'One-Time Reimbursement (Check)';
            eft = 'One-Time Reimbursement (EFT)';
        }else if(sessionStorage.getItem('CNTRYDefIndicator') == 'No'){
			check = 'One-Time Reimbursement (Check)';
            eft = 'One-Time Reimbursement (EFT)';
            sessionStorage.removeItem('isDependent');
        }else {
        	updateDB = true;
        	sessionStorage.removeItem('isDependent');
        }
    	sessionStorage.setItem('CNTRYDefIndicator', 'No');
        // verify submit
        if (checkSelected) {
            document.getElementById('method-check-req-msg').style.display = "none";
            payeeNameCheckChecker(); /// recheck fields before to submit
            countryCheckChecker();
            countryCheckListChecker();
            currencyCheckChecker();
            currencyCheckListChecker();
            otpMethodSelected = "chk";
        } else if (eftSelected) {
            // var bankingFieldsHasError = true;
        	otpMethodSelected = "eft";
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
            if(updateDB){
            	updateDB = false;
            	saveSelectedValues("check");
            	saveprefDefault();
            } else{
            	saveSelectedValues(check);
            }
            //saveSelectedValues("check");
            document.getElementById("system-error-note-loader").style.display = 'block';

            document.getElementById("system-error-note-loader").style.display = 'block';
            window.setTimeout(
                function () {
                    document.getElementById("system-error-note-loader").style.display = 'none';
                   // document.getElementById("system-error-note").style.display = 'block';
                }, 5000);
        }

        if (eftSelected && !payeeNameEftError && !countryEftError && !countryEftValidError && !currencyEftError && !
            currencyEftValidError && !bankNameEftError && !dynamicBankingFieldsReq & !dynamicBankingFieldsChar) { // if eft method no error messeges exist in order ro submit
            removeAllMessages(); // if success remove all existing messeges
            if(updateDB){
            	updateDB = false;
            	saveSelectedValues("Electronic Fund Transfer");
            	saveprefDefault();

            } else{
            	saveSelectedValues(eft);
            }
           // saveSelectedValues("eft");
            document.getElementById("system-error-note-loader").style.display = 'block';
            window.setTimeout(
                function () {
                    document.getElementById("system-error-note-loader").style.display = 'none';
                  //  document.getElementById("system-error-note").style.display = 'block';
                }, 5000);
        }
        
        $("html, body").animate({
			scrollTop : 0
		}, "fast");
        
        var errorArr = [];
        $.each($('.text-danger:visible'), function(){
    		errorArr.push({"errorname" : this.innerHTML});
    	});
        tagFormErrorStep1(errorArr,'trackFormErrorLoad');

    }
    
    function saveprefDefault(){
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
            payeeNameDef=$("#eftPayeeName").val();
    		cntryDef= $("#eftCountry").val();
            cntryCodeDef=cntryDef?$("#checkCountryList-edit option[value=\""+cntryDef+"\"]").data("code"):"";
    		crncyDef=$("#eftCurrency").val();
    		crncyCodeDef=crncyDef?$("#eftCurrencyList option[value='"+crncyDef+"']").data("currency"):"";
            prefDescDef="Electronic Fund Transfer";

        }else if (checkSelected) {
            payeeNameDef=$("#checkPayeeName").val();
    		cntryDef= $("#checkCountry").val();
            cntryCodeDef=cntryDef?$("#checkCountryList option[value=\""+cntryDef+"\"]").data("code"):"";
    		crncyDef=$("#checkCurrency").val();
    		crncyCodeDef=crncyDef?$("#eftCurrencyList option[value='"+crncyDef+"']").data("currency"):"";

            prefDescDef="Check";
            prefMethodDef = "chk";
        }
        cntryDef = encodeURIComponent(cntryDef);
        var bnkDetailId = -1;

        var bnkMbrId = getMbrId();
        var emailAddress = sessionStorage.getItem('emailAddress') ? sessionStorage.getItem('emailAddress') : '';
        if(typeof globalJsonResp == 'undefined'){
             claimsInfo.getPaymentPreferences();
        }
        if(typeof globalJsonResp != 'undefined' && typeof globalJsonResp.BNK_DTL_ID != 'undefined' ){
                    bnkDetailId = globalJsonResp.BNK_DTL_ID;
        }

        if(typeof globalJsonResp != 'undefined' && typeof globalJsonResp.MBR_ID != 'undefined' ){
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
                  "BNK_PMNT_TYP": prefMethodDef.toUpperCase()||"",
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
             editPreference(JSON.stringify(preferncceData1) , "nopref");
        } else{
                    editPreference(JSON.stringify(preferncceData1) , null);
        }
        eftSelected = false;
        checkSelected = false;
    }
    

    function closeSystemErrorNote() {
        document.getElementById("system-error-note-loader").style.display = 'none';
        document.getElementById("system-error-note").style.display = 'none';
    }
    
    function saveSelectedValues(paymentType){
      //  var paymentMethod = paymentType == "eft" ? "One-Time Reimbursement (EFT)" : "One-Time Reimbursement (Check)";
    	var paymentMethod = paymentType;

    	$('#reimbursement-method-text').text(paymentMethod);
    	 $('#reimbursement-method-text').closest(".reimbursement-method-section").show();
      //  if(paymentType == "eft"){
    	 if(paymentType.indexOf("EFT") != -1 ){
    		$('#eft-method .payee-name-text').text($('#otp-eft-method #eftPayeeName').val());
        	$('#eft-method  .payee-country-text').text($('#otp-eft-method #eftCountry').val());
        	$('#eft-method .payee-currency-text').text($('#otp-eft-method #eftCurrency').val());
        	$('#eft-method .payee-bank-text').text($('#otp-eft-method #bankName').val());
        	//$('#eft-method .valAddress1').text($('#otp-eft-method #bankAddress1').val()).parent().parent().show();
        	//$('#eft-method .valAddress2').text($('#otp-eft-method #bankAddress2').val()).parent().parent().show();
        	//$('#eft-method .valAddress3').text($('#otp-eft-method #bankAddress3').val()).parent().parent().show(); 

            if($('#otp-eft-method #bankAddress1').val() && $('#otp-eft-method #bankAddress1').val() != ''){
        		$('#eft-method .valAddress1').text($('#otp-eft-method #bankAddress1').val()).parent().parent().show();
            }else{
				$('#eft-method .valAddress1').text($('#otp-eft-method #bankAddress1').val()).parent().parent().hide();
            }
            if($('#otp-eft-method #bankAddress2').val() && $('#otp-eft-method #bankAddress2').val() != ''){
        		$('#eft-method .valAddress2').text($('#otp-eft-method #bankAddress2').val()).parent().parent().show();
            }else{
				$('#eft-method .valAddress2').text($('#otp-eft-method #bankAddress2').val()).parent().parent().hide();
            }
            if($('#otp-eft-method #bankAddress3').val() && $('#otp-eft-method #bankAddress3').val() != ''){
        		$('#eft-method .valAddress3').text($('#otp-eft-method #bankAddress3').val()).parent().parent().show();
            }else{
                $('#eft-method .valAddress3').text($('#otp-eft-method #bankAddress3').val()).parent().parent().hide();
            }

             if($('#otp-eft-method #bankAddress4').val() && $('#otp-eft-method #bankAddress4').val() != ''){
        		$('#eft-method .valAddress4').text($('#otp-eft-method #bankAddress4').val()).parent().parent().show();
             }else{
                 $('#eft-method .valAddress4').text($('#otp-eft-method #bankAddress4').val()).parent().parent().hide();
             }
    		$('#eft-method').show();
    		$('#check-method').hide();
    		
    		var tmpDynamicBankFields = [];
    		
        	$('#dynamic-fields .row').each(function(){
        		var containerDiv = $(this);
        		
        		//here
        		var tmpVal = $(this).find('input').val();
        		
        		if($(this).find('input').attr('id') == "ACCT"){
        			var tmpAccountNumber = "" +  $(this).find('input').val();
        			tmpVal = "";
                	
                	for(var i=0;i< tmpAccountNumber.length;i++){
                		if(i < tmpAccountNumber.length - 4){
                			tmpVal = tmpVal + "x";
                		}
                		else
                			{
                			tmpVal = tmpVal + tmpAccountNumber[i]; 
                			}
                	}
        		}
        		
        		if($(this).find('input').attr('id') == "LCLACCT"){
        			var tmpAccountNumber = "" +  $(this).find('input').val();
        			tmpVal = "";
                	
                	for(var i=0;i< tmpAccountNumber.length;i++){
                		if(i < tmpAccountNumber.length - 4){
                			tmpVal = tmpVal + "x";
                		}
                		else
                			{
                			tmpVal = tmpVal + tmpAccountNumber[i]; 
                			}
                	}
        		}
        		
        		var obj = {
        				name : $(this).find('.lblDynamicField').text(),
        				value : tmpVal
        		} //here
        		tmpDynamicBankFields.push(obj);
        	});
        	
        	if(tmpDynamicBankFields.length > 0){
        		$('#dynamicBankingField .row').hide();
        		var dynamicFieldsRow = $('#dynamicBankingField .row');
        		var counter = 1;
                //console.log(tmpDynamicBankFields.length);
        		for(var i=0;i<tmpDynamicBankFields.length;i++){
                   // console.log(tmpDynamicBankFields[i].name);
        			$(dynamicFieldsRow[i]).find('.lblDetail'+counter).text(tmpDynamicBankFields[i].name);
        			$(dynamicFieldsRow[i]).find('.valDetail'+counter).text(tmpDynamicBankFields[i].value);
        			$(dynamicFieldsRow[i]).show();
        			counter ++;
        		}

        		
        		$('#dynamicBankingField').show();
        	}
        	else
        		{
        			$('#dynamicBankingField').hide();
        		}
        	saveData();
    	} else if(paymentType.indexOf("Electronic Fund Transfer") != -1){
    		$('#eft-method').show();
    		$('#check-method').hide();
    		
    		var tmpDynamicBankFields = [];
    		
        	$('#dynamic-fields .row').each(function(){
        		var containerDiv = $(this);
        		
        		//here
        		var tmpVal = $(this).find('input').val();
        		
        		if($(this).find('input').attr('id') == "ACCT"){
        			var tmpAccountNumber = "" +  $(this).find('input').val();
        			tmpVal = "";
                	
                	for(var i=0;i< tmpAccountNumber.length;i++){
                		if(i < tmpAccountNumber.length - 4){
                			tmpVal = tmpVal + "x";
                		}
                		else
                			{
                			tmpVal = tmpVal + tmpAccountNumber[i]; 
                			}
                	}
        		}
        		
        		var obj = {
        				name : $(this).find('.lblDynamicField').text(),
        				value : tmpVal
        		} //here
        		tmpDynamicBankFields.push(obj);
        	});
        	
        	if(tmpDynamicBankFields.length > 0){
        		$('#dynamicBankingField .row').hide();
        		var dynamicFieldsRow = $('#dynamicBankingField .row');
        		var counter = 1;
        		//console.log(tmpDynamicBankFields.length);
        		for(var i=0;i<tmpDynamicBankFields.length;i++){
        			//console.log(tmpDynamicBankFields[i].name);
        			$(dynamicFieldsRow[i]).find('.lblDetail'+counter).text(tmpDynamicBankFields[i].name);
        			$(dynamicFieldsRow[i]).find('.valDetail'+counter).text(tmpDynamicBankFields[i].value);
        			$(dynamicFieldsRow[i]).show();
        			counter ++;
        		}
        		
        		
        		$('#dynamicBankingField').show();
        	}
        	else
        		{
        			$('#dynamicBankingField').hide();
        		}
        	saveData();
    		
    	}
    	else
    		{
    			$('#check-method .payee-name-text').text($('#otp-check-method #checkPayeeName').val());
    			$('#check-method  .payee-country-text').text($('#otp-check-method #checkCountry').val());
    			$('#check-method .payee-currency-text').text($('#otp-check-method #checkCurrency').val());
    			$('#check-method').show();
    			$('#eft-method').hide();
    		}
    	
    	
    	 $('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').show();
    	 pageDataLayer.content.pageName = $('#review-submit-title').text();
         window.publishPostPageData ('trackClaimJourneyStep',{

             "claims": { //Custom Link Tracking Fields    
                 "claimStep": "step 3" //Claim journey step
                    
             }
         
         });
         _satellite.track('trackClaimSubmitPageLoad');
         // $('.editPreference').removeClass('showEditPreference').show();
        $('.editOneTimePref').hide();
        
        if($('#edit-review-submit-title').is(':visible')){
        	$('#edit-review-submit-title').hide();
        }
        if(!$('#review-submit-title').is(':visible')){
        	$('#review-submit-title').show();
        }
    }

    function cancelPref() {
    	document.getElementById("cancel-pref").style.display = "block";
    }
    
    function closePrefModal1(){
    	document.getElementById("cancel-pref").style.display = "none";    	
    }
    
    function cancelPref1(){
    	document.getElementById("cancel-pref").style.display = "none";
    	formErrors = [];
        removeAllMessages(); // if cancel remove all existing messeges and redirect to specific page
        $('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').show();
         $('.editOneTimePref').hide();
         $('.showEditPreference input').val('');
         var paymentMethod = $('#reimbursement-method-text').text();
         var methodType = "";
         
         trackAnalyticsData('CANCEL','button to cancel preference on one time preference popover');

       //  if(paymentMethod == "Electronic Fund Transfer" || paymentMethod == ""){
		// document.getElementById('otp-eft-method').style.display = "none";
		// document.getElementById('otp-check-method').style.display = "none";

         if(paymentMethod == "Electronic Fund Transfer"){
        	 document.getElementById("eftTxt").style.color = "black";
        	 $('.eft-selector').css("background-color", "white");
        	 document.getElementById("checkTxt").style.color = "black";
        	 $('.check-selector').css("background-color", "white");
        	 $('#otp-check-method').css("display", "none");

        	 $('#otp-eft-method').css("display", "block"); 
         } else if(paymentMethod.indexOf('EFT') != -1){
        	 document.getElementById('otp-eft-method').style.display = "block";
             document.getElementById('otp-check-method').style.display = "none";
             document.getElementById("eftTxt").style.color = "white";
             $('.eft-selector').css("background-color", "#003DA1");
             document.getElementById("checkTxt").style.color = "black";
             $('.check-selector').css("background-color", "white");
             methodType = 'eft';
        	 
         }  else if(paymentMethod.indexOf('Check') != -1){
        	 document.getElementById('otp-check-method').style.display = "block";
             document.getElementById('otp-eft-method').style.display = "none";
             document.getElementById("eftTxt").style.color = "black";
             $('.eft-selector').css("background-color", "white");
             document.getElementById("checkTxt").style.color = "white";
             $('.check-selector').css("background-color", "#003DA1");
             methodType = 'check';
         } 
        $('#bnkNme').attr('hidden','hidden');
	 	$('#dynamic-fields').empty();
		$('#bnkAdd1').attr('hidden','hidden');
		$('#bnkAdd2').attr('hidden','hidden');
		$('#bnkAdd3').attr('hidden','hidden');
		$('#bnkAdd4').attr('hidden','hidden');
		
		if(!(sessionStorage.getItem('isDependent')=='true' && sessionStorage.getItem('substep')=='3.2')){
			UpdateSavedForm(methodType);
         //displayBankingDetailsForm(); 
		}
         
         $('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').show();
         // $('.editPreference').addClass('showEditPreference');
           $('.editOneTimePref').hide();
           
           if($('#edit-review-submit-title').is(':visible')){
           	$('#edit-review-submit-title').hide();
           }
           pageDataLayer.content.pageName = $('#review-submit-title').text();
           window.publishPostPageData ('trackClaimJourneyStep',{

               "claims": { //Custom Link Tracking Fields    
                   "claimStep": "step 3" //Claim journey step
                      
               }
           
           });
           _satellite.track('trackClaimSubmitPageLoad');
    }

    function UpdateSavedForm(methodType){
    	if(methodType == 'eft'){
    		var countryVal = $('#eft-method .payee-country-text').text();
    		var eftCurrencyvalue = $('#eft-method .payee-currency-text').text();
    		$('#eftCountry').val(countryVal);
    		
    		if(eftCurrencyvalue == undefined || eftCurrencyvalue==""){
    			eftCountryChangeEvent(null); 
    		}else{
    			$('#eftCurrency').val(eftCurrencyvalue);
    		}
    		var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');
    		var currencyCode = $('#eftCurrencyList').find("option[value='"+ whiteSpaceTrim(eftCurrencyvalue.toString()) + "']").data('currency');
    		if( countryCode != undefined && countryCode != ''){
            	tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);
            }
    		var prefillIndex = 0;
    		var prefillInterval = setInterval(function(){
    			//console.log(prefillIndex+" : prefillIndex");
    			if($("#dynamic-fields").find("input[type=text].form-control").length > 0 || prefillIndex > 6){
    				clearInterval(prefillInterval);
    				prefillSavedInfo();
    			}
    			prefillIndex++;    			
    		}, 500);
            //setTimeout(function(){ prefillSavedInfo(); }, 2000);
            //prefillSavedInfo(); 		
    	}  else if(methodType == 'check'){	
    		var countryVal = $('#check-method .payee-country-text').text();
    		var checkCurrencyvalue = $('#check-method .payee-currency-text').text();
    		$('#checkCountry').val(countryVal);
    		
    		if(checkCurrencyvalue == undefined || checkCurrencyvalue==""){
    			checkCountryChangeEvent(null); 
    		}else{
    			$('#checkCurrency').val(checkCurrencyvalue);
    		}
    		
    		/*var countryVal = $('#eft-method .payee-country-text').text();
    		$('#checkCountry').val(countryVal);
    		checkCountryChangeEvent(null); */
    	}
    }
  
    function UpdateOTPForm(methodType){
    	if(methodType == 'eft'){
    		var countryVal = $('#eft-method .payee-country-text').text();
    		var eftCurrencyvalue = $('#eft-method .payee-currency-text').text();
    		$('#eftCountry').val(countryVal);

    		if(eftCurrencyvalue == undefined || eftCurrencyvalue==""){
    			eftCountryChangeEvent(null); 
    		}else{
    			$('#eftCurrency').val(eftCurrencyvalue);
    		}
    		var countryCode = $('#eftCountryList').find("option[value=\""+ eftCountry.value + "\"]").attr('data-code');
    		var currencyCode = $('#eftCurrencyList').find("option[value='"+ whiteSpaceTrim(eftCurrencyvalue.toString()) + "']").data('currency');
    		if( countryCode != undefined && countryCode != ''){
				$('#dynamic-fields').empty();
            	tempBankData = getBankDetailsByCountryCode(countryCode,currencyCode);
            }
    		var prefillIndexOTP = 0;
    		var prefillIntervalOTP = setInterval(function(){
    			//console.log(prefillIndexOTP+" : prefillIndex123");
    			if($("#dynamic-fields").find("input[type=text].form-control").length > 0 || prefillIndexOTP > 6){
    				clearInterval(prefillIntervalOTP);
    				prefillSavedInfo();
    			}
    			prefillIndexOTP++;    			
    		}, 500);
            //setTimeout(function(){ prefillSavedInfo(); }, 1000);
            //prefillSavedInfo(); 		
    	}  else if(methodType == 'check'){	
    		var countryVal = $('#check-method .payee-country-text').text();
    		$('#checkCountry').val(countryVal);
    		checkCountryChangeEvent(null); 
    	}
    }

  function editOneTimePref() {
	  if(sessionStorage.getItem('substep') == '3.2' || sessionStorage.getItem('CNTRYDefIndicator') == 'No'){
		  trackAnalyticsData('Specify a different (one-time) reimbursement preference for this claim*','Edit One Time Preference Button');
	        pageDataLayer.content.pageName = 'Enter One-Time Claim Reimbursement Preference';
	          window.publishPostPageData ('trackClaimJourneyStep',{

	            "claims": { //Custom Link Tracking Fields    
	                "claimStep": "step 3.1" //Claim journey step      
	            }
	        });
	  //trackAnalyticsData('Specify a different (one-time) reimbursement preference for this claim*','Edit One Time Preference Button');
	  _satellite.track('trackClaimSubmitPageLoad');
	  }
	  var paymentMethod = $('#reimbursement-method-text').text();
	  if(paymentMethod == "Electronic Fund Transfer" ){
		  payeeName = $('#claim-info-file-preview .payeeVal').text();
	  } else {
		  if($('#eft-method .payee-name-text') != undefined && !($('#eft-method').is(':hidden'))){
			  payeeName = $('#eft-method .payee-name-text').text();
		  } else if($('#check-method .payee-name-text') != undefined && !($('#check-method').is(':hidden'))){
			  payeeName = $('#check-method .payee-name-text').text();
		  }
	  }
      
        $('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').hide();
       // $('.editPreference').removeClass('showEditPreference').show();
        if(paymentMethod == 'Check' || paymentMethod == 'check' || paymentMethod == 'EFT' || paymentMethod == 'Electronic Fund Transfer'){
        	document.getElementById("eftTxt").style.color = "black";
        	$('.eft-selector').css("background-color", "white");
        	document.getElementById("checkTxt").style.color = "black";
        	$('.check-selector').css("background-color", "white");
        	$('#otp-check-method').css("display", "none");
        	$('#otp-eft-method').css("display", "block");
        	//clear the all input fields.
        	$('.showEditPreference input').val('');
        	if($('#bnkNme').attr('hidden') == undefined){
        		eftCountryChangeEvent(null);        		
        	}
        	eftSelected = false;
            checkSelected = false;
        }
       
        if(payeeName == ''){
        	payeeName = $('.payeeVal').text()
        }
		if(payeeName == ''){
            payeeName = sessionStorage.getItem('payee');
         }
		if($('#bankName').val()){
			$('#bnkNme').removeAttr('hidden');
			$('#bnkAdd1').removeAttr('hidden');
			$('#bnkAdd2').removeAttr('hidden');
			$('#bnkAdd3').removeAttr('hidden');
			$('#bnkAdd4').removeAttr('hidden');
		}
		
		$(eftPayeeName).attr("autocomplete","off");
		$(checkPayeeName).attr("autocomplete","off");
       
       $('#eftPayeeName, #checkPayeeName').val(payeeName);
       if((payeeName == null  || payeeName == '') && sessionStorage.getItem('CNTRYDefIndicator') == 'Yes'){    	   
    	   setTimeout(function(){
    		   if(payeeName == null  || payeeName == ''){
    			   payeeName = $('.payeeVal').text();
    		   }
    		   if(payeeName == null  || payeeName == ''){
    			   payeeName = sessionStorage.getItem('payee');
    		   }
    		   $('#eftPayeeName, #checkPayeeName').val(payeeName);
    	   },1000);
       }
       
      $('.editOneTimePref').show();
      if(sessionStorage.getItem('CNTRYDefIndicator')!='Yes' && sessionStorage.getItem('CNTRYDefIndicator')!=null){
          $('.review-submit-sub-title').show();
      }
        //fillCountryAndCurrencyValues();
        removeAllMessages();
        $("html, body").animate({
			scrollTop : 0
		}, "fast");
        if(sessionStorage.getItem('CNTRYDefIndicator')=='No'){
        	$('.cancel-pref-btn').show();
            $('.no-pref-message').hide();
			$('.no-pref-button').hide();
            $('.no-pref-container').removeClass('justify-content-lg-center');
        }
        if(sessionStorage.getItem('substep') == '3.2' || (sessionStorage.getItem('isDependent') == 'true' && sessionStorage.getItem('substep') == '3.2') ||  (sessionStorage.getItem('isDependent') == 'true' && sessionStorage.getItem('CNTRYDefIndicator') == 'No')){
			$('.no-pref-button').show();
			$('.no-pref-message').hide();
			$('.dependent-no-pref-message').hide();
		}
		if(sessionStorage.getItem('isSubscriber') == 'true'){
			$('.no-pref-button').show();
	    }
		if(sessionStorage.getItem('isDependent')=='true' && sessionStorage.getItem('substep')=='3.2'){
	          if(paymentMethod == 'EFT' || paymentMethod == 'Electronic Fund Transfer' || paymentMethod == 'One-Time Reimbursement (EFT)'){
	              eftFunction();
	              UpdateOTPForm('eft');
	          }else if (paymentMethod == 'One-Time Reimbursement (Check)'){
	              checkFunction();
	              UpdateOTPForm('check');
	          }
	      }
     }

  function fillCountryAndCurrencyValues(){
	 // var countryList = [];
	  //var currencyList = [];
	  var countriesData = countryResponse;
	  
	  $("#checkCountryList, #eftCountryList").empty();
      for (var i = 0; i < countriesData.length; i++) {
    	  $("#checkCountryList, #eftCountryList").append(
              "<option value=\"" +
              countriesData[i].name + "' data-currency='" + countriesData[i].currencyCode + "\" data-code='" + countriesData[i].code + "' />");
          //countryList[i] = countriesData[i].CNTRY_NM;
      }


      
      var currenciesData =  currencyResponse;
      $("#eftCurrency,#checkCurrency").empty();
      for (var i = 0; i < currenciesData.length; i++) {
          $("#eftCurrencyList,#checkCurrencyList").append(
              "<option value='" +
              currenciesData[i].name + "' data-currency='" + currenciesData[i].code + "' />");
          //currencyList[i] = currenciesData[i].CRNCY_NM;
          //currencyCodes[i] = currenciesData[i].CRNCY_CD;
      }
  }

  function getBankDetailsByCountryCode (countryCode,currencyCode) {

      
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
      settings.url = $('#onetimepaymentServiceURL').val() + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode;
      $.ajax(settings).done(function(response) {
          if (response && response.getPaymentInfoByCountry && response.getPaymentInfoByCountry.length > 0) {
              console.log('response success ' + response.getPaymentInfoByCountry.length);
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
          }
      }).fail(function(response) {
          console.log('response fails ' + response);
          $('#dynamic-fields').empty();
          tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
          document.getElementById("system-error-note").style.display = 'block';
      });
  }



 
function saveData(){

    var dynamicFieldData=$("#dynamic-fields input[type=text].form-control");
    var dynamicData=[];

    $.each(dynamicFieldData, function(){
		dynamicData.push(this.value);
    });
    var saveDataObj={};
    saveDataObj["dynamicData"]=dynamicData;
    saveDataObj["eftCountry"]=$("#eftCountry").val();

    saveDataObj["bankName"]=$("#bankName").val();
    saveDataObj["bankAddress1"]=$("#bankAddress1").val();
    saveDataObj["bankAddress2"]=$("#bankAddress2").val();
    saveDataObj["bankAddress3"]=$("#bankAddress3").val();
    saveDataObj["bankAddress4"]=$("#bankAddress4").val();


    sessionStorage.setItem("saveData",JSON.stringify(saveDataObj));

}

function getSavedData(){
	var saveData= JSON.parse(sessionStorage.getItem("saveData"));
	if(saveData){
        if(saveData.eftCountry === $("#eftCountry").val()){
            return saveData;
        }else{
            sessionStorage.removeItem("saveData");
        }
    }
    return false;

}

function prefillSavedInfo(){
	var data=getSavedData();
	if(data){
		var dynamicData=data.dynamicData;        
		$("#bankName").val(data.bankName);
		$("#bankAddress1").val(data.bankAddress1);
		$("#bankAddress2").val(data.bankAddress2);
		$("#bankAddress3").val(data.bankAddress3);
		$("#bankAddress4").val(data.bankAddress4);
		var dynamicFieldData=$("#dynamic-fields").find("input[type=text].form-control");

console.log($("#dynamic-fields").find("input[type=text].form-control").length);
		$.each(dynamicFieldData, function(index){
			this.value=dynamicData[index];
		});
	}

}
$(window).bind('beforeunload',function(){
	sessionStorage.removeItem("saveData");
});

function isIEBrowser() {
	  var is_ie = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1
	  
	  return is_ie; 
}



