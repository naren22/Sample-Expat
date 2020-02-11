var countryList = [];
var countryResponse = [];
var currencyResponse = [];
var currencyList = [];
var currencyCodes = [];
var bankPreferenceId=0;
var defaultPrefernce = "";
var altMemId = 0;



var gopStep2 = (function() {

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
        settings.url = "/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.members.json?memberId=" + memberId;
        $.ajax(settings).done(function(response) {
            if (response && response.members && response.members.length > 0) {
                console.log('response success ' + response.members.length);
                var membersData = response.members;
                $("#patient").empty();
                if(membersData.length > 1){
                            $("#patient").append(
                    "<option selected>" + "</option>");
                }
                for (var i = 0; i < membersData.length; i++) {
                    var memberText = membersData[i].FirstName + " " + membersData[i].LastName + "  " +
                        membersData[i].BirthDate;
                    $("#patient").append(
                        "<option value=" + membersData[i].MemberIdentifier + ">" + memberText + "</option>");
                    altMemId = membersData[i].AlternateId;
                }

               /* if(membersData.length == 1){
                    $("#patient option[value='"+ membersData[0].FirstName + "']").attr('selected',true);
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
                }else{*/
                  /*  sessionStorage.setItem('isSubscriber', 'true');
                    $('.independentPref').show();
                    $('.dependentPref').hide();
                                 $('.no-pref-message').show();
                    $('.no-pref-button').show();
                    $('.dependent-no-pref-message').hide(); */
               // }
            } else {
                console.log('response success zero result ' + response.length);
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            //tagSystemErrorNote($("#system-error-note").find('p').html(), response.status);
            document.getElementById("system-error-note").style.display = 'block';
        });
    }

    return {
        getMembers: _getMembers
    };

})();





$(document).ready(function() {   
   // var step= sessionStorage.getItem('step');
  //  step=step?step:1;
  //  manageStep.handleClaimStep(step); 
    setTimeout(function(){
    	gopStep2.getMembers();
       
       // document.getElementById("system-error-note-loader").style.display = 'none'; 
    },2500);
});

