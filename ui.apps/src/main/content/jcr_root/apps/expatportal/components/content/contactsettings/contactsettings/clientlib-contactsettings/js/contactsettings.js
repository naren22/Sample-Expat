
var phonePresent = false;
var countryList = [];
		
var contactSettings = (function() {

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


    var _getMembersContactInfo = function() {
    	var memberId = getMbrId();
        settings.url = "/bin/expatportal/membercontactinfo" + "?memberId=" + memberId;
        $.ajax(settings).done(function(response) {
            if (response) {
                var contactInfo = response;
                var name = contactInfo.FirstName + ' ' + contactInfo.LastName;
                $('.profile-name h1').text(name);
                var contactContainer = $('#my-profile-reimbursement-ctn');
                contactContainer.find('.member-id').text(contactInfo.AltId);
                contactContainer.find('.grpnumber').text(contactInfo.ClientId);
                contactContainer.find('.dob').text(_formattedDate(contactInfo.DateOfBirth));
                if(contactInfo.CitizenshipCode){
                	 var countryCodetoUpperCase = contactInfo.CitizenshipCode.toUpperCase();
                	 contactContainer.find('.country').text(countryList[countryCodetoUpperCase]);
                }
                if(contactInfo.Gender){
                    var tmp = contactInfo.Gender;
                    var genderTxt = tmp.startsWith('M') ? 'Male' :  tmp.startsWith('F') ? 'Female' : 'Unspecified';
               		 contactContainer.find('.gender').text(genderTxt);
                }

                if(contactInfo.Addresses && contactInfo.Addresses.length > 0){
                    for(var i=0 ; i < contactInfo.Addresses.length ; i++){
                        if( contactInfo.Addresses[i].AddressType == "Mailing Address"){
                        	_displayAddress(contactInfo.Addresses[i],contactContainer);
                            break;
                        }
                    }
                }
                else
                {
                    contactContainer.find('#dynamic-email #no-email').show();
                }
                
                if(contactInfo.PhoneNumbers && contactInfo.PhoneNumbers.length > 0){
                    for(var i=0 ; i < contactInfo.PhoneNumbers.length ; i++){
                    	_displayPhone(contactInfo.PhoneNumbers[i],contactContainer);
                    }
                }

                $('#system-error-note-loader').hide();

            } else {
                console.log('response success zero result ' + response.length);
                $('#system-error-note-loader').hide();
            }
        }).fail(function(response) {
            console.log('response fails ' + response);
            document.getElementById("system-error-note").style.display = 'block';
            $('#system-error-note-loader').hide();
        });
    };

    var _getCountryInfo = function(){
    	settings.url = "/bin/expatportal/countryinfo";
      countryList = sessionStorage.getItem("countryList") ? JSON.parse(sessionStorage.getItem("countryList")) : null;
    	if(countryList == null){
    		 $.ajax(settings).done(function(response) {
    	            if (response && response.length > 0) {
    	            	var countries = response;
    	            	countryList = {};
    	            	for(var i=0; i< countries.length; i++){
    	            		countryList[countries[i].code] = countries[i].name;
     	            	}
    	            	sessionStorage.setItem("countryList", JSON.stringify(countryList));
    	            	_getMembersContactInfo();
    	            } else {
    	                console.log('response success zero result ' + response.length);
    	            }
    	        }).fail(function(response) {
    	            console.log('response fails ' + response);
    	            document.getElementById("system-error-note").style.display = 'block';
    	        });
    	}
    	else{
    		_getMembersContactInfo();
    	}
    	
   
    }
    var _formattedDate = function(date){
    	var months =["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var tmpDate = new Date(date);
        var dateTxt = tmpDate.toLocaleDateString();
        dateTxt = dateTxt.replace(/[^\x00-\x7F]/g, "");
        var splittedDate = dateTxt.split('/');
        var day = splittedDate[1] < 10 ? '0' + splittedDate[1] : splittedDate[1];
        var month = parseInt(splittedDate[0]);
       // var month = tmpDate.toLocaleString('default', { month: 'short' });
       // alert('month ' + month);

        return day + "-" +  months[splittedDate[0]] + "-" + splittedDate[2];

    };



    var _displayAddress = function(address,contactContainer){
		contactContainer.find('#dynamic-address .address1').text(address.AddressLine1);
        contactContainer.find('#dynamic-address .address2').text(address.AddressLine2);
        contactContainer.find('.city').text(address.AddressLine3);
        contactContainer.find('.state').text(address.AddressLine4);
        contactContainer.find('.addrCountry').text(countryList[address.CountryCode]);
        
        
		var postalTxt = "";
		if(address.AddressLine5){
			postalTxt += address.AddressLine5 + ' ';
		}
		if(address.AddressLine6){
			postalTxt += address.AddressLine6;
		}
        contactContainer.find('.postal').text(postalTxt);

        var emailPresent = false;
        if(address.PrimaryEmail){
            contactContainer.find('#dynamic-email .primaryEmail').text(address.PrimaryEmail);
			contactContainer.find('#dynamic-email .primary').show();
            emailPresent = true;
        }

         if(address.SecondaryEmail){
            contactContainer.find('#dynamic-email .secondaryEmail').text(address.SecondaryEmail);
			contactContainer.find('#dynamic-email .secondary').show();
            emailPresent = true;
        }
        if(emailPresent == false){
            contactContainer.find('#dynamic-email #no-email').show()
        }
    }
    
    var _displayPhone = function(phone,contactContainer){
		var phoneType = phone.PhoneType ? phone.PhoneType.toLowerCase() : '';
		var phoneNumber = "";
		if(phone.CountryDialCode){
			phoneNumber += phone.CountryDialCode + ' ';
		}
		if(phone.CityDialCode){
			phoneNumber += phone.CityDialCode + ' ';
		}
		if(phone.Number){
			phoneNumber += phone.Number + ' ';
		} 
		if(phone.Extension){
			phoneNumber += phone.Extension;
		}
        if(phoneNumber.length > 0){
		    	switch (phoneType) {
		case "primary":
			contactContainer.find('#dynamic-phone-number .primaryPhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .primary').show();
			 contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "alternate":
			contactContainer.find('#dynamic-phone-number .alternativePhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .alternative').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "mobile":
			contactContainer.find('#dynamic-phone-number .mobilePhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .mobile').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "other":
			contactContainer.find('#dynamic-phone-number .otherPhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .other').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "work":
			contactContainer.find('#dynamic-phone-number .workPhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .work').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "home":
			contactContainer.find('#dynamic-phone-number .homePhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .home').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "office":
			contactContainer.find('#dynamic-phone-number .officePhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .office').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		case "cell":
			contactContainer.find('#dynamic-phone-number .cellPhone').text(phoneNumber);
			contactContainer.find('#dynamic-phone-number .cell').show();
			contactContainer.find('#dynamic-phone-number #no-phone-number').hide();
			break;
		default:
			break;
		}
        }
    	
    }

    return {
    	getCountryInfo : _getCountryInfo,
        getMembersContactInfo: _getMembersContactInfo
    };

})();


$(document).ready(function() {  
    setTimeout(function(){
	contactSettings.getCountryInfo();
    },2000);
});

