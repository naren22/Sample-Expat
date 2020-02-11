var countryList = [];
var countryResponse = [];
var currencyResponse = [];
var currencyList = [];
var currencyCodes = [];
var bankPreferenceId=0;
var defaultPrefernce = "";
var altMemId = 0;



var claimsInfo = (function() {

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

    var _getMembers = function() {
             //var memberId = 796; 
        var memberId = getMbrId();
        settings.url = $('#claimMemberServiceURL').val() + "?memberId=" + memberId;
        $.ajax(settings).done(function(response) {
            if (response && response.members && response.members.length > 0) {
                console.log('response success ' + response.members.length);
                var membersData = response.members;
                $("#member").empty();
                if(membersData.length > 1){
                            $("#member").append(
                    "<option selected>" + "</option>");
                }
                for (var i = 0; i < membersData.length; i++) {
                    var memberText = membersData[i].FirstName + " " + membersData[i].LastName + "  " +
                        membersData[i].BirthDate;
                    $("#member").append(
                        "<option value=" + membersData[i].MemberIdentifier + ">" + memberText + "</option>");
                    altMemId = membersData[i].AlternateId;
                }

                if(membersData.length == 1){
                    $("#member option[value='"+ membersData[0].FirstName + "']").attr('selected',true);
                    var dependentCodesArray = ["01","02","09","15","17","19","20","21","23","36","38","53","60"];
                    if($.inArray(membersData[0].REL_TYP_CD, dependentCodesArray) != -1){
                        sessionStorage.setItem('isDependent', 'true');
                        sessionStorage.setItem('dependentAge', membersData[0].BirthDate);
                        $('.edit-preference-btn').hide();
                        $('.independentPref').hide();
                        if(membersData[0].BirthDate != undefined && !isMinor(membersData[0].BirthDate)){
                        	$('.dependentPref').show();
                        }
                        $('.no-pref-message').hide();
                        $('.no-pref-button').hide();
                        $('.dependent-no-pref-message').show();
                    }else{
                           sessionStorage.setItem('isSubscriber', 'true');
                           $('.independentPref').show();
                        $('.dependentPref').hide();
                        $('.no-pref-message').show();
                        $('.no-pref-button').show();
                        $('.dependent-no-pref-message').hide();
                    }
                }else{
                    sessionStorage.setItem('isSubscriber', 'true');
                    $('.independentPref').show();
                    $('.dependentPref').hide();
                                 $('.no-pref-message').show();
                    $('.no-pref-button').show();
                    $('.dependent-no-pref-message').hide();
                }
            } else {
                console.log('response success zero result ' + response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }

    var _getProviders = function() {
             //var memberId = 796; 
             var memberId = getMbrId();
        settings.url = $('#claimProviderServiceURL').val() + "?memberId=" + memberId;
        $.ajax(settings).done(function(response) {
            if (response && response.providers && response.providers.length > 0) {
                console.log('response success ' + response.providers.length);
                var providersData = response.providers;
                $("#providerList").empty();
                var providerText = "";

                for (var i = 0; i < providersData.length; i++) {
                    providerText =providersData[i].name;
                    $("#providerList").append(
                        "<option value='" +
                        providerText + "' />");
                }
            } else {
                console.log('response success zero result ' + response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }

    var _getCountries = function() {
        settings.url = $('#claimCountryURL').val();
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
                 $("#checkCountryList-edit, #eftCountryList-edit").empty();
                for (var i = 0; i < countriesData.length; i++) {
                    $("#country").append(

                                 "<option value=\"" +
                            countriesData[i].name + "\" data-currency='" + countriesData[i].currencyCode + "' />");

                    $("#checkCountryList-edit, #eftCountryList-edit, #eftCountryList, #checkCountryList").append(
                                  "<option value=\"" +
                             countriesData[i].name + "\" data-code='" + countriesData[i].code + "' data-currency='" + countriesData[i].currencyCode + "' />");
                    countryList[i] = countriesData[i].name;

                }
            } else {
                console.log('response success zero result ' + response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }
       
       var _getPaymentPreferences = function() {
       // settings.url ="/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.paymentpreference.json";
             //var memberId = 328137;
             var memberId = getMbrId();
        settings.url = $('#paymentPreferencesServiceURL').val() + "?memberId=" + memberId;
         var countriesList, currencyList;
        $.ajax(settings).done(function(response) {
            if (response && response.preferences && response.preferences.length > 0) {
            var preferences = response.preferences[0];
            if(sessionStorage.getItem('CNTRYDefIndicator') == null){
                    sessionStorage.setItem('CNTRYDefIndicator', preferences.CNTRYDefIndicator);
            }
            sessionStorage.setItem('emailAddress', preferences.PRI_EMAIL_ADR_TXT);
                populateEditData(preferences);
            $('.reimbursement-method-section').show();
            $('#reimbursement-method-text').text(preferences.PAY_METH_DESC);
            $('.payee-name-text').text(preferences.PAYEE_NM);
            $('.payee-country-text').text(preferences.CNTRY_NM);
            $('.payee-currency-text').text(preferences.CRNCY_NM);
            $('.payee-bank-text').text(preferences.ORG_NM);
            bankPreferenceId=preferences.BNK_DTL_ID;
            if(preferences.ADR_LN_1_TXT && preferences.ADR_LN_1_TXT != ''){
                    $('.valAddress1').text(preferences.ADR_LN_1_TXT);
                    $('.valAddress1').parent().parent().show();
            }else{
                                 $('.valAddress1').parent().parent().hide();
                }
            if(preferences.ADR_LN_2_TXT && preferences.ADR_LN_2_TXT != ''){
                    $('.valAddress2').text(preferences.ADR_LN_2_TXT);
                     $('.valAddress2').parent().parent().show();
            }else{
                                 $('.valAddress2').parent().parent().hide();
                }
            if(preferences.ADR_LN_3_TXT && preferences.ADR_LN_3_TXT != ''){
                    $('.valAddress3').text(preferences.ADR_LN_3_TXT);
                     $('.valAddress3').parent().parent().show();
            }else{
                                 $('.valAddress3').parent().parent().hide();
                }
            if(preferences.ADR_LN_4_TXT && preferences.ADR_LN_4_TXT != ''){
                    $('.valAddress4').text(preferences.ADR_LN_4_TXT);
                     $('.valAddress4').parent().parent().show();
                }else{
                                 $('.valAddress4').parent().parent().hide();
                }
            
              for(i=0; i<15; i++){
                                var index=i+1;

                     var val = preferences["BNK_DTL_"+index+"_TXT"];
                                $('.valDetail'+index).text(val);

                 }
                 
                
              if(preferences.CNTRY_CD && preferences.CRNCY_CD ){
                      _getBankAccountValidation(preferences.CNTRY_CD,preferences.CRNCY_CD);
             }
            
                if(preferences.PAY_METH_CD.toLowerCase() == "chk"){
                    $('#check-method').show();
                    $('#eft-method').hide();   
            }
            else
                    {
                    $('#check-method').hide();
                    $('#eft-method').show();
                    }
            
             console.log('response result payment preference ' + response.preferences);
            } else {
                console.log('response success zero result ' , response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }

    var _maskNumber = function(value){
             
             maskedString = "";
             tmpAccountNumber = value;
       
       for(var i=0;i< tmpAccountNumber.length;i++){
             if(i < tmpAccountNumber.length - 4){
                    maskedString = maskedString + "X";
             }
             else
                    {
                    maskedString = maskedString + tmpAccountNumber[i]; 
                    }
       }
             
             return maskedString;
       }

    var _getBankAccountValidation = function(countryCode,currencyCode) {
        //var memberId = $("#header").attr("data-mmid");
        settings.url = $('#onetimepaymentServiceURL').val() + "?countryCode=" + countryCode + "&currencyCode=" + currencyCode ;
        $.ajax(settings).done(function(response) {
            if (response && response.getPaymentInfoByCountry && response.getPaymentInfoByCountry.length > 0) {
                console.log('response success getPaymentInfoByCountry' + response.getPaymentInfoByCountry.length);
                var paymentInfo = response.getPaymentInfoByCountry;
                var index = 1;
                $('#eft-method #dynamicBankingField .lblField').parent().parent().hide();
                for(var i=0; i < paymentInfo.length; i++){
                    $('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].attributeLineNumber).text(paymentInfo[i].atrributeDescription);
                    if(paymentInfo[i].attributeType.toLowerCase() == "acct" || 
                                 paymentInfo[i].attributeType.toLowerCase() == "lclacct")
                           {
                                  //$('.lblDetail'+paymentInfo[i].ATR_LN_NBR).addClass("lbl" + paymentInfo[i].ATR_LN_TYP_CD.toLowerCase());
                           var tempVal = $('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].attributeLineNumber).parent().siblings().find("p").text();
                           var maskedVal  = _maskNumber(tempVal);
                           $('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].attributeLineNumber).parent().parent().show();
                           $('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].attributeLineNumber).parent().siblings().find("p").text(maskedVal);
                           
                           }
                    else
                           {
                           $('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].attributeLineNumber).parent().parent().show();
                           //$('#eft-method #dynamicBankingField .lblDetail'+paymentInfo[i].ATR_LN_NBR).parent().siblings().find("p").text(maskedVal);
                           }
                    index ++;
                }
                
            } else {
                console.log('response success zero result ' + response.length);
                $('#eft-method #dynamicBankingField .lblField ').text('');
            }
               }).fail(function(response) {
                   console.log('response fails ' + response);
                   tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
                   document.getElementById("system-error-note").style.display = 'block';
                   $('#eft-method #dynamicBankingField .lblField ').text('');
               });
           }
    
    
    var _preFillStep1Form = function(){
       var step1_data = sessionStorage.getItem('step1_data') && sessionStorage.getItem('step1_data') != ""  ? 
                           JSON.parse(sessionStorage.getItem('step1_data')) : null;
       if(step1_data){
              $("#member option[value='"+ step1_data.memberName  + "']").attr('selected',true)
              
              $('#provider').val(step1_data.providerName);
              $('#providerCountry').val(step1_data.providerCountry);
              $('#providerCity').val(step1_data.providerCity);
              $('#claimNickname').val(step1_data.claimNickName);
              $('#billedAmount').val(step1_data.billedAmount);
              $('#claimCurrency').val(step1_data.billedCurrency);
              $('#dateOfService').val(step1_data.dateOfService);
              $('#diagnosisText').val(step1_data.diagnosisText);
              $('#treatmentText').val(step1_data.treatmentDescription);
              
                  memberErrorMsg = false;
                  providerErrorMsg = false;
                  providerCountryErrorMsg = false;
                  providerValidCountryErrorMsg = false;
                  providerCityErrorMsg = false;
                  billedAmountErrorMsg = false;
                  billedAmountValidErrorMsg = false;
                  billedAmountGreaterErrorMsg = false;
                  claimCurrencyErrorMsg = false;
                  claimValidCurrencyErrorMsg = false;
                  dateOfServiceErrorMsg = false;
				  dateOfServiceFutureErrorMsg = false;
                  diagnosisTextErrorMsg = false;
                  treatmentTextErrorMsg = false;
                
                  
       }
       
    }

    var _getCurrencies = function() {
        settings.url = $('#claimCurrencyURL').val();
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
                 $("#checkCurrencyList-edit, #eftCurrencyList-edit").empty();
                for (var i = 0; i < currenciesData.length; i++) {
                    $("#currency").append(
                        "<option value='" +
                        currenciesData[i].name + "' data-currency='" + currenciesData[i].code + "' />");
                    $("#checkCurrencyList-edit, #eftCurrencyList-edit, #eftCurrencyList, #checkCurrencyList").append(
                        "<option value='" +
                        currenciesData[i].name + "' data-currency='" + currenciesData[i].code + "' />");
                    currencyList[i] = currenciesData[i].name;
                    currencyCodes[i] = currenciesData[i].code;
                }
            } else {
                console.log('response success zero result ' + response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }

    return {
        getMembers: _getMembers,
        getProviders: _getProviders,
        getCountries: _getCountries,
        getCurrencies: _getCurrencies,
        preFillStep1Form : _preFillStep1Form,
             getPaymentPreferences : _getPaymentPreferences,
             getBankAccountValidation:_getBankAccountValidation
    };

})();



var manageStep = (function() {
    var forms = $("#claim-progress-bar").data("form").split(",");
    var stepProgress = $(".progress-tracker").find("li");


    var _handleClaimStep = function(step) {
        
        $("#claim-submit-flow > div").hide();
        $("#claim-submit-flow").find("."+forms[step-1]).show();
        $("#claim-submit-flow").find("."+forms[step-1]).children("div").show();
        _manageProgress(step - 1);
        sessionStorage.setItem('step', step);
        if(step==1){//step1 name setting
            pageDataLayer.content.pageName = $('#claimInfoTitle').text();
               $('.claim-info-fields #member').change(function(){
                                             var payeeName = $(this).children("option:selected").text();
                                             payeeName = payeeName.substring(0, payeeName.lastIndexOf(' '));
                                             sessionStorage.setItem('payee',payeeName);
                              })
        }
               if(step==2) { //step2 name setting
                                             pageDataLayer.content.pageName = $($('.claimUpload h3')[0]).text();
        }
        if(step==3){//step-3 name setting
        	console.log("Submitting sptes3");
            pageDataLayer.content.pageName = $('#review-submit-title').text();
        	var userAge = sessionStorage.getItem('dependentAge');

        	if(userAge != undefined && isMinor(userAge) && sessionStorage.getItem('CNTRYDefIndicator') != 'No'){
                $('#claim-submit-flow').hide();
                $('.minorPopUp').show();
            }else{
                populateClaimData();
                var previewFiles = JSON.parse(sessionStorage.getItem("step2_data"));
                        handlePreviewFiles(previewFiles);
                        $('.editOneTimePref, .edit-reimbursement-form-1').hide();
                        if(sessionStorage.getItem('CNTRYDefIndicator')=='Yes' || sessionStorage.getItem('CNTRYDefIndicator')==null){
                    $('.cancel-pref-btn, .review-submit-sub-title').hide();
                    editOneTimePref();
                    step=2.5;//243
                    pageDataLayer.content.pageName = $("#ptitle").text();
                }
                        
                // hidding OTP button for minor dependent
                if(userAge != undefined && isMinor(userAge)) {
                    //$('.mt-4').hide();
                	$('.otp-btn').parent().hide();
                }
            }
        }
               window.publishPostPageData ('trackClaimJourneyStep',{

            "claims": { //Custom Link Tracking Fields    
                "claimStep": "step "+step //Claim journey step
                	
            }
        
        });

		 _satellite.track('trackClaimSubmitPageLoad');//243,277

    }
    var _manageProgress = function(step) {
        stepProgress.each(function(index) {
            if (step > index) {
                $(this).removeClass("is-active");
                $(this).addClass("is-complete");
                $(this).find(".progress-marker").html("<i class='fa fa-check'></i>");

            } else if (step == index) {
                $(this).addClass("is-active")
            }

        });
        //9277
        /*window.publishPostPageData ('trackClaimJourneyStep',{

        "claims": {     
            "claimStep": step+1

                              }

                              });

         _satellite.track('trackClaimSubmitPageLoad');*/
    }

    return {
        handleClaimStep: _handleClaimStep
    };

})();

function parseDate(s) {
	var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
				jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
	var p = s.split('-');
	return new Date(p[2], months[p[1].toLowerCase()], p[0]);
}

function isMinor(dob){
	var formattedDob = parseDate(dob);
	var currentDate = new Date();
	return Math.floor((currentDate.getTime() - formattedDob.getTime())/(3600 * 1000 * 24)) < 6574;
}

function takeMeHome(){
	window.location.href = "/content/expatportal/homepage.external.html";
	sessionStorage.removeItem('step');
	sessionStorage.removeItem('step1_data');
	sessionStorage.removeItem('step2_data');
	sessionStorage.removeItem('CNTRYDefIndicator');
	sessionStorage.removeItem('substep');
	sessionStorage.removeItem('isSubscriber');
	removeAllFiles();
}

$(document).ready(function() {   
    var step= sessionStorage.getItem('step');
    step=step?step:1;
    manageStep.handleClaimStep(step); 
    setTimeout(function(){
    	claimsInfo.getMembers();
        claimsInfo.getProviders();
        claimsInfo.getCountries();
        claimsInfo.getCurrencies();
        claimsInfo.getPaymentPreferences();
        document.getElementById("system-error-note-loader").style.display = 'none'; 
    },2500);
    setTimeout(function(){claimsInfo.preFillStep1Form()},2000);
    removeAllFiles();
});

