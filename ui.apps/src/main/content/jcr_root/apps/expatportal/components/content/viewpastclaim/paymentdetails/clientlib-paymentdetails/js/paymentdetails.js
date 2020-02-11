// this payment type values
var transmissionTyperArray = {
			 "1": "Check",
			  "2": "Wire",
			  "3": "ACH",
			  "4": "SEPA",
			  "7": "Cash"
	}
var paymentDetails = (function() {
	
	var _getPaymentDetails = function(requestData){
		
		var paymentNumber= requestData.paymentNumber
		var paymentURL = "/bin/expatportal/paymentdetails?bankReferenceNumber=" + paymentNumber;
		
		if(document.getElementById("system-error-note-loader")){
			document.getElementById("system-error-note-loader").style.display = 'block';
		}
	    var settings = {
				"async" : true,
				"crossDomain" : true,
				"url" : paymentURL,
				"timeout":"10000",
				"method" : "GET",
				"processData" : false,
				"contentType" : false,
				"data" : ""
			}
			$.ajax(settings).done(function(response) {
				 
				// Emptying payment details card 
				
				$('.paymentdetails #amount').text( " " );
	            $('.paymentdetails #dollar').text( " " );
	            $('.paymentdetails #currency').text( " " );

	            $('.paymentdetails #paytype').text( " " );
                $('.paymentdetails #paydate').text( " " );
                $('.paymentdetails #bank-account').text( " " );
               
				
	            var paymentResponseJSON = JSON.parse(response);
	            
	            let decimalPt = viewClaims.getDecimalPointsFromArray(paymentResponseJSON.paymentCurrencyCode);
	            
	            $('.paymentdetails #amount').text(paymentResponseJSON.paymentCurrencyCode + ' ' + paymentResponseJSON.paidAmount.toFixed(decimalPt));
	            $('.paymentdetails #dollar').text('USD ' + paymentResponseJSON.paidAmountUSD.toFixed(decimalPt));


	            $('.paymentdetails #paytype').text(transmissionTyperArray[''+paymentResponseJSON.transmissionType]);

	            getBankValidationData(paymentResponseJSON);
	            getCurrencyData(paymentResponseJSON.paymentCurrencyCode);
	            
				  $('.paymentdetails #paydate').text(getFormatedDate(paymentResponseJSON.issueDate));

				  if(document.getElementById("system-error-note-loader")){
						document.getElementById("system-error-note-loader").style.display = 'none';
					}

			}).fail(function(response) {
				
				if(document.getElementById("system-error-note-loader")){
					document.getElementById("system-error-note-loader").style.display = 'none';
				}
			});
	}
	 return {
		 getPaymentDetails : _getPaymentDetails
	 };
})();	


	
 function getFormatedDate(date)
				{
								
								var date = new Date(date);
								var localeDateString = date.toDateString();
								var splittedDate = localeDateString.split(" ");
								var month = {
                                                "JAN" : "01",
                                                "FEB":"02",
                                                "MAR":"03", 
                                                "APR" : "04",
                                                "MAY": "05" ,
                                                "JUN": "06" ,
                                                "JUL" : "07" ,
                                                "AUG" : "08",
                                                "SEP": "09" ,
                                                "OCT":"10" ,
                                                "NOV" : "11"  ,
                                                "DEC": "12",
                                               }

         var finalDateString = splittedDate[3] + "-" + month[splittedDate[1].toUpperCase()] + "-" + splittedDate[2];

        return finalDateString;

				}

function getBankValidationData(paymentResponse){

	var bankValidationURL = "/bin/expatportal/bankvalidation?country=" + paymentResponse.paymentCountryCode + "&currency=" + paymentResponse.paymentCurrencyCode;
var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : bankValidationURL,
			"timeout":"1000000",
			"method" : "GET",
			"processData" : false,
			"contentType" : false,
			"data" : ""
		}
		$.ajax(settings).done(function(response) {

            let responseJSON = JSON.parse(response);
            var bankAttributeValue = "";
            for(let i=0; i<responseJSON.length; i++){
                if(responseJSON[i].attributeType.toLowerCase() == "acct" || responseJSON[i].attributeType.toLowerCase() == "lclacct"){
                   bankAttributeValue =  paymentResponse['beneficiaryBankAttribute'+ responseJSON[i].attributeLineNumber];
                  
                   if(Number(paymentResponse.transmissionType) != 1 || Number(paymentResponse.transmissionType) != 7){
                       var tmpVal = "bankAttributeValue";
        			var tmpAccountNumber = "" +  bankAttributeValue;
        			var tmpVal = "";
                       if(!tmpAccountNumber){
							tmpAccountNumber = 0;
                       }
                	for(let j=0;j< tmpAccountNumber.length;j++){
                		if(j < tmpAccountNumber.length - 4){
                			tmpVal = tmpVal + "*";
                		}
                		else
                			{
                			tmpVal = tmpVal + tmpAccountNumber[j]; 
                			}
                	}
                		if(tmpVal){
                			 $('.paymentdetails #bank-account').text(tmpVal);
                             $('.paymentdetails #bank-account').show();
                             $('.paymentdetails #bank-account-label').show();
                			
                		}
                		else
                			{
                			 $('.paymentdetails #bank-account').hide();
                             $('.paymentdetails #bank-account-label').hide();
                			}
                	  
                   }
                }
            }


		}).fail(function(response) {
		});
}

function getCurrencyData(currencyCode){
		var currencyURL = "/content/expatportal/claims/viewclaims/jcr:content.paymentcurrency.json";
		var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : currencyURL,
			"method" : "GET",
			"processData" : false,
			"contentType" : false,
			"data" : ""
		}
		$.ajax(settings).done(function(response) {
            var currencyInfo =  response.currencyinfo;
            for(let i=0; i < currencyInfo.length;i++){
				if(currencyInfo[i].code.toLowerCase() == currencyCode.toLowerCase())
                {
                    $('.paymentdetails #currency').text(currencyInfo[i].name);
                    break;
                }
            }

		}).fail(function(response) {
		});

}