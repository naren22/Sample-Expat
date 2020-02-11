var memberErrorMsg = true;
    var providerErrorMsg = true;
    var providerCountryErrorMsg = true;
    var providerValidCountryErrorMsg = true;
    var providerCityErrorMsg = true;
    var billedAmountErrorMsg = true;
    var billedAmountValidErrorMsg = true;
    var billedAmountGreaterErrorMsg = true;
    var claimCurrencyErrorMsg = true;
    var claimValidCurrencyErrorMsg = true;
    var dateOfServiceErrorMsg = true;
    var dateOfServiceFutureErrorMsg = true;
    var diagnosisTextErrorMsg = true;
    var treatmentTextErrorMsg = true;

    var defaultCharValidation = /^[A-Za-z0-9.,&;'-\s]*$/; //providerCity, claimNickname, diagnosisText, treatmentText
var providerCharValidation = /^[\w &()"",.!#$\/:;@[\\_`‘’“”+_'ŽΑΒΕΗΘΙΞΟΠΡΣΤΩ\-–\]]*$/;
var countryCharValidation = /^[a-zA-Z&(),\.\-'\sÅôé]{0,100}$/;
 var billedAmountCharValidation = /^\d{0,10}(\.\d{0,3})?$/;
var currencyCharValidation = /^[A-Za-z.&'-\s]*$/;


var member = document.getElementById('member');
var provider = document.getElementById('provider');
var providerCountry = document.getElementById('providerCountry');
var providerCity = document.getElementById('providerCity');
var claimNickname = document.getElementById('claimNickname');
var billedAmount = document.getElementById('billedAmount');
var claimCurrency = document.getElementById('claimCurrency');
var dateOfService = document.getElementById('dateOfService');
var diagnosisText = document.getElementById('diagnosisText');
var treatmentText = document.getElementById('treatmentText');

var countryList = ["United States Of America", "Philippines", "India", "United Kingdom", "Australia", "Japan"];
var currencyList = ["US Dollar", "Philippine Peso", "Euro", "Singaporean Dollar", "South Korean Won",
    "New Zealand Dollar"
];

// white space checker
function whiteSpaceTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}
// end white space checker

function memberChecker() {
    if (whiteSpaceTrim(member.value.toString()) !== "") {
        document.getElementById('submit-claim-member-req-msg').style.display = "none";
        memberErrorMsg = false;
    } else {
        document.getElementById('submit-claim-member-req-msg').style.display = "block";
        memberErrorMsg = true;
    }
}

function providerChecker() {
    if (whiteSpaceTrim(provider.value.toString()) !== "") {
        document.getElementById('submit-claim-provider-req-msg').style.display = "none";
        providerErrorMsg = false;
    } else {
        document.getElementById('submit-claim-provider-req-msg').style.display = "block";
        providerErrorMsg = true;
    }
}

function providerCountryChecker() {
    if (whiteSpaceTrim(providerCountry.value.toString()) !== "") {
        document.getElementById('submit-claim-providercountry-req-msg').style.display = "none";
        providerCountryErrorMsg = false;
    } else {
        document.getElementById('submit-claim-providercountry-req-msg').style.display = "block";
        providerCountryErrorMsg = true;
    }
}

function providerCountryListChecker() {
    if (providerCountry.value !== "" && countryCharValidation.test(providerCountry.value)) {
        var matchedCountry = countryList.filter(function (country) {
            if (providerCountry.value.toUpperCase() === country.toUpperCase()) {
                return providerCountry.value;
            }
        });
        if (matchedCountry.length == 0) {
            providerValidCountryErrorMsg = true;
            document.getElementById('submit-claim-providercountry-invalid-msg').style.display = "block";
        } else {
            providerValidCountryErrorMsg = false;
            document.getElementById('submit-claim-providercountry-invalid-msg').style.display = "none";
        }
    }
}

function providerCityChecker() {
    if (whiteSpaceTrim(providerCity.value.toString()) !== "") {
        document.getElementById('submit-claim-providercity-req-msg').style.display = "none";
        providerCityErrorMsg = false;
    } else {
        document.getElementById('submit-claim-providercity-req-msg').style.display = "block";
        providerCityErrorMsg = true;
    }
}
var prev = 0;

function billedAmountChecker() {
    var billedAmountValue = billedAmount.value;
    if (whiteSpaceTrim(billedAmountValue.toString()) !== "") {
        document.getElementById('submit-claim-billed-amount-req-msg').style.display = "none";
        billedAmountErrorMsg = false;
    } else {
        document.getElementById('submit-claim-billed-amount-req-msg').style.display = "block";
        billedAmountErrorMsg = true;
    }
    if (parseFloat(billedAmountValue) > 0) {
        if (billedAmountCharValidation.test(billedAmountValue)) {
            document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "none";
            billedAmountGreaterErrorMsg = false;
            prev = parseFloat(billedAmountValue);
        } else if (prev > 0 && billedAmountCharValidation.test(billedAmountValue)) {

            billedAmountGreaterErrorMsg = false;
        }
    } else {
      /*  if (!prev > 0) {
            document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "block";
            billedAmountGreaterErrorMsg = true;
        } else if (parseFloat(billedAmountValue) == 0) {
            document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "block";
            billedAmountGreaterErrorMsg = true;*/
       
        if(billedAmountValue != "." && billedAmountValue != ".."){
          
            billedAmountValidErrorMsg = false;
            if (prev <= 0) {
                document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "block";
                billedAmountGreaterErrorMsg = true;
            } else if (parseFloat(billedAmountValue) == 0) {
                document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "block";
                billedAmountGreaterErrorMsg = true;
            }
        } else {
            document.getElementById('submit-claim-billed-amount-greater-msg').style.display = "none";
            billedAmountValidErrorMsg = true;
        }
    }
}

function claimCurrencyChecker() {
    if (whiteSpaceTrim(claimCurrency.value.toString()) !== "") {
        document.getElementById('submit-claim-currency-req-msg').style.display = "none";
        claimCurrencyErrorMsg = false;
    } else {
        document.getElementById('submit-claim-currency-req-msg').style.display = "block";
        claimCurrencyErrorMsg = true;
    }
}

function claimCurrencyListChecker() {
    if (claimCurrency.value !== "" && currencyCharValidation.test(claimCurrency.value)) {
        var matchedCurrency = currencyList.filter(function (country) {
            if (claimCurrency.value.toUpperCase() === country.toUpperCase()) {
                return claimCurrency.value;
            }
        });
        if (matchedCurrency.length == 0) {
            claimValidCurrencyErrorMsg = true;
            document.getElementById('submit-claim-currency-invalid-msg').style.display = "block";
        } else {
            claimValidCurrencyErrorMsg = false;
            document.getElementById('submit-claim-currency-invalid-msg').style.display = "none";
        }
    }
}

function dateOfServiceChecker() {
    if (whiteSpaceTrim(dateOfService.value.toString()) !== "") {
        document.getElementById('submit-claim-dateservice-req-msg').style.display = "none";
        dateOfServiceErrorMsg = false;
    } else {
        document.getElementById('submit-claim-dateservice-req-msg').style.display = "block";
        document.getElementById('submit-claim-dateservice-future-msg').style.display = 'none';
        dateOfServiceFutureErrorMsg = true;
        dateOfServiceErrorMsg = true;
    }
}

function dateOfServiceFutureChecker() {
    var formDate = new Date();
    var currentDate = new Date();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var inputDate = dateOfService.value.split("-");
    var inputMonth;
    if (inputDate.length === 3 && inputDate[2] !== " ") { /// check if inputdate is in format
        if (isNaN(inputDate[1])) { // check if month is in abbreviated Format
            inputMonth = months.indexOf(inputDate[1]) + 1; /// assign the numerical month
        } else { // else it is in number format
            inputMonth = inputDate[1];
            dateOfService.value = whiteSpaceTrim(inputDate[0].toString()) + "-" + months[inputMonth - 1] + "-" +
                whiteSpaceTrim(inputDate[2].toString()); /// re format the date of service into dd-Mmm-yyyy
        }
        if (inputMonth < 10) { /// convert number to string and add 0 if number is less than 10
            inputMonth = "0" + inputMonth.toString();
        }
        if (month < 10) { /// convert number to string and add 0 if number is less than 10
            month = "0" + month.toString();
        }
        if (day < 10) { /// convert number to string and add 0 if number is less than 10
            day = "0" + day.toString();
        }
        var newInputDate = whiteSpaceTrim(inputDate[2].toString()) + "-" + whiteSpaceTrim(inputMonth.toString()) +
            "-" + whiteSpaceTrim(inputDate[0].toString()); /// create the date into YYYY-MM-DD format
        var newCurrentDate = year.toString() + "-" + month.toString() + "-" + day.toString(); /// create the date into YYYY-MM-DD format
        formDate = new Date(newInputDate); /// format the input date 
        currentDate = new Date(newCurrentDate); /// format the current date 
        if (formDate > currentDate) { ///compare the two dates.
            document.getElementById('submit-claim-dateservice-future-msg').style.display = 'block';
            dateOfServiceFutureErrorMsg = true;
        } else {
            document.getElementById('submit-claim-dateservice-future-msg').style.display = 'none';
            dateOfServiceFutureErrorMsg = false;
        }
    }else{ /// else date is not in format
        dateOfServiceFutureErrorMsg = true;
    }
}


function diagnosisTextChecker() {
    if (whiteSpaceTrim(diagnosisText.value.toString()) !== "") {
        document.getElementById('submit-claim-diagnosis-req-msg').style.display = "none";
        diagnosisTextErrorMsg = false;
    } else {
        document.getElementById('submit-claim-diagnosis-req-msg').style.display = "block";
        diagnosisTextErrorMsg = true;
    }
}

function treatmentTextChecker() {
    if (whiteSpaceTrim(treatmentText.value.toString()) !== "") {
        document.getElementById('submit-claim-treatment-req-msg').style.display = "none";
        treatmentTextErrorMsg = false;
    } else {
        document.getElementById('submit-claim-treatment-req-msg').style.display = "block";
        diagnosisTextErrorMsg = true;
    }
}
["input", "blur", "change"].forEach(function (event) {
    member.addEventListener(event, function (event) {
        memberChecker();
    });
});
["input", "blur", "change"].forEach(function (event) {
    provider.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
    });
});
["input", "blur", "change"].forEach(function (event, index) {
    providerCountry.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCountryListChecker();
        if (index == 0 && providerCountry.value === "") {
            providerValidCountryErrorMsg = false;
            document.getElementById('submit-claim-providercountry-invalid-msg').style.display =
                "none";
         }
        var selectedCountry = providerCountry.value;
        var countryVal = countryList.filter(function (country) {
            if (selectedCountry.toUpperCase() === country.toUpperCase()) {
                return country;
            }
        });
        if (countryVal.length > 0) {
        	$('#providerCountry').val(countryVal[0]);
        	selectedCountry = countryVal[0];
        }
		//for binding provider country and claim currency
        var currencyCode =  $('#country').find("option[value=\""+ providerCountry.value + "\"]").attr('data-currency');
     //  var currencyCode =  $('#country').find("option[value='"+ selectedCountry + "']").attr('data-currency');
       var currencyName =  $('#currency').find("option[data-currency='"+ currencyCode + "']").val();
       //console.log(providerCountry.value);
        if(typeof(currencyName) != 'undefined'){
             $('#claimCurrency').val(currencyName);
      		 claimCurrencyListChecker();
            if (whiteSpaceTrim(claimCurrency.value.toString()) !== "") {
                document.getElementById('submit-claim-currency-req-msg').style.display = "none";
                claimCurrencyErrorMsg = false;
              } else {
                document.getElementById('submit-claim-currency-req-msg').style.display = "block";
                claimCurrencyErrorMsg = true;
              }
        } else{
			$('#claimCurrency').val('');
        }


	
    });
});
["input", "blur", "change"].forEach(function (event) {
    providerCity.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
    });
});
["input", "blur", "change"].forEach(function (event) {
    claimNickname.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
    });
});
["input", "blur", "change"].forEach(function (event, index) {
    billedAmount.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
        billedAmountChecker();
        if (index === 1 && billedAmount.value !== "") {

        	 billedAmount.value = parseFloat(billedAmount.value).toFixed(2).toFixed(3);
             //billedAmount.value = (billedAmount.value).toString();

        }
    });
});
["input", "blur", "change"].forEach(function (event, index) {
    claimCurrency.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
        billedAmountChecker();
        claimCurrencyChecker();
        claimCurrencyListChecker();
        if (index == 0 && claimCurrency.value === "") {
            claimCurrencyErrorMsg = false;
            document.getElementById('submit-claim-currency-invalid-msg').style.display = "none";
        }
    });
});
["input", "blur", "change"].forEach(function (event) {
    dateOfService.addEventListener(event, function () {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
        billedAmountChecker();
        claimCurrencyChecker();
        dateOfServiceChecker();
    });
});
dateOfService.addEventListener('blur', function (e) {
    dateOfServiceFutureChecker();
});

["input", "blur", "change"].forEach(function (event) {
    diagnosisText.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
        billedAmountChecker();
        claimCurrencyChecker();
        dateOfServiceChecker();
        diagnosisTextChecker();
    });
});
["input", "blur", "change"].forEach(function (event) {
    treatmentText.addEventListener(event, function (event) {
        memberChecker();
        providerChecker();
        providerCountryChecker();
        providerCityChecker();
        billedAmountChecker();
        claimCurrencyChecker();
        dateOfServiceChecker();
        diagnosisTextChecker();
        treatmentTextChecker();
    });
});
// Restricts input for the given textbox to the given inputFilter.
function setInputFilterNumber(textbox, inputFilter) {
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

setInputFilterNumber(billedAmount, function (value) {
    if (billedAmountCharValidation.test(value)) {
        document.getElementById('submit-claim-billed-amount-valid-msg').style.display = "none";
        if (value.split(".")[1] !== "") {
            billedAmountValidErrorMsg = false;
            document.getElementById('submit-claim-billed-amount-valid-msg').style.display = "none";
        }
       // } else {
         //   billedAmountValidErrorMsg = true;
         //   document.getElementById('submit-claim-billed-amount-valid-msg').style.display = "block";
       // }

        return billedAmountCharValidation.test(value);
    } else {
        if (isNaN(value[value.length - 1])) {
            document.getElementById('submit-claim-billed-amount-valid-msg').style.display = "block";
        } else {
            document.getElementById('submit-claim-billed-amount-valid-msg').style.display = "none";
        }
    }
});
/// start of filter text in provider, provider city, claim nickname, diagnosis and treament
function setInputFilterText(textbox, inputFilter) {
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
/// check provider, provider city, claim nickname, diagnosis and treament for input by regex 
function setInputFilterProvider(textbox, inputFilter) {
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
setInputFilterProvider(provider, function (value) {
    if (providerCharValidation.test(value)) {
        document.getElementById('submit-claim-provider-char-msg').style.display = "none";
        return providerCharValidation.test(value);
    } else {
        document.getElementById('submit-claim-provider-char-msg').style.display = "block";
    }
});
[providerCity, claimNickname, diagnosisText, treatmentText].forEach(
    function (field, index) {
        setInputFilterText(field, function (value) {
            if (defaultCharValidation.test(value)) {
                switch (index) {
                    case 0: //providerCity
                        {
                            document.getElementById('submit-claim-providercity-char-msg').style.display =
                            "none";
                            break;
                        }
                    case 1: //claimNickname
                        {
                            document.getElementById('submit-claim-nickname-char-msg').style.display =
                            "none";
                            break;
                        }
                    case 2: //diagnosisText
                        {
                            document.getElementById('submit-claim-diagnosis-char-msg').style.display =
                            "none";
                            break;
                        }
                    case 3: //treatmentText
                        {
                            document.getElementById('submit-claim-treatment-char-msg').style.display =
                            "none";
                            break;
                        }
                    default:
                        break;
                }
                return defaultCharValidation.test(value);
            } else {
                switch (index) {
                    case 0:
                        {
                            document.getElementById('submit-claim-providercity-char-msg').style.display =
                            "block";
                            break;
                        }
                    case 1:
                        {
                            document.getElementById('submit-claim-nickname-char-msg').style.display =
                            "block";
                            break;
                        }
                    case 2:
                        {
                            document.getElementById('submit-claim-diagnosis-char-msg').style.display =
                            "block";
                            break;
                        }
                    case 3:
                        {
                            document.getElementById('submit-claim-treatment-char-msg').style.display =
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
/// end of filter text in provider, provider city, claim nickname, diagnosis and treament

/// start of filter text in provider country and currency
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
setInputFilterCountry(providerCountry, function (value) {
    if (countryCharValidation.test(value)) {
        document.getElementById('submit-claim-providercountry-char-msg').style.display = "none";
        return countryCharValidation.test(value);
    } else {
        document.getElementById('submit-claim-providercountry-char-msg').style.display = "block";
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
setInputFilterCurrency(claimCurrency, function (value) {
    if (currencyCharValidation.test(value)) {
        document.getElementById('submit-claim-currency-char-msg').style.display = "none";
        return currencyCharValidation.test(value);
    } else {
        document.getElementById('submit-claim-currency-char-msg').style.display = "block";
    }
});

/// end of filter text in provider country and currency

/// start change button color functionality
function setInputFilterUploadFileButton(textbox) {
    ["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (!memberErrorMsg && !providerErrorMsg && !providerCountryErrorMsg && !
                providerValidCountryErrorMsg && !providerCityErrorMsg && !
                billedAmountErrorMsg && !billedAmountGreaterErrorMsg && !billedAmountValidErrorMsg &&
                !claimCurrencyErrorMsg && !claimValidCurrencyErrorMsg && !dateOfServiceErrorMsg &&
                !dateOfServiceFutureErrorMsg &&
                !diagnosisTextErrorMsg && !treatmentTextErrorMsg) {
                document.getElementById("submit-claim-info-btn").style.backgroundColor = '#0D880B'; ///$primary2-color
            } else {
                document.getElementById("submit-claim-info-btn").style.backgroundColor = '#5a6268';
            }
        });
    });
}
/// check field for every events if the required and error validations check
/// change color of button if there are no error messages
[member, provider, providerCountry, providerCity, billedAmount, claimCurrency, dateOfService, diagnosisText,
    treatmentText
].forEach(
    function (field, index) {
        setInputFilterUploadFileButton(field);
    }
);
/// end change button color functionality

function submitClaimInfo() { ///// triggred by upload files btn
	formErrors = [];
	tagPublishPostPageData($('#submit-claim-info-btn').text(),'trackNewClaimSubmitLinkClick');
    memberChecker(); /// re check the fields before submit
    providerChecker();
    providerCountryChecker();
    providerCountryListChecker();
    providerCityChecker();
    billedAmountChecker();
    claimCurrencyChecker();
    claimCurrencyListChecker();
    dateOfServiceChecker();
    diagnosisTextChecker();
    treatmentTextChecker();

    ///// check if there still required or error fields if none submit the form
    if (!memberErrorMsg && !providerErrorMsg && !providerCountryErrorMsg && !providerValidCountryErrorMsg && !
        providerCityErrorMsg && !billedAmountErrorMsg && !billedAmountGreaterErrorMsg && !billedAmountValidErrorMsg &&
        !claimCurrencyErrorMsg && !claimValidCurrencyErrorMsg && !dateOfServiceErrorMsg && !
        dateOfServiceFutureErrorMsg && !diagnosisTextErrorMsg &&
        !treatmentTextErrorMsg) {
        document.getElementById("system-error-note-loader").style.display = 'block';
        window.setTimeout(
            function () {
                document.getElementById("system-error-note-loader").style.display = 'none';
             //   document.getElementById("system-error-note").style.display = 'block';
				setStep1DataInSessionStorage();
                manageStep.handleClaimStep(2);
            }, 500);
    }
    
    var errorArr = [];
    $.each($('.form-group .text-danger:visible'), function(){
		errorArr.push({"errorname" : this.innerHTML});
	});
    tagFormErrorStep1(errorArr,'trackFormErrorLoad');
}

function closeSystemErrorNote() { // close the system error note
    document.getElementById("system-error-note-loader").style.display = 'none';
    document.getElementById("system-error-note").style.display = 'none';
}

window.onload = function checkFields() { /// to check the current fields when page is refreshed
    if (whiteSpaceTrim(member.value.toString()) != '') {
        memberChecker();
    }
    if (whiteSpaceTrim(provider.value.toString()) != '') {
        providerChecker();
    }
    if (whiteSpaceTrim(providerCountry.value.toString()) != '') {
        providerCountryChecker();
    }
    if (whiteSpaceTrim(provider.value.toString()) != '') {
        providerCountryListChecker();
    }
    if (whiteSpaceTrim(providerCity.value.toString()) != '') {
        providerCityChecker();
    }
    if (whiteSpaceTrim(billedAmount.value.toString()) != '') {
        billedAmountValidErrorMsg = false;
        billedAmountChecker();
    }
    if (whiteSpaceTrim(claimCurrency.value.toString()) != '') {
        claimCurrencyChecker();
    }
    if (whiteSpaceTrim(claimCurrency.value.toString()) != '') {
        claimCurrencyListChecker();
    }
    if (whiteSpaceTrim(dateOfService.value.toString()) != '') {
        dateOfServiceChecker();
        dateOfServiceFutureChecker();
    }
    if (whiteSpaceTrim(diagnosisText.value.toString()) != '') {
        diagnosisTextChecker();
    }
    if (whiteSpaceTrim(treatmentText.value.toString()) != '') {
        treatmentTextChecker();
    }
}

function setStep1DataInSessionStorage(){
	
	var step1_data = {};
	step1_data.memberInfo = $("#member option:selected").text();
	step1_data.memberName = $('#member').val();
	step1_data.providerName = $('#provider').val();
	step1_data.providerCountry = $('#providerCountry').val();
	step1_data.providerCity = $('#providerCity').val();
	step1_data.claimNickName = $('#claimNickname').val();
	step1_data.billedAmount =$('#billedAmount').val();
	step1_data.billedCurrency = $('#claimCurrency').val();
	step1_data.dateOfService = $('#dateOfService').val();
	step1_data.diagnosisText = $('#diagnosisText').val();
	step1_data.treatmentDescription = $('#treatmentText').val();
	
    sessionStorage.setItem('step1_data', JSON.stringify(step1_data));
}

$(document).ready(function(){
	$('.claim-info-fields .form-control').click(function(){
		formErrors = [];
	});
});