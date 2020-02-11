var getPreference ={

    "response":{},
    "primaryEmail":"",

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

    "exe" : function(){


        	var memId = getMbrId(); //check
        	var d = new Date();

        	var URL ="/content/expatportal/claims/submitnewclaims/jcr:content/par/submitclaimsform.claimService.paymentpreference.json?memberId="+memId+"&calltime="+ d.getTime();

    		var settings = this.init(URL);
			var that = this;

            $.ajax(settings).done(function(res){
               if (res && res.preferences && res.preferences.length > 0) {
                	that.response = res.preferences[0];
                   var preferences = res.preferences[0];

                   if(preferences.CNTRYDefIndicator == 'undefined' || preferences.CNTRYDefIndicator == 'null' || preferences.CNTRYDefIndicator == 'Yes'){				
                        $("#viewPreference").trigger("nopref");
                    }else{
                       $("#viewPreference").trigger("loaded");
                    }

                }else{

                    $("#viewPreference").trigger("nopref");
                }

            }).fail(function(){
				getPreference.error(true);
            });


	},


    "setView" : function(){

         $("#my-profile-reimbursement-ctn #name, #my-profile-reimbursement-ctn .name").text(this.response.PAYEE_NM);
         $(".cntry").text(this.response.CNTRY_NM);
         $(".crncy").text(this.response.CRNCY_NM);
         $(".bnkname").text(this.response.ORG_NM);



    },

    "dynamicBankingFields": function(){
		var dynamicBankingFields=[];
        var bnkDetail={
        label: "",
        value: ""
        };


        for(i=0; i<15; i++){
            var index=i+1;
    		bnkDetail.value = this.response["BNK_DTL_"+index+"_TXT"];
            bnkDetail.label = this.response["ATR_DESC_"+index];
            var pFlag = true;

            if( this.response["ATR_DESC_"+index]){

				dynamicBankingFields.push( JSON.parse(JSON.stringify(bnkDetail)));
            }

		 }
        return dynamicBankingFields;
    },
    "getCurrentMethod": function(){
        return this.response.PAY_METH_CD.toLowerCase();
    },

    "addrBankingFields": function(){
		var addrBankingFields=[];
        var addrDetail={
        label: "",
        value: ""
        };


        for(i=0; i<7; i++){
            var index=i+1;
    		addrDetail.value = this.response["ADR_LN_"+index+"_TXT"];

			addrBankingFields.push( JSON.parse(JSON.stringify(addrDetail)));

		 }
        return addrBankingFields;
    },
    "editPreference": function(){
    	console.log("from edit pref click");
    	if(is_ie = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1){
    		//checkCurrentMethod();
    	} else {
    		$("#viewPreference").trigger("edit_clicked");
    	}
		editPreferenceObj.setValuesEFT(getPreference.response);
		$(".editpreference").show();
    	$(".viewpreference").hide();

	},
    "error":function(show){
        $("#system-error-note-loader").hide();
        if(show){
        $("#system-error-note").show();
        }else{
			$("#system-error-note").hide();
        }

    }

};