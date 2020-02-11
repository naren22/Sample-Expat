
function displayEditPreferences(){
	trackAnalyticsData('EDIT PREFERENCE','Edit Preference Button');
populateEditData(globalJsonResp);
 $('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').hide();
 $(".edit-reimbursement-form-1").show();

    $('html, body').animate({
                    scrollTop: $(".edit-reimbursement-form-1").offset().top
    }, 100);
if(sessionStorage.getItem('CNTRYDefIndicator')=='No'){
	$('.cancel-pref-btn').show();
}
pageDataLayer.content.pageName = $('.edit-reimbursement-form-1 .review-submit-sub-title').text();
window.publishPostPageData ('trackClaimJourneyStep',{

    "claims": { //Custom Link Tracking Fields    
        "claimStep": "step 3.2" //Claim journey step
           
    }

});
_satellite.track('trackClaimSubmitPageLoad');
}

function closeEditPreference(){
	$('.review-claim-container, #view-reimburesment-btn-contaner, #scrollTo-edit-reimbursement-form').show();
 	$(".edit-reimbursement-form-1").hide();
 	pageDataLayer.content.pageName = $('#review-submit-title').text();
    window.publishPostPageData ('trackClaimJourneyStep',{

        "claims": { //Custom Link Tracking Fields    
            "claimStep": "step 3" //Claim journey step
               }
     });
    _satellite.track('trackClaimSubmitPageLoad');
    $('html, body').animate({
                    scrollTop: $("#scrollTo-edit-reimbursement-form").offset().top
    }, 100);
}

function removeAllMessagesEdit() { /// remove existing messeges that being display
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

		dynamicFields.bankDetails.forEach(function (data) { /// recheck the dynamic banking fields before submiting 
                    $("#"+data.attributeType+"-req-msg").hide();

          });
       // document.getElementById('method-check-req-msg-edit').style.display = "none";
 }

function cancelEditPreferences(){
	 document.getElementById("cancel-edit-pref").style.display = "block";
}

function cancelEditPref(){
	document.getElementById("cancel-edit-pref").style.display = "none";
	trackAnalyticsData('CANCEL','button to cancel user preference changes');
	removeAllMessagesEdit();
	closeEditPreference();
   populateEditData(globalJsonResp);	
}

function closeEditPrefModal(){
	document.getElementById("cancel-edit-pref").style.display = "none";
}

var editPreferenceMethod="";

function eftEditFunction(){
		//trackAnalyticsData('EFT','button to enable eft section on edit preference popover');
 		$('.eft-selector-edit').css("background-color", "#003DA1");
        document.getElementById("checkTxt-edit").style.color = "black";
     	document.getElementById("eftTxt-edit").style.color = "white";
        $('.check-selector-edit').css("background-color", "white");
    	$("#eft-method-edit").show();
		$("#check-method-edit").hide();
		 removeAllMessagesEdit();
    	editPreferenceMethod="eft";

}

function chkEditFunction(){
	//trackAnalyticsData('CHECK','button to enable check section on edit preference popover');
 		$('.check-selector-edit').css("background-color", "#003DA1");
    	document.getElementById("checkTxt-edit").style.color = "white";
        document.getElementById("eftTxt-edit").style.color = "black";
        $('.eft-selector-edit').css("background-color", "white");
    	$("#eft-method-edit").hide();
		$("#check-method-edit").show();
		 removeAllMessagesEdit();
    	editPreferenceMethod="chk";

}

var globalJsonResp;
function populateEditData(jsonResp){

    if(jsonResp){
		globalJsonResp = jsonResp;
    }
    defaultPrefernce = jsonResp.PAY_METH_CD;
    if(jsonResp.PAY_METH_CD === 'CHK'){
		$("#checkPayeeName-edit").val(jsonResp.PAYEE_NM);
      $("#checkPayeeName-edit").data("valid",true);
      $("#checkCountry-edit").val($("#checkCountryList-edit option[data-code=\""+jsonResp.CNTRY_CD+"\"]").val());
      //  $("#checkCountry-edit").val($("#checkCountryList-edit option[data-code="+jsonResp.CNTRY_CD+"]").val());
		 $("#checkCountry-edit").data("valid",true);
       
        $("#eftPayeeName-edit").val(jsonResp.PAYEE_NM);
         $("#eftPayeeName-edit").data("valid",true);
         $("#eftCountry-edit").val($("#eftCountryList-edit option[data-code=\""+jsonResp.CNTRY_CD+"\"]").val());
       // $("#eftCountry-edit").val($("#eftCountryList-edit option[data-code="+jsonResp.CNTRY_CD+"]").val());
        $("#eftCountry-edit").data("valid",true);
         $("#eftCountry-edit").trigger("change");
        $("#eftCurrency-edit").val(jsonResp.CRNCY_NM);
         $("#eftCurrency-edit").data("valid",true);
         $("#checkCurrency-edit").val(jsonResp.CRNCY_NM);
		 $("#checkCurrency-edit").data("valid",true);

		chkEditFunction();
    }else{
		var dynamicValues={};
		if(countryBankPreference){
        for(i=0;i<countryBankPreference.length;i++){
			var key = $('.lblDetail'+countryBankPreference[i].attributeLineNumber).text().replace("*","");
            if(key){
           		var val = jsonResp['BNK_DTL_'+countryBankPreference[i].attributeLineNumber+'_TXT'];
				dynamicValues[key]=val;
            }

        }
		}
		eftEditFunction();
		if(jsonResp.CNTRY_CD && jsonResp.CRNCY_CD){
		getBankDetailsByCountryCodeEdit(jsonResp.CNTRY_CD, dynamicValues,jsonResp.CRNCY_CD );
		}
        $("#eftPayeeName-edit").val(jsonResp.PAYEE_NM);
         $("#eftPayeeName-edit").data("valid",true);
         $("#eftCountry-edit").val($("#eftCountryList-edit option[data-code=\""+jsonResp.CNTRY_CD+"\"]").val());
       // $("#eftCountry-edit").val($("#eftCountryList-edit option[data-code="+jsonResp.CNTRY_CD+"]").val());
		$("#eftCountry-edit").data("valid",true);
        $("#eftCurrency-edit").val(jsonResp.CRNCY_NM);
         $("#eftCurrency-edit").data("valid",true);
        $("#bankName-edit").val(jsonResp.ORG_NM);
        $("#bankName-edit").data("valid",true);

        $("#checkPayeeName-edit").val(jsonResp.PAYEE_NM);
        $("#checkPayeeName-edit").data("valid",true);
        $("#checkCountry-edit").val($("#checkCountryList-edit option[data-code=\""+jsonResp.CNTRY_CD+"\"]").val());
        //$("#checkCountry-edit").val($("#checkCountryList-edit option[data-code="+jsonResp.CNTRY_CD+"]").val());
        $("#checkCountry-edit").data("valid",true);
        $("#checkCurrency-edit").val(jsonResp.CRNCY_NM);
        $("#checkCurrency-edit").data("valid",true);

         $("#bankAddress1-edit").val(jsonResp.ADR_LN_1_TXT);
         $("#bankAddress2-edit").val(jsonResp.ADR_LN_2_TXT);
         $("#bankAddress3-edit").val(jsonResp.ADR_LN_3_TXT);
         $("#bankAddress4-edit").val(jsonResp.ADR_LN_4_TXT);

         jsonResp.ATR_DESC_1 && $("#dynamic-fields-edit input[aria-labelledby='"+jsonResp.ATR_DESC_1+"']").val(jsonResp['BNK_DTL_1_TXT']);
    }

}

var inputEvent = document.createEvent('Event');
inputEvent.initEvent('input', true, true);

$(document).ready(function(){
	
	var countryListEditPrep = [];	

    $("#checkCountry-edit").on("change", function(){
		var cnty=$(this).val();
		var oldval=$("#eftCountry-edit").val();
        if(oldval !== cnty){
        	$("#eftCountry-edit").val(cnty);
	 		$("#eftCountry-edit").trigger("change");
            $("#eftCountry-edit")[0].dispatchEvent(inputEvent);
        }
        if(countryListEditPrep == null || countryListEditPrep.length == 0){
        	$('#eftCountryList-edit option').each(function() { 
        		countryListEditPrep.push( $(this).attr('value') );
        	});
        }
       
        var countryVal = countryListEditPrep.filter(function (country) {
            if (cnty.toUpperCase() === country.toUpperCase()) {
                return country;
            }
        });
        
        if (countryVal.length > 0) {
       	 $('#checkCountry-edit').val(countryVal[0]);
       	cnty = countryVal[0];
        }

        if(cnty){
        	var crnCode=$("#checkCountryList-edit option[value=\""+cnty+"\"]").data("currency");
           // $("#checkCurrency-edit").val($("#checkCurrencyList-edit option[data-currency=\""+crnCode+"\"]").val());
           // var crnCode=$("#checkCountryList-edit option[value='"+cnty+"']").data("currency");
            $("#checkCurrency-edit").val($("#checkCurrencyList-edit option[data-currency='"+crnCode+"']").val());

        }
    });

     $("#eftCountry-edit").on("change", function(){
		var cnty=$(this).val();

        var oldval=$("#checkCountry-edit").val();
        if(oldval !== cnty){
        	removeAllMessagesEdit();
        	$("#checkCountry-edit").val(cnty);
	 		$("#checkCountry-edit").trigger("change");


			$("#checkCountry-edit")[0].dispatchEvent(inputEvent);
            $("#checkCurrency-edit")[0].dispatchEvent(inputEvent);
        }
        if(countryListEditPrep == null || countryListEditPrep.length == 0){
        	$('#eftCountryList-edit option').each(function() { 
        		countryListEditPrep.push( $(this).attr('value') );
        	});
        }
        
        var countryVal = countryListEditPrep.filter(function (country) {
            if (cnty.toUpperCase() === country.toUpperCase()) {
                return country;
            }
        });
        
        if (countryVal.length > 0) {
       	 $('#eftCountry-edit').val(countryVal[0]);
       	cnty = countryVal[0];
        }
        
        if(cnty){
        	var crnCode=$("#eftCountryList-edit option[value=\""+cnty+"\"]").data("currency");
           // var crnCode=$("#eftCountryList-edit option[value='"+cnty+"']").data("currency");
             $("#eftCurrency-edit").val($("#eftCurrencyList-edit option[data-currency="+crnCode+"]").val());
			$("#eftCurrency-edit").trigger("change");
        }else{
			 $("#eftCurrency-edit").val("");
             $("#eftCurrency-edit").trigger("change");

        }
         $("#eftCurrency-edit")[0].dispatchEvent(inputEvent);
    });

    $("#eftCurrency-edit").on("change",function(){
       var cnty=$(this).val();
		var oldval=$("#checkCurrency-edit").val();
        if(oldval !== cnty){
        	$("#checkCurrency-edit").val(cnty);
        	removeAllMessagesEdit();
			$("#checkCurrency-edit")[0].dispatchEvent(inputEvent);
        }

      //  var crnCode = $("#eftCurrencyList-edit option[value=\""+cnty+"\"]").data("currency");
      	var cntryCode = $("#eftCountryList-edit option[value=\""+$("#eftCountry-edit").val()+"\"]").data("code");
        var crnCode = $("#eftCurrencyList-edit option[value='"+cnty+"']").data("currency");
     	//var cntryCode = $("#eftCountryList-edit option[value='"+$("#eftCountry-edit").val()+"']").data("code");

    	if(cntryCode && crnCode){   	
    		getBankDetailsByCountryCodeEdit(cntryCode ,null,crnCode);
    	}
    	else
    		{
    		$('#dynamic-fields-edit').empty("");
            document.getElementById('bnkNme-edit').setAttribute('hidden','hidden');
            document.getElementById('bnkAdd1-edit').setAttribute('hidden','hidden');
            document.getElementById('bnkAdd2-edit').setAttribute('hidden','hidden');
            document.getElementById('bnkAdd3-edit').setAttribute('hidden','hidden');
            document.getElementById('bnkAdd4-edit').setAttribute('hidden','hidden');
    		}
    		     	
		$("#bankName-edit").val("");
		$("#bankAddress1-edit").val("");
         $("#bankAddress2-edit").val("");
         $("#bankAddress3-edit").val("");
         $("#bankAddress4-edit").val("");
     });


    $("#checkCurrency-edit").on("change",function(){
		var cnty=$(this).val();
		var oldval=$("#eftCurrency-edit").val();
        if(oldval !== cnty){
        	$("#eftCurrency-edit").val(cnty);
			$("#eftCurrency-edit")[0].dispatchEvent(inputEvent);
             $("#eftCurrency-edit").trigger("change");
        }
   	 });
    
    $("#checkCountry").on("change", function(){
		var cnty=$(this).val();
		var oldval=$("#eftCountry").val();
        if(oldval !== cnty){
        	$("#eftCountry").val(cnty);
	 		$("#eftCountry").trigger("change");
            $("#eftCountry")[0].dispatchEvent(inputEvent);
        }
        if(countryListEditPrep == null || countryListEditPrep.length == 0){
        	$('#eftCountryList option').each(function() { 
        		countryListEditPrep.push( $(this).attr('value') );
        	});
        }
       
        var countryVal = countryListEditPrep.filter(function (country) {
            if (cnty.toUpperCase() === country.toUpperCase()) {
                return country;
            }
        });
        
        if (countryVal.length > 0) {
       	 $('#checkCountry').val(countryVal[0]);
       	cnty = countryVal[0];
        }

        if(cnty){
        	var crnCode=$("#checkCountryList option[value=\""+cnty+"\"]").data("currency");
        	//$("#checkCurrency").val($("#checkCurrencyList option[data-currency=\""+crnCode+"\"]").val());
            // var crnCode=$("#checkCountryList option[value='"+cnty+"']").data("currency");
             $("#checkCurrency").val($("#checkCurrencyList option[data-currency='"+crnCode+"']").val());

        }
    });

     $("#eftCountry").on("change", function(){
		var cnty=$(this).val();

        var oldval=$("#checkCountry").val();
        if(oldval !== cnty){
        	$("#checkCountry").val(cnty);
	 		$("#checkCountry").trigger("change");


			$("#checkCountry")[0].dispatchEvent(inputEvent);
            $("#checkCurrency")[0].dispatchEvent(inputEvent);
        }
        if(countryListEditPrep == null || countryListEditPrep.length == 0){
        	$('#eftCountryList option').each(function() { 
        		countryListEditPrep.push( $(this).attr('value') );
        	});
        }
        
        var countryVal = countryListEditPrep.filter(function (country) {
            if (cnty.toUpperCase() === country.toUpperCase()) {
                return country;
            }
        });
        
        if (countryVal.length > 0) {
       	 $('#eftCountry').val(countryVal[0]);
       	cnty = countryVal[0];
        }
        
        if(cnty){
        	var crnCode=$("#eftCountryList option[value=\""+cnty+"\"]").data("currency");
            // var crnCode=$("#eftCountryList option[value='"+cnty+"']").data("currency");
             $("#eftCurrency").val($("#eftCurrencyList option[data-currency="+crnCode+"]").val());
			$("#eftCurrency").trigger("change");
        }else{
			 $("#eftCurrency").val("");
             $("#eftCurrency").trigger("change");

        }
         $("#eftCurrency")[0].dispatchEvent(inputEvent);
    });

    $("#eftCurrency").on("change",function(){
        var cnty=$(this).val();
 		var oldval=$("#checkCurrency").val();
         if(oldval !== cnty){
         	$("#checkCurrency").val(cnty);
 			$("#checkCurrency")[0].dispatchEvent(inputEvent);
         }

        // var crnCode = $("#eftCurrencyList option[value=\""+cnty+"\"]").data("currency");
         var cntryCode = $("#eftCountryList option[value=\""+$("#eftCountry").val()+"\"]").data("code");
        var crnCode = $("#eftCurrencyList option[value='"+cnty+"']").data("currency");
      	//var cntryCode = $("#eftCountryList option[value='"+$("#eftCountry").val()+"']").data("code");

     	getBankDetailsByCountryCodeEdit(cntryCode ,null,crnCode);
 		$("#bankName").val("");
 		$("#bankAddress1").val("");
          $("#bankAddress2").val("");
          $("#bankAddress3").val("");
          $("#bankAddress4").val("");
      });

     $("#checkCurrency").on("change",function(){
 		var cnty=$(this).val();
 		var oldval=$("#eftCurrency").val();
         if(oldval !== cnty){
         	$("#eftCurrency").val(cnty);
 			$("#eftCurrency")[0].dispatchEvent(inputEvent);
              $("#eftCurrency").trigger("change");
         }
	 });
    
    $("#eftPayeeName-edit").on("change",function(){
		$("#checkPayeeName-edit").val(this.value);
    });

    $("#checkPayeeName-edit").on("change",function(){
		$("#eftPayeeName-edit").val(this.value);
    });
	setEditValidation();

});
