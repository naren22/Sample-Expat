var countryBankPreference = []; 
function getBankDetailsByCountryCodeEdit (countryCode , values, currencyCode) {
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
      settings.url = $('#onetimepaymentServiceURL').val() + "?countryCode=" + countryCode+"&currencyCode="+currencyCode;
      $.ajax(settings).done(function(response) {
          if (response && response.getPaymentInfoByCountry && response.getPaymentInfoByCountry.length > 0) {

              /*  // Global Pagedatalayer  
                
              /*  window.pageDataLayer = {
                
                    "content": {
                        "pageName": $('title').text(), //title of the page rendered on screen
                        "siteSectionL1": "",// section name L1 [site URL breadcrumb level 1 within which page is present]           
                        "siteSectionL2": "", // section name L2 within which page is present, [site URL breadcrumb level 2 within which page is present]           
                        "website": "uhcglobalinsurance",
                        "businessUnit": "uhc",
                        "referringSite": "", // not applicable, if the page is not accessed via other internal sites
                        "language": "en" // if the Language is always english, the Adobe analytics team will set the value as default "en" through Adobe DTM (this property will be optional)
                             }
                };

                _satellite.track('trackClaimSubmitPageLoad');*/
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

              document.getElementById('bnkNme-edit').removeAttribute('hidden');
             // if (!createdBankingFieldsEdit) {
              if(values != null && dynamicFields.bankDetails.length != values.length){
            	  var dynamicValuesEdit={};
            	  for(i=0;i<countryBankPreference.length;i++){
          			var key =countryBankPreference[i].atrributeDescription;
                      if(key){
                     		var val = globalJsonResp['BNK_DTL_'+countryBankPreference[i].attributeLineNumber+'_TXT'];
                     		dynamicValuesEdit[key]=val;
                      }

                  }
            	  displayDynamicFieldsEdit(dynamicValuesEdit);
              } else{
            	  displayDynamicFieldsEdit(values);
              }                  
                  createdBankingFieldsEdit = true;
            //  }
              document.getElementById('bnkAdd1-edit').removeAttribute('hidden');
              document.getElementById('bnkAdd2-edit').removeAttribute('hidden');
              document.getElementById('bnkAdd3-edit').removeAttribute('hidden');
              document.getElementById('bnkAdd4-edit').removeAttribute('hidden');
              
          } else {
              console.log('response success zero result ' + response.length);
              $('#dynamic-fields-edit').empty("");
              dynamicFields.bankDetails = []
              document.getElementById('bnkNme-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd1-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd2-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd3-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd4-edit').removeAttribute('hidden');
;
          }
      }).fail(function(response) {
          console.log('response fails ' + response);
          tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
          document.getElementById("system-error-note").style.display = 'block';
           console.log('response success zero result ' + response.length);
           $('#dynamic-fields-edit').empty("");
           dynamicFields.bankDetails = []
           /*
           document.getElementById('bnkNme-edit').setAttribute('hidden','hidden');
           document.getElementById('bnkAdd1-edit').setAttribute('hidden','hidden');
           document.getElementById('bnkAdd2-edit').setAttribute('hidden','hidden');
           document.getElementById('bnkAdd3-edit').setAttribute('hidden','hidden');
           document.getElementById('bnkAdd4-edit').setAttribute('hidden','hidden');*/           
           
           document.getElementById('bnkNme-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd1-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd2-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd3-edit').removeAttribute('hidden');
			  document.getElementById('bnkAdd4-edit').removeAttribute('hidden');
      });
  }

 function displayDynamicFieldsEdit(values) { /// dynamic banking fields builder
        var dynamicBankingFieldsHTML = document.getElementById("dynamic-reference-edit").children[0]; // get reference html
		document.getElementById('dynamic-fields-edit').innerHTML="";
        dynamicFields.bankDetails.forEach(function (data) {
            var cloneHTML = dynamicBankingFieldsHTML.cloneNode(true); /// clone a reference html for dynamic banking field
            data.attributeType= data.attributeType+"-edit";

            cloneHTML.classList.remove("hidden-banking-dynamic-container"); /// remove hidden on the cloned html

            cloneHTML.children[1].children[0].setAttribute("aria-labelledby", data.label); /// add aria-labelledby to input field

            if(values){  
                cloneHTML.children[1].children[0].value= values[data.label];
            }
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
            document.getElementById('dynamic-fields-edit').appendChild(cloneHTML); /// append the created field
            dynamicBankingFieldRequiredChecker(data); /// create a dynamic required checker field for dynamic banking fields

            var dynamicInputID = document.getElementById(data.attributeType);
            setInputFilterDynamicBankingFields(dynamicInputID, function (value) { /// create a dynamic character checker for dynamic banking fields
                var fieldRegex = new RegExp(data.regex);
                if(data.regex){
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

function setEditValidation(){
	var checkPayeeNameEdit = document.getElementById('checkPayeeName-edit');
    var checkCountryEdit = document.getElementById('checkCountry-edit');
    var checkCurrencyEdit = document.getElementById('checkCurrency-edit');
	var eftPayeeNameEdit = document.getElementById('eftPayeeName-edit');
    var eftCountryEdit = document.getElementById('eftCountry-edit');
    var eftCurrencyEdit = document.getElementById('eftCurrency-edit');


    var eftBankNameEdit = document.getElementById('bankName-edit');
    var eftBankAdd1Edit = document.getElementById('bankAddress1-edit');
    var eftBankAdd2Edit = document.getElementById('bankAddress2-edit');
    var eftBankAdd3Edit = document.getElementById('bankAddress3-edit');
    var eftBankAdd4Edit = document.getElementById('bankAddress4-edit');

    setInputFilterPayeeName(checkPayeeNameEdit, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('payee-name-check-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-check-char-msg-edit').style.display = "block";
        }
    });
    setInputRequiredFilter(checkPayeeNameEdit,'payee-name-check-req-msg-edit');

    setInputFilterPayeeName(eftBankAdd1Edit, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('bankaddress1-eft-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('bankaddress1-eft-char-msg-edit').style.display = "block";
        }
    });


     setInputFilterPayeeName(eftBankAdd2Edit, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('bankaddress2-eft-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('bankaddress2-eft-char-msg-edit').style.display = "block";
        }
    });


     setInputFilterPayeeName(eftBankAdd3Edit, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('bankaddress3-eft-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('bankaddress3-eft-char-msg-edit').style.display = "block";
        }
    }); setInputFilterPayeeName(eftBankAdd4Edit, function (value) {
        if (payeeNameCharValidation.test(value)) {
            document.getElementById('bankaddress4-eft-char-msg-edit').style.display = "none";
            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('bankaddress4-eft-char-msg-edit').style.display = "block";
        }
    });

    setInputFilterPayeeName(eftPayeeNameEdit, function (value) {
       if (payeeNameCharValidation.test(value)) {
            document.getElementById('payee-name-eft-char-msg-edit').style.display = "none";

            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('payee-name-eft-char-msg-edit').style.display = "block";
        }
    });
    setInputRequiredFilter(eftPayeeNameEdit,'payee-name-eft-req-msg-edit');

     setInputFilterPayeeName(eftBankNameEdit, function (value) {
       if (payeeNameCharValidation.test(value)) {
            document.getElementById('bankname-eft-char-msg-edit').style.display = "none";

            return payeeNameCharValidation.test(value);
        } else {
            document.getElementById('bankname-eft-char-msg-edit').style.display = "block";
        }
    });
     setInputRequiredFilter(eftBankNameEdit,'bankname-eft-req-msg-edit');


    setInputFilterCountry(checkCountryEdit, function (value) {
    	 $('#checkCountry-edit').siblings('p').attr('style','display:none');
        if (countryCharValidation.test(value)) {
            document.getElementById('country-check-char-msg-edit').style.display = "none";

                 return countryCharValidation.test(value);


        } else {
            document.getElementById('country-check-char-msg-edit').style.display = "block";
        }
    });
    setValidInputFilter(checkCountryEdit,"country-check-valid-msg-edit");


    setInputFilterCurrency(checkCurrencyEdit, function (value) {
   	 $('#checkCurrency-edit').siblings('p').attr('style','display:none');
        if (currencyCharValidation.test(value)) {
            document.getElementById('currency-check-char-msg-edit').style.display = "none";
            return currencyCharValidation.test(value);
        } else {
            document.getElementById('currency-check-char-msg-edit').style.display = "block";
        }
    });
     setValidInputFilter(checkCurrencyEdit,"currency-check-valid-msg-edit");

     setInputFilterCountry(eftCountryEdit, function (value) {
    	 $('#eftCountry-edit').siblings('p').attr('style','display:none');
        if (countryCharValidation.test(value)) {
            document.getElementById('country-eft-char-msg-edit').style.display = "none";
            return countryCharValidation.test(value);
        } else {
            document.getElementById('country-eft-char-msg-edit').style.display = "block";
        }
    });
    setValidInputFilter(eftCountryEdit,"country-eft-valid-msg-edit");


    setInputFilterCurrency(eftCurrencyEdit, function (value) {
    	
    	 $('#eftCurrency-edit').siblings('p').attr('style','display:none');
        if (currencyCharValidation.test(value)) {
            document.getElementById('currency-eft-char-msg-edit').style.display = "none";
            return currencyCharValidation.test(value);
        } else {
            document.getElementById('currency-eft-char-msg-edit').style.display = "block";
        }
    });
    setValidInputFilter(eftCurrencyEdit,"currency-eft-valid-msg-edit");



   function setValidInputFilter(textbox, msgbox) {
		[ "input", "blur", "change", "contextmenu", "drop" ]
				.forEach(function(event) {
					textbox.addEventListener(event, function() {
						
						var showCurrencyError = this.id == "checkCurrency-edit" || this.id == "eftCurrency-edit";
						var showCountryError = this.id == "checkCountry-edit" || this.id == "eftCountry-edit";
						var optionSelector = "#" + $(this).attr("list") + " option[value=\"" + this.value + "\"]";
						// var optionSelector= "#"+$(this).attr("list")+"
						// option[value='"+this.value+"']";
					
						if ($(optionSelector).length) {
							$("#" + msgbox).hide();
							$(this).data("valid", true);
							if(showCountryError){
								var currencyid = "eftCurrencyList-edit";
								var countryId = "eftCountryList-edit";
								var msgId = "currency-eft-valid-msg-edit";
								if(this.id == "checkCountry-edit"){
									currencyid = "checkCurrencyList-edit";
									countryId="checkCountryList-edit";
									msgId = "currency-check-valid-msg-edit";
								}								
								var currencyCodeEdit =  $('#'+ countryId).find("option[value=\""+this.value + "\"]").attr('data-currency');
						        var currencyNameEdit =   $('#'+ currencyid).find("option[data-currency='"+ currencyCodeEdit + "']").val();
						        if(currencyNameEdit == undefined){
						        	$("#" + msgId).hide();
						        }
							}
						} 
						else if(showCurrencyError && this.value != ""){				
							
							$("#" + msgbox).hide();
							$(this).data("valid", true);
						}
						else {
							$("#" + msgbox).show();
							$(this).data("valid", false);
						}
					});
				});
	}

	function setInputRequiredFilter(textbox, msgbox) {
		[ "input", "blur", "contextmenu", "drop" ].forEach(function(event) {
			textbox.addEventListener(event, function() {
				var flagVal = true;
				var textboxId = $(textbox).attr('id');
				if (textboxId != undefined && textboxId == 'bankName-edit'
						&& ieBrowser) {
					var isInputInValid = event == "input"
							&& $('#bankName-edit').val() == "";
					if (!isInputInValid) {
						flagVal = true;
					} else {
						flagVal = false;
					}
				}
				if (flagVal) {
					if (this.value === "") {
						$("#" + msgbox).show();
						$(this).data("valid", false);
					} else if (this.hasOwnProperty("oldValue")) {
						if (payeeNameCharValidation.test(this.value)) {
							$(this).data("valid", true);
						} else {
							$(this).data("valid", false);
						}
						$("#" + msgbox).hide();
					}
				}
			});
		});
	}

}