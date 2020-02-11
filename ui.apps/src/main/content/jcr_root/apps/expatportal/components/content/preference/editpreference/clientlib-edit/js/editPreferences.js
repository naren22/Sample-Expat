var editPreferenceObj ={

    "response":{},
    "country":{},
    "currency":{},
    "countryList":[],
    "currencyList":[],
    "bankdetails":{},

    "init" : function(url){
        	return {
		        "async": true,
		        "crossDomain": true,
		        "url": url,
		        "method": "GET",
		        "headers": {
		            "Content-Type": "application/json",
		            "cache-control": "no-cache"
		        },
		        "processData": false
		    };
    },

    "getCountries" : function(){



        	var URL ="/content/expatportal/claims/submitnewclaims/_jcr_content/par/submitclaimsform.claimService.countries.json";

    		var settings = this.init(URL);
			var that = this;

            $.ajax(settings).done(function(res){
                that.country = res;

                that.setCountries();
                $(".editpreference").trigger("cnrtyloaded");


            }).fail(function(){
				getPreference.error(true);
            });


	},
    "setCountries":function(){
         $("#eftCountryList, #checkCountryList").empty();

        var cntryList=[];
         this.country.countries.sort(function(a, b){
                    var country1=a.name.toLowerCase(), country2=b.name.toLowerCase()
                    if (country1 < country2) 
                        return -1 
                    if (country1 > country2)
                        return 1
                    return 0
                     });

        $.each(this.country.countries, function(data){


            $("#eftCountryList, #checkCountryList").append(
                                 "<option value=\"" +
                           this.name + "\" data-currency='" + this.currencyCode + "' data-country='" + this.code + "'/>");
            cntryList.push(this.name);

        });
        this.countryList = cntryList;

    },

     "getCurrencies" : function(){

        	

        	var URL ="/content/expatportal/claims/submitnewclaims/_jcr_content/par/submitclaimsform.claimService.currencies.json";

    		var settings = this.init(URL);
			var that = this;

            $.ajax(settings).done(function(res){
                that.currency = res;
				that.setCurrencies();
                $(".editpreference").trigger("crncyloaded");
        
            }).fail(function(){
				getPreference.error(true);
            });


	},
     "setCurrencies":function(){
         $("#eftCurrencyList, #checkCurrencyList").empty();

         var crncyList=[];

          this.currency.currencies.sort(function(a, b){
                    var country1=a.name.toLowerCase(), country2=b.name.toLowerCase()
                    if (country1 < country2) 
                        return -1 
                    if (country1 > country2)
                        return 1
                    return 0
                     });

        $.each(this.currency.currencies, function(data){


            $("#eftCurrencyList, #checkCurrencyList").append(
                                 "<option value=\"" +
                           this.name + "\" data-currency='" + this.code +"'/>");
            crncyList.push(this.name);
        });

         this.currencyList=crncyList;

    },

     "getBankDetails" : function(countryCode,currencyCode,onload){
         

        	var memId=getMbrId(); 

         if(countryCode && currencyCode){
        	 $("#system-error-note-loader").show();

        	var URL ="/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.getPaymentInfoByCountry.json?countryCode=" + countryCode+"&currencyCode="+currencyCode;

    		var settings = this.init(URL);
			var that = this;

            $.ajax(settings).done(function(res){
                that.bankdetails = res;

                $(".editpreference").trigger("bankdetailsloaded",onload);
                $("#system-error-note-loader").hide();
        
            }).fail(function(){
				getPreference.error(true);
                $("#system-error-note-loader").hide();
            });
         } else{
              this.bankdetails="";
			 $(".editpreference").trigger("bankdetailsloaded",onload);
             
            document.getElementById('bnkNme-edit').hidden = true;
            document.getElementById('bnkAdd1-edit').hidden = true;
            document.getElementById('bnkAdd2-edit').hidden = true;
            document.getElementById('bnkAdd3-edit').hidden = true;
            document.getElementById('bnkAdd4-edit').hidden = true;
         }

	},

     "getDynamicBankingFields": function(){
		var dynamicBankingFields=[];
        var bnkDetail= {
            label: "Bank Account Number",
            attributeType: "ACCT",
            regex: "^[a-zA-Z0-9]+$",
            errorMessage: "EFT field error : Please enter valid Account Number of alphanumeric",
            maxLength: 50,
            isReq: true,
            fieldRequiredError: true, // if isReq is true set as true otherwise false
            fieldCharacterError: false, // default false
            attributeLineNumber:0
        };

         if( editPreferenceObj.bankdetails.getPaymentInfoByCountry){
            for(i=0; i< editPreferenceObj.bankdetails.getPaymentInfoByCountry.length; i++){
                var index=i+1;
    
                bnkDetail.label = editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].atrributeDescription;
                bnkDetail.attributeType =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].attributeType;
                bnkDetail.regex =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].expression;
                bnkDetail.errorMessage =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].expressionMessage;
                bnkDetail.maxLength =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].maxLength;
                bnkDetail.isReq =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].isRequired;
                bnkDetail.fieldRequiredError =  editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].isRequired;
                bnkDetail.fieldCharacterError = false; //default
                bnkDetail.attributeLineNumber = editPreferenceObj.bankdetails.getPaymentInfoByCountry[i].attributeLineNumber;
    
                dynamicBankingFields.push( JSON.parse(JSON.stringify(bnkDetail)));
    
             }
         }
        return dynamicBankingFields;
    },

    "setValuesEFT":function(jsonData){

		 $("#eft-method-edit #eftPayeeName-edit, #check-method-edit #checkPayeeName-edit").val(jsonData.PAYEE_NM);
          $("#eft-method-edit #eftCountry-edit, #check-method-edit #checkCountry-edit").val(jsonData.CNTRY_NM);
           $("#eft-method-edit #eftCurrency-edit,#check-method-edit #checkCurrency-edit").val(jsonData.CRNCY_NM);
            $("#eft-method-edit #bankName-edit").val(jsonData.ORG_NM);


		//Dynamic banking details
         for(i=0; i<15; i++){
            var index=i+1;
            var value = jsonData["BNK_DTL_"+index+"_TXT"];
            var label = jsonData["ATR_DESC_"+index];

             if($("#dynamic-fields-edit input.form-control[aria-labelledby=\""+label+"\"]")){
					$("#dynamic-fields-edit input.form-control[aria-labelledby=\""+label+"\"]").val(value);
             }

         }

        //Address details
         $("#bankAddress1-edit").val(jsonData.ADR_LN_1_TXT);
         $("#bankAddress2-edit").val(jsonData.ADR_LN_2_TXT);
         $("#bankAddress3-edit").val(jsonData.ADR_LN_3_TXT);
         $("#bankAddress4-edit").val(jsonData.ADR_LN_4_TXT);


    },
    "setValuesCHK": function(jsonData){

		 $("#eft-method-edit #eftPayeeName-edit, #check-method-edit #checkPayeeName-edit").val(jsonData.PAYEE_NM);
         $("#eft-method-edit #eftCountry-edit, #check-method-edit #checkCountry-edit").val(jsonData.CNTRY_NM);
         $("#eft-method-edit #eftCurrency-edit,#check-method-edit #checkCurrency-edit").val(jsonData.CRNCY_NM);

         $("#eft-method-edit #bankName-edit").val("");
        //Address details
         $("#bankAddress1-edit").val("");
         $("#bankAddress2-edit").val("");
         $("#bankAddress3-edit").val("");
         $("#bankAddress4-edit").val("");
         $("#eftCurrency-edit").change();
    },
    "clearValueEft": function(){


         $("#eft-method-edit #bankName-edit").val("");
        //Address details
         $("#bankAddress1-edit").val("");
         $("#bankAddress2-edit").val("");
         $("#bankAddress3-edit").val("");
         $("#bankAddress4-edit").val("");

    }


};