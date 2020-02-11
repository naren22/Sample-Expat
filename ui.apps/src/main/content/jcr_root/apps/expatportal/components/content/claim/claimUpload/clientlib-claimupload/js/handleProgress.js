function cancelClaim(event){
       var targetHtml = $(event.target).html();
    if(targetHtml.indexOf('span') != -1){
                    targetHtml = $(event.target).children().html();
    }
    tagPublishPostPageData(targetHtml,'trackNewClaimSubmitLinkClick');
       $("#cancel-claim").show();
}

function removeFiile(fileName){

    var formData = new FormData();
       formData.append("fileName", fileName);
      // var memberId = 796; 
      var memberId = getMbrId();
    formData.append("mbrId",memberId);

       $.ajax({
        type: "POST",
        url: "/bin/file/remove.json",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {

            }
            return myXhr;
        },
        success: function (data) {
            // your callback here
           // alert("Deletion status : "+data.status);
        },
        error: function (error) {
                    tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';

        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}

function submitClaimZip(){

     var formData = new FormData();
      //var memberId = 796; 
      var memberId = getMbrId();
    formData.append("mbrId",memberId);

     $.ajax({
        type: "GET",
        url: "/bin/file/zipAsset.json?mbrId="+memberId,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {

            }
            return myXhr;
        },
        success: function (data) {
            // your callback here
           // alert("Done Zipping");
        },
        error: function (error) {
             tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';

        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}

function removeAllFiles(){
    var formData = new FormData();
     // var memberId = 796; 
      var memberId = getMbrId();
    formData.append("mbrId",memberId);
  //killSession();
       $.ajax({
        type: "POST",
        url: "/bin/file/removeAll.json",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {

            }
            return myXhr;
        },
        success: function (data) {
            // your callback here
        },
        error: function (error) {
             tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';

        },
        async: false,
        data: formData,
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}


/*function killSession(){
sessionStorage.removeItem("step");          
sessionStorage.removeItem("step1_data");
sessionStorage.removeItem("step2_data");

}*/


function preparePreferenceEditData(){
    var cntry="";
    var cntryCode="";
    var payeeName="";
    var crncyCode="";
    var crncy="";
    var prefDesc="";
    var dynamicBankingFieldsReq=false;
    var dynamicBankingFieldsChar=false;
    
    trackAnalyticsData('SAVE PREFERENCE','button to submit user preference changes');
    
    if(editPreferenceMethod === "eft"){
       var requiredFiledError=false;
        if(!$("#eftPayeeName-edit").data("valid") || $("#eftPayeeName-edit").val() == ""){
            $("#payee-name-eft-req-msg-edit").show();
                    //return false;
            requiredFiledError=true;
         }
         if(!$("#eftCountry-edit").data("valid") || $("#eftCountry-edit").val() == ""){

                    $('#eft-method-edit #country-eft-req-msg-edit').show();
             requiredFiledError=true;
         }
         if(!$("#eftCurrency-edit").data("valid")|| $("#eftCurrency-edit").val() == "" ){
                    requiredFiledError=true;
                    $('#eft-method-edit #currency-eft-req-msg-edit').show();
                    //return false;
         }
         if(!$("#bankName-edit").data("valid") || $("#bankName-edit").val() ==="" ){
            $("#bankname-eft-req-msg-edit").show();
             requiredFiledError=true;
                    //return false;
         }

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

        var errorArr = [];
       $.each($('.text-danger:visible'), function(){
             errorArr.push({"errorname" : this.innerHTML});
             });
       tagFormErrorStep1(errorArr,'trackFormErrorLoad');
       
        if(requiredFiledError || dynamicBankingFieldsChar || dynamicBankingFieldsReq ){
                    return false;
        }


        payeeName=$("#eftPayeeName-edit").val();
             cntry= $("#eftCountry-edit").val();
        cntryCode=cntry?$("#checkCountryList-edit option[value=\""+cntry+"\"]").data("code"):"";
             crncy=$("#eftCurrency-edit").val();
             //crncyCode=crncy?$("#eftCurrencyList-edit option[value='"+crncy+"']").data("currency"):"";
        crncyCode=crncy?$("#eftCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";
        prefDesc="Electronic Fund Transfer";

    }else 
        if(editPreferenceMethod === "chk"){

             if(!$("#checkPayeeName-edit").data("valid") || $("#checkPayeeName-edit").val() == ""){
                $("#payee-name-check-req-msg-edit").show();
                    //return false;
             }
             if(!$("#checkCountry-edit").data("valid") || $("#checkCountry-edit").val() == ""){

                    $('#check-method-edit #country-check-req-msg-edit').show();
             }
             if(!$("#checkCurrency-edit").data("valid")|| $("#checkCurrency-edit").val() == "" ){
                     $('#check-method-edit #currency-check-req-msg-edit').show();
             }
             
            var errorArr = [];
             $.each($('.text-danger:visible'), function(){
                    errorArr.push({"errorname" : this.innerHTML});
                    });
             tagFormErrorStep1(errorArr,'trackFormErrorLoad');
             
          if(!(  $("#checkCountry-edit").data("valid") &&
                    $("#checkCurrency-edit").data("valid") && $("#checkPayeeName-edit").data("valid")
            )){
                    return false;
             }



        payeeName=$("#checkPayeeName-edit").val();
             cntry= $("#checkCountry-edit").val();
        cntryCode=cntry?$("#checkCountryList-edit option[value=\""+cntry+"\"]").data("code"):"";
             crncy=$("#checkCurrency-edit").val();
             //crncyCode=crncy?$("#eftCurrencyList-edit option[value='"+crncy+"']").data("currency"):"";
            crncyCode=crncy?$("#eftCurrencyList-edit option[value=\""+crncy+"\"]").data("currency"):"";

        prefDesc="Check";
    }
    var memberData= sessionStorage.getItem('step1_data');
    var memberJSON = JSON.parse(memberData);
   var emailAddress = sessionStorage.getItem('emailAddress') ? sessionStorage.getItem('emailAddress') : '';
   cntry = encodeURIComponent(cntry);
       var preferncceData={
              "BNK_DTL_ID": globalJsonResp.BNK_DTL_ID,
              "MBR_ID": globalJsonResp.MBR_ID,
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
              "CRNCY_CD": crncyCode||"",
              "CNTRY_CD": cntryCode||"",
              "CNTRY_NM": cntry||"",
              "CRNCY_NM": crncy,
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
              "CRE_ID": globalJsonResp.MBR_ID,
              "LST_UPDT_ID": globalJsonResp.MBR_ID,
              "CRE_DT": "2017-05-11T14:12:39.267",
             //"LST_UPDT_DT": "2017-05-11T14:12:39.267",
              "PAY_METH_CD": editPreferenceMethod.toUpperCase()||"",
              "BNK_PMNT_TYP": editPreferenceMethod.toUpperCase()||"",
              "PAY_METH_DESC": prefDesc||"",
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
              "RPT_CNTRY_CD": cntryCode||"",
              "PAYEE_NM": payeeName || "",
              "PRI_EMAIL_ADR_TXT": emailAddress,
              "CNTRYDefIndicator": "False",
              "SRC_CD": "EXPTGG",
              "RPT_PAYEE_NM": payeeName || "",
              "IS_DFLT_PAYEE_NM": 0
            };

     if(editPreferenceMethod === "eft"){
        //setting Dynamic filed values
        var dynamicFieldData=$("#dynamic-fields-edit input[type=text].form-control");
    

        $.each(dynamicFieldData, function(index){
    
            var valueIndex=index+1;
            console.log('paymentcurrencyval' + countryBankPreference);
            var indexVal = countryBankPreference[index].attributeLineNumber;
            preferncceData["BNK_DTL_"+indexVal+"_TXT"]=$(this).val();
            preferncceData["ATR_DESC_"+indexVal]=$(this).attr("aria-labelledby");
    
        });
                    preferncceData.ORG_NM=$("#bankName-edit").val();                   
             preferncceData.ADR_LN_1_TXT=$("#bankAddress1-edit").val();
            preferncceData.ADR_LN_2_TXT=$("#bankAddress2-edit").val();
            preferncceData.ADR_LN_3_TXT=$("#bankAddress3-edit").val();
            preferncceData.ADR_LN_4_TXT=$("#bankAddress4-edit").val();
     }

     $('#dynamicBankingField').show();
     editPreference(JSON.stringify(preferncceData) , null);
}




function editPreference(requestData, type){
	  otpMethodSelected="";
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
                    claimsInfo.getPaymentPreferences();
            closeEditPreference();

        },
        error: function (error) {
             tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';

        },
        async: true,
        data: requestData,
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}
