$(function(){
    $(".header").hide();
    $(".globalFooter").hide();
    $(".editpreference").hide();


function isDep(){
		var memberJson = JSON.parse(sessionStorage.getItem("memberData"));
        var dependentCodesArray = ["01","02","09","15","17","19","20","21","23","36","38","53","60"];
        if(memberJson){
           $("#viewPreference .subname").text(memberJson.FirstName+" "+memberJson.LastName);
        getPreference.primaryEmail = memberJson.PrimaryEmailAddress;
        return $.inArray(memberJson.REL_TYP_CD, dependentCodesArray) != -1;
        } else {

            $(".sub").remove();
        }
    }


    var dynamicBankingFields = [{
        label: "SWIFT Code",
        value: "12345678"
    }, {
        label: "Bank Account Number",
        value: "XXXXX3C4D",

    }];
    var dynamicAddressFields = [{
        value: "12345 Mount Eden Roadsd"
    }, {
        value: "12345 Mount Eden Road",

    }, {
        value: "12345 Mount Eden Road",

    }, {
        value: "12345 Mount Eden Road",

    }, {
        value: "12345 Mount Eden Road",

    }];

    function maskLeavingLast(str, lastDigits){
      var d = str.substring(0,str.length-lastDigits);
     return str.replace(d,d.replace(/[0-9A-Za-z]/gi, 'X'));
    
    }

    var currentMethod = 'eft'; //// assign a value base on what return by api
    function displayDynamicBankingFields() {
        var dynamicAddressHTML = document.getElementById("dynamic-banking-reference").children[0];
		$("#dynamic-banking").empty();
        dynamicBankingFields.forEach(function (data, index) {
            var cloneHTML = dynamicAddressHTML.cloneNode(true);
            cloneHTML.classList.remove("hidden-banking-dynamic-container");
            if(data.label === "Bank Account Number" || data.label === "Local Account Number"){
				data.value=maskLeavingLast(data.value,4);
            }
            cloneHTML.children[0].children[0].innerHTML = data.label;
            cloneHTML.children[1].children[0].innerHTML = data.value;
            document.getElementById('dynamic-banking').appendChild(cloneHTML);
        });
    }

    function displayDynamicAddress() {
        var dynamicAddressHTML = document.getElementById("dynamic-address-reference").children[0];
		$("#dynamic-address").empty();
        dynamicAddressFields.forEach(function (data, index) {
            if(index < 4){
                var cloneHTML = dynamicAddressHTML.cloneNode(true);
                cloneHTML.classList.remove("hidden-banking-dynamic-container");
                cloneHTML.children[0].children[0].innerHTML = "Banking Adress " + (index + 1);
                cloneHTML.children[1].children[0].innerHTML = data.value;
                document.getElementById('dynamic-address').appendChild(cloneHTML);
            }
        });
    }

    function checkCurrentMethod() {
        $("#system-error-note-loader").show();
        if (currentMethod === 'chk') {
            document.getElementById('eft-method').style.display = "none";
            document.getElementById('check-method').style.display = "block";
            document.getElementById('reimbursement-method-text').innerHTML = 'Check';
			if(!isDep()){
                $(".check-selector-edit").trigger("click");
                editPreferenceObj.setValuesCHK(getPreference.response);
            }
        }
        if (currentMethod === 'eft') {
            document.getElementById('check-method').style.display = "none";
            document.getElementById('eft-method').style.display = "block";
            document.getElementById('reimbursement-method-text').innerHTML = 'Electronic Fund Transfer';

            displayDynamicAddress();



            if(!isDep()){
                 $(".eft-selector-edit").trigger("click");
           	     editPreferenceObj.getBankDetails( getPreference.response.CNTRY_CD, getPreference.response.CRNCY_CD, true);
            }else{
				editPreferenceObj.getBankDetails( getPreference.response.CNTRY_CD, getPreference.response.CRNCY_CD, true);
            }
        }
        $("#system-error-note-loader").hide();
    }



    $("#viewPreference").on("loaded",function(){

         getPreference.setView();

       	 dynamicAddressFields = getPreference.addrBankingFields();
         currentMethod = getPreference.getCurrentMethod();
		 checkCurrentMethod();
        $("#viewpan").show();
    });

    $(".editpreference").on("bankdetailsloaded",function(e, onload){

        if(onload){
           var bankDetails = editPreferenceObj.getDynamicBankingFields();
           var index=0;
            ///Patch to fix Ordering issue from API - Need to remove if API is fixed. Next 6 lines
            for(i=0;i<15;i++){
				getPreference.response["ATR_DESC_"+(i+1)] ="";
            }
            $.each(bankDetails, function(){
    			getPreference.response["ATR_DESC_"+(bankDetails[index].attributeLineNumber)] = bankDetails[index++].label;
            });

            dynamicBankingFields = getPreference.dynamicBankingFields();
            displayDynamicBankingFields();
            editPreferenceObj.setValuesEFT(getPreference.response);

        }

    });



   // $(".edit-preference-btn").on("click", getPreference.editPreference);
    $("#viewPreference").on("edit_clicked",checkCurrentMethod);
    
    $(".edit-preference-btn").on("click", function(){//     getPreference.editPreference);    	
    	if(is_ie = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1){
        	console.log("from edit pref click from edittttt ie");
        	checkCurrentMethod();    	
        }
    	
    	 getPreference.editPreference();  	
    	
    });
    
    

    $("#editpreferencediv").on("success",function(){

		 getPreference.exe();
        $(".editpreference").hide();
    	$(".viewpreference").show();
    });
    
    function viewPrefLoad(){
     	console.log("memeber data loaded");
        if(isDep()){
           $(".sub").remove();
       }else{
           $(".dep").hide();
            editPreferenceObj.getCountries();
       	editPreferenceObj.getCurrencies();
       }

			getPreference.exe();
    }



    $("#viewPreference").on("memberdata_loaded",function(){
        	console.log("memeber data loaded fsdfsdfsdf");
        	viewPrefLoad();
       
    });

    $(document).ready(function() {
    console.log("from ready");
	setTimeout(function(){
		if((is_ie = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1) &&
				$("#viewPreference").is(':visible')){
                     console.log("from ready to load content");
			viewPrefLoad();
			
		}
	},1000);
	
});


});



