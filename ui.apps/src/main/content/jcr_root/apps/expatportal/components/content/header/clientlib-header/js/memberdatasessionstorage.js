
// memberdata  search from api
var memberSearchApi = (function() {

    var _init = function() {
        $("#header-icon-btn").click(function() {
			$("#header-as").toggle();
		});
		$("#navigation-toggle-btn").click(function() {
			$("#navbarNav").toggle();
		});
		
	// picking values from header.html and sending query peremeter to api 
		var memberData = sessionStorage.getItem("memberData");
        
		//if( memberData == null ||  memberData == "undefined" || memberData == "" || memberData.length == 0) 
		//{
            
		var firstName = $('#header').data('fname');
		var middleName = "";
		var lastName = $('#header').data('lname');
		var clientIdentifier = $('#header').data('groupid');
		var clientName = "";
		var alternateId = ""; //$('#header').data('eeid');
		var birthDate = "" + $('#header').data('dob');
        var formattedDate = birthDate ?  birthDate.substring(4,6) + "/" + birthDate.substring(6,8) + "/" + birthDate.substring(0,4) : "";
		var records = "1";

		if(document.getElementById("system-error-note-loader")){
			document.getElementById("system-error-note-loader").style.display = 'block';
		}
		var formData = new FormData();
		formData.append("firstName", firstName);
		formData.append("middleName", middleName);
		formData.append("lastName", lastName);
		formData.append("clientIdentifier", clientIdentifier);
		formData.append("alternateId", alternateId);
		formData.append("birthDate", formattedDate);
		formData.append("clientName", clientName);
		formData.append("records", records);

		var settings = {
			"async" : false,
			"crossDomain" : true,
			"url" : "/bin/expatportal/searchmember",
			"method" : "POST",
			"processData" : false,
			"contentType" : false,
			"data" : formData
		}

		$.ajax(settings).done(function(response) {
			//console.log('success ', response);
			if(document.getElementById("system-error-note-loader")){
				//document.getElementById("system-error-note-loader").style.display = 'none';
			}
			if(response && response.length > 0){
				var responseObj = JSON.parse(response);
				var memberDataObj = responseObj.length > 0 ? responseObj[0] : {};
				
				sessionStorage.setItem("memberData",JSON.stringify(memberDataObj));
                $('#viewPreference').trigger("memberdata_loaded");
			}
		}).fail(function(response) {
			
			if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'none';
			}
		});
		//}
    }

return {
		init : _init
	};

})();

$(document).ready(function() {
	
		memberSearchApi.init();

	});