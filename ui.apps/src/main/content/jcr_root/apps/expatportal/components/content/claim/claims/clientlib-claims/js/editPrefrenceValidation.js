
    var eftSelected = false;
    var checkSelected = false;

    var eftPayeeName = document.getElementById('eftPayeeName-edit');
    var eftCountry = document.getElementById('eftCountry-edit');
    var eftCurrency = document.getElementById('eftCurrency-edit');
    var eftBankName = document.getElementById('bankName-edit');
    var eftBankAdd1 = document.getElementById('bankAddress1-edit');
    var eftBankAdd2 = document.getElementById('bankAddress2-edit');
    var eftBankAdd3 = document.getElementById('bankAddress3-edit');
    var eftBankAdd4 = document.getElementById('bankAddress4-edit');

    var checkPayeeName = document.getElementById('checkPayeeName-edit');
    var checkCountry = document.getElementById('checkCountry-edit');
    var checkCurrency = document.getElementById('checkCurrency-edit');

    var countryList = ["United States Of America", "Philippines", "India", "United Kingdom", "Australia", "Japan"];
    var currencyList = ["US Dollar", "Philippine Peso", "Euro", "Singaporean Dollar", "South Korean Won",
        "New Zealand Dollar"
    ];
    var payeeNameCharValidation = /^[A-Za-z0-9.&'-\s]*$/;
    var countryCharValidation = /^[a-zA-Z&(),\.\-'\sÅôé]{0,100}$/;
    var currencyCharValidation = /^[A-Za-z.&'-\s]*$/;
    var bankCharValidation;
    var addressCharValidation;

    var BankNameCharValidationMsg = document.getElementById('bankname-eft-char-msg-edit');
    var addressCharValidationMsg1 = document.getElementById('bankaddress1-eft-char-msg-edit');
    var addressCharValidationMsg2 = document.getElementById('bankaddress2-eft-char-msg-edit');
    var addressCharValidationMsg3 = document.getElementById('bankaddress3-eft-char-msg-edit');
    var addressCharValidationMsg4 = document.getElementById('bankaddress4-eft-char-msg-edit');

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

    var dynamicFields = {
        bankDetails: [{
            label: "SWIFT Code",
            attributeType: "SWIFT",
            regex: "^(([a-zA-Z0-9]{8})|([a-zA-Z0-9]{11}))$",
            errorMessage: "EFT field error : Please enter valid SWIFT Code of either 8 or 11 characters in length & alphanumeric",
            maxLength: 11,
            isReq: true,
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
        document.getElementById('method-check-req-msg-edit').style.display = "none";
        document.getElementById('eft-method-edit').style.display = "block";

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
        var field = document.getElementById(data.attributeType);
        if (data.isReq) {
            var errorId = data.attributeType + "-req-msg-edit"
            if (field != null) {
                if (whiteSpaceTrim(field.value.toString()) !== "") {
                    document.getElementById(errorId).style.display = "none";
                    data.fieldRequiredError = false;
                } else {
                    document.getElementById(errorId).style.display = "block";
                    tagFormError(document.getElementById(errorId).innerHTML,'trackFormErrorLoad');
                    data.fieldRequiredError = true;
                }
            }
        }
    }

    function dynamicBankingFieldRequiredChecker(data) { /// dynamic function for required fields
        var field = document.getElementById(data.attributeType);
        ["input", "blur", "change"].forEach(function (event) {
            field.addEventListener(event, function (event) {
                dynamicBankingFieldRequiredValidation(data);
            });
        });
    }

    function displayDynamicFields() { /// dynamic banking fields builder
        var dynamicBankingFieldsHTML = document.getElementById("dynamic-reference").children[0]; // get reference html

        dynamicFields.bankDetails.forEach(function (data) {
            var cloneHTML = dynamicBankingFieldsHTML.cloneNode(true); /// clone a reference html for dynamic banking field

            cloneHTML.classList.remove("hidden-banking-dynamic-container"); /// remove hidden on the cloned html

            cloneHTML.children[1].children[0].setAttribute("aria-labelledby", data.label); /// add aria-labelledby to input field
            if (data.isReq) { /// add require label and error message
                cloneHTML.children[0].children[0].innerHTML = data.label + "*"; // add required indicator
                cloneHTML.children[1].children[1].innerHTML = data.label + " is required."; // add required message
                cloneHTML.children[1].children[1].id = data.attributeType + "-req-msg-edit"; // add ID for required message
            } else { /// add label 
                cloneHTML.children[0].children[0].innerHTML = data.label; // display not required label
            }

            cloneHTML.children[1].children[0].id = data.attributeType; /// set ID of the input field
            cloneHTML.children[1].children[0].maxLength = data.maxLength; /// set maximum character
            if (data.regex && data.regex !== "null" && data.regex !== "NULL" && data.regex !== null && data.regex !==
                "") {
                cloneHTML.children[1].children[2].innerHTML = data.errorMessage; // add regex error message
                cloneHTML.children[1].children[2].id = data.attributeType + "-char-msg-edit";
            }
            document.getElementById('dynamic-fields-edit').appendChild(cloneHTML); /// append the created field
            dynamicBankingFieldRequiredChecker(data); /// create a dynamic required checker field for dynamic banking fields

            var dynamicInputID = document.getElementById(data.attributeType);
            setInputFilterDynamicBankingFields(dynamicInputID, function (value) { /// create a dynamic character checker for dynamic banking fields
                var fieldRegex = new RegExp(data.regex);
                if (fieldRegex.test(value)) {
                    document.getElementById(data.attributeType + "-char-msg-edit").style.display = "none";
                    data.fieldCharacterError = false;
                    return fieldRegex.test(value);
                } else {
                    if (value) {
                        document.getElementById(data.attributeType + "-char-msg-edit").style.display =
                            "block";
                        tagFormError(document.getElementById(data.attributeType + "-char-msg-edit").innerHTML,'trackFormErrorLoad');
                        data.fieldCharacterError = true;
                    } else {
                        document.getElementById(data.attributeType + "-char-msg-edit").style.display =
                            "none";
                        data.fieldCharacterError = false;
                    }

                }
            });
        });
    }

    var createdBankingFields = false;
    function eftFunction() { /// when eft selector method clicked
        eftSelected = true;
        checkSelected = false;
        document.getElementById('method-check-req-msg-edit').style.display = "none";
        document.getElementById('eft-method-edit').style.display = "block";
        document.getElementById('check-method-edit').style.display = "none";
        document.getElementById("eftTxt-edit").style.color = "white";
        $('.eft-selector-edit').css("background-color", "#003DA1");
        document.getElementById("checkTxt-edit").style.color = "black";
        $('.check-selector-edit').css("background-color", "white");
        if (eftSelected && whiteSpaceTrim(eftCountry.value.toString()) !== "" && whiteSpaceTrim(eftCurrency.value.toString()) !==
            "" && eftSelected && !currencyEftValidError && !countryEftValidError) {

            document.getElementById('bnkNme-edit').removeAttribute('hidden');
            if (!createdBankingFields) { /// create a dynamic fields when there is a valid country and currency
                displayDynamicFields();
                createdBankingFields = true;
            }
            document.getElementById('bnkAdd1-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd2-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd3-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd4-edit').removeAttribute('hidden');
        } else { /// remove dynamic fields when there is no valid country and currency
            var list = document.getElementById('dynamic-fields-edit');
            while (list.hasChildNodes()) {
                createdBankingFields = false;
                list.removeChild(list.firstChild);
            }
        }
    }

    function checkFunction() { /// when check selector method clicked
        checkSelected = true;
        eftSelected = false;
        document.getElementById('method-check-req-msg-edit').style.display = "none";
        document.getElementById('check-method-edit').style.display = "block";
        document.getElementById('eft-method-edit').style.display = "none";
        document.getElementById("eftTxt-edit").style.color = "black";
        $('.eft-selector-edit').css("background-color", "white");
        document.getElementById("checkTxt-edit").style.color = "white";
        $('.check-selector-edit').css("background-color", "#003DA1");
    }

    /// start eft fields checker
    function payeeNameEftChecker() {
        if (whiteSpaceTrim(eftPayeeName.value.toString()) !== "") {
            document.getElementById('payee-name-eft-req-msg-edit').style.display = "none";
            payeeNameEftError = false;
        } else {
            document.getElementById('payee-name-eft-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('payee-name-eft-req-msg-edit').innerHTML,'trackFormErrorLoad');
            payeeNameEftError = true;
        }
    }

    function countryEftChecker() {
        if (whiteSpaceTrim(eftCountry.value.toString()) !== "") {
            document.getElementById('country-eft-req-msg-edit').style.display = "none";
            countryEftError = false;
        } else {
            document.getElementById('country-eft-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('country-eft-req-msg-edit').innerHTML,'trackFormErrorLoad');
            document.getElementById('country-eft-valid-msg-edit').style.display = "none";
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
                document.getElementById('country-eft-valid-msg-edit').style.display = "block";
                tagFormError(document.getElementById('country-eft-valid-msg-edit').innerHTML,'trackFormErrorLoad');
            } else {
                countryEftValidError = false;
                document.getElementById('country-eft-valid-msg-edit').style.display = "none";
            }
        }
    }

    function currencyEftChecker() {
        if (whiteSpaceTrim(eftCurrency.value.toString()) !== "") {
            document.getElementById('currency-eft-req-msg-edit').style.display = "none";
            currencyEftError = false;
        } else {
            document.getElementById('currency-eft-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('currency-eft-req-msg-edit').innerHTML,'trackFormErrorLoad');
            document.getElementById('currency-eft-valid-msg-edit').style.display = "none";
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
                document.getElementById('currency-eft-valid-msg-edit').style.display = "block";
                tagFormError(document.getElementById('currency-eft-req-msg-edit').innerHTML,'trackFormErrorLoad');
            } else {
                currencyEftValidError = false;
                document.getElementById('currency-eft-valid-msg-edit').style.display = "none";
            }
        }
    }

    function displayBankingDetailsForm() {
        if (whiteSpaceTrim(eftCountry.value.toString()) !== "" && whiteSpaceTrim(eftCurrency.value.toString()) !== "" &&
            eftSelected && !currencyEftValidError && !countryEftValidError) {
            document.getElementById('bnkNme-edit').removeAttribute('hidden');
            if (!createdBankingFields) {
                displayDynamicFields();
                createdBankingFields = true;
            }
            document.getElementById('bnkAdd1-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd2-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd3-edit').removeAttribute('hidden');
            document.getElementById('bnkAdd4-edit').removeAttribute('hidden');
        } else {
            document.getElementById('bnkNme-edit').hidden = true;
            var list = document.getElementById('dynamic-fields-edit');
            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
                createdBankingFields = false;
            }
            document.getElementById('bnkAdd1-edit').hidden = true;
            document.getElementById('bnkAdd2-edit').hidden = true;
            document.getElementById('bnkAdd3-edit').hidden = true;
            document.getElementById('bnkAdd4-edit').hidden = true;
        }
    }

    function bankNameEftChecker() {
        if (whiteSpaceTrim(eftBankName.value.toString()) !== "") {
            document.getElementById('bankname-eft-req-msg-edit').style.display = "none";
            bankNameEftError = false;
        } else {
            if (!countryEftError && !currencyEftError && !countryEftValidError && !currencyEftValidError && (
                    checkSelected || eftSelected)) {
                document.getElementById('bankname-eft-req-msg-edit').style.display = "block";
                tagFormError(document.getElementById('bankname-eft-req-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('payee-name-eft-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-eft-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('payee-name-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('country-eft-char-msg-edit').style.display = "none";
            return countryCharValidation.test(value);
        } else {
            document.getElementById('country-eft-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('country-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('currency-eft-char-msg-edit').style.display = "none";
            return currencyCharValidation.test(value);
        } else {
            document.getElementById('currency-eft-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('currency-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('bankname-eft-char-msg-edit').style.display = "none";
            return bankCharValidation.test(value);
        } else {
            document.getElementById('bankname-eft-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('bankname-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
                                document.getElementById('bankaddress1-eft-char-msg-edit').style.display =
                                "none";
                                break;
                            }
                        case 1: //eftBankAdd2
                            {
                                document.getElementById('bankaddress2-eft-char-msg-edit').style.display =
                                "none";
                                break;
                            }
                        case 2: //eftBankAdd3
                            {
                                document.getElementById('bankaddress3-eft-char-msg-edit').style.display =
                                "none";
                                break;
                            }
                        case 3: //eftBankAdd4
                            {
                                document.getElementById('bankaddress4-eft-char-msg-edit').style.display =
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
                                document.getElementById('bankaddress1-eft-char-msg-edit').style.display =
                                "block";
                                tagFormError(document.getElementById('bankaddress1-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
                                break;
                            }
                        case 1:
                            {
                                document.getElementById('bankaddress2-eft-char-msg-edit').style.display =
                                "block";
                                tagFormError(document.getElementById('bankaddress2-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
                                break;
                            }
                        case 2:
                            {
                                document.getElementById('bankaddress3-eft-char-msg-edit').style.display =
                                "block";
                                tagFormError(document.getElementById('bankaddress3-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
                                break;
                            }
                        case 3:
                            {
                                document.getElementById('bankaddress4-eft-char-msg-edit').style.display =
                                "block";
                                tagFormError(document.getElementById('bankaddress4-eft-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            payeeNameEftChecker();
            countryEftChecker();
            countryEftListChecker();
            displayBankingDetailsForm();
        });
    });
    ["input", "blur", "change"].forEach(function (event) {
        eftCurrency.addEventListener(event, function (event) {
            payeeNameEftChecker();
            countryEftChecker();
            countryEftListChecker();
            currencyEftChecker();
            currencyEftListChecker();
            displayBankingDetailsForm();
        });
    });
    ["input", "blur", "change"].forEach(function (event) {
        eftBankName.addEventListener(event, function (event) {
            payeeNameEftChecker();
            countryEftChecker();
            countryEftListChecker();
            currencyEftChecker();
            currencyEftListChecker();
            displayBankingDetailsForm();
            bankNameEftChecker();
        });
    });
    //// end of field events 
    ///////////////////////////////////////////////////////////////////////////////////////
    // Start of check Method Validation
    function payeeNameCheckChecker() {
        if (whiteSpaceTrim(checkPayeeName.value.toString()) !== "") {
            document.getElementById('payee-name-check-req-msg-edit').style.display = "none";
            payeeNameCheckError = false;
        } else {
            document.getElementById('payee-name-check-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('payee-name-check-req-msg-edit').innerHTML,'trackFormErrorLoad');
            payeeNameCheckError = true;
        }
    }

    function countryCheckChecker() {
        if (whiteSpaceTrim(checkCountry.value.toString()) !== "") {
            document.getElementById('country-check-req-msg-edit').style.display = "none";
            countryCheckError = false;
        } else {
            document.getElementById('country-check-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('country-check-req-msg-edit').innerHTML,'trackFormErrorLoad');
            document.getElementById('country-check-valid-msg-edit').style.display = "none";
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
                document.getElementById('country-check-valid-msg-edit').style.display = "block";
                tagFormError(document.getElementById('country-check-valid-msg-edit').innerHTML,'trackFormErrorLoad');
            } else {
                countryCheckValidError = false;
                document.getElementById('country-check-valid-msg-edit').style.display = "none";
            }
        }
    }

    function currencyCheckChecker() {
        if (whiteSpaceTrim(checkCurrency.value.toString()) !== "") {
            document.getElementById('currency-check-req-msg-edit').style.display = "none";
            currencyCheckError = false;
        } else {
            document.getElementById('currency-check-req-msg-edit').style.display = "block";
            tagFormError(document.getElementById('currency-check-req-msg-edit').innerHTML,'trackFormErrorLoad');
            document.getElementById('currency-check-valid-msg-edit').style.display = "none";
            currencyCheckError = true;
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
                document.getElementById('currency-check-valid-msg-edit').style.display = "block";
                tagFormError(document.getElementById('currency-check-valid-msg-edit').innerHTML,'trackFormErrorLoad');
            } else {
                currencyCheckValidError = false;
                document.getElementById('currency-check-valid-msg-edit').style.display = "none";
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
            payeeNameCheckChecker();
            countryCheckChecker();
            countryCheckListChecker();
        });
    });
    ["input", "blur", "change"].forEach(function (event) {
        checkCurrency.addEventListener(event, function (event) {
            payeeNameCheckChecker();
            countryCheckChecker();
            countryCheckListChecker();
            currencyCheckChecker();
            currencyCheckListChecker();
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
            document.getElementById('payee-name-check-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-check-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('payee-name-check-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('country-check-char-msg-edit').style.display = "none";
            return countryCharValidation.test(value);
        } else {
            document.getElementById('country-check-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('country-check-char-msg-edit').innerHTML,'trackFormErrorLoad');
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
            document.getElementById('currency-check-char-msg-edit').style.display = "none";
            return currencyCharValidation.test(value);
        } else {
            document.getElementById('currency-check-char-msg-edit').style.display = "block";
            tagFormError(document.getElementById('currency-check-char-msg-edit').innerHTML,'trackFormErrorLoad');
        }
    });

    
    /// end of handle restricted character validation input for check

    function removeAllMessages() { /// remove existing messeges that being display
        document.getElementById('payee-name-check-req-msg-edit').style.display = "none";
        document.getElementById('payee-name-check-char-msg-edit').style.display = "none";
        document.getElementById('country-check-req-msg-edit').style.display = "none";
        document.getElementById('country-check-valid-msg-edit').style.display = "none";
        document.getElementById('country-check-char-msg-edit').style.display = "none";
        document.getElementById('currency-check-req-msg-edit').style.display = "none";
        document.getElementById('currency-check-valid-msg-edit').style.display = "none";
        document.getElementById('currency-check-char-msg-edit').style.display = "none";

        document.getElementById('payee-name-eft-req-msg-edit').style.display = "none";
        document.getElementById('payee-name-eft-char-msg-edit').style.display = "none";
        document.getElementById('country-eft-req-msg-edit').style.display = "none";
        document.getElementById('country-eft-valid-msg-edit').style.display = "none";
        document.getElementById('country-eft-char-msg-edit').style.display = "none";
        document.getElementById('currency-eft-req-msg-edit').style.display = "none";
        document.getElementById('currency-eft-valid-msg-edit').style.display = "none";
        document.getElementById('currency-eft-char-msg-edit').style.display = "none";
        document.getElementById('bankname-eft-req-msg-edit').style.display = "none";

        document.getElementById('method-check-req-msg-edit').style.display = "none";
    }

    function savePref() {
    	formErrors = [];
        // verify submit
        if (checkSelected) {
            document.getElementById('method-check-req-msg-edit').style.display = "none";
            payeeNameCheckChecker(); /// recheck fields before to submit
            countryCheckChecker();
            countryCheckListChecker();
            currencyCheckChecker();
            currencyCheckListChecker();
        } else if (eftSelected) {
            // var bankingFieldsHasError = true;
            document.getElementById('method-check-req-msg-edit').style.display = "none";
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
            document.getElementById('method-check-req-msg-edit').style.display = "block"; /// display error messege if no method selected
            tagFormError(document.getElementById('method-check-req-msg-edit').innerHTML,'trackFormErrorLoad');
        }
        if (checkSelected && !payeeNameCheckError && !countryCheckError && !countryCheckValidError && !
            currencyCheckError && !currencyCheckValidError) { // if check method no error messeges exist in order ro submit
            removeAllMessages(); // if success remove all existing messeges
            document.getElementById("system-error-note-loader").style.display = 'block';
            window.setTimeout(
                function () {
                    document.getElementById("system-error-note-loader").style.display = 'none';
                    tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
                    document.getElementById("system-error-note").style.display = 'block';
                }, 5000);
        }

        if (eftSelected && !payeeNameEftError && !countryEftError && !countryEftValidError && !currencyEftError && !
            currencyEftValidError && !bankNameEftError && !dynamicBankingFieldsReq & !dynamicBankingFieldsChar) { // if eft method no error messeges exist in order ro submit
            removeAllMessages(); // if success remove all existing messeges
            document.getElementById("system-error-note-loader").style.display = 'block';
            window.setTimeout(
                function () {
                    document.getElementById("system-error-note-loader").style.display = 'none';
                    tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
                    document.getElementById("system-error-note").style.display = 'block';
                }, 5000);
        }

    }

    function closeSystemErrorNote() {
        document.getElementById("system-error-note-loader").style.display = 'none';
        document.getElementById("system-error-note").style.display = 'none';
    }

    function cancelPref() {
    	formErrors = [];
        removeAllMessages(); // if cancel remove all existing messeges and redirect to specific page
        window.location.href = '../myuhc2-submit-claim/03.00.01-review-submit-claim-subscriber.html';
    }

