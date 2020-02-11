var attributeArrayObj = {};
var paymentDetailRequestData = {};
var currencyCodeArray = [];
var totalPage = 0;
var currentPageIndex = 0;

var filterClaims = (function() {
	
	

	var _displayCoverageFilter = function(filterJson) {
		if (filterJson && filterJson.length > 0) {
			for (var i = 0; i < filterJson.length; i++) {
				if(i < 4){
					var filterItem = '<label class="refine-checkbox-container"><span class="text">' + filterJson[i].name + '</span><input data-filterId=' +filterJson[i].id + ' type="checkbox"><span class="checkmark"></span></label>';
					$('.filter_coverage_type .mb-5').append(filterItem);
					//$('.filter_coverage_type').css('max-height',$('.filter_coverage_type').innerHeight() + $('.mb-5').innerHeight()+ $('.mb-5').innerHeight());
                    $('.filter_coverage_type').css('max-height','162px');
				}
				else
					{
						var filterItem = '<label class="refine-checkbox-container"><span class="text">' + filterJson[i].name + '</span><input data-filterId=' +filterJson[i].id + ' type="checkbox"><span class="checkmark"></span></label>';
						$('.filter_status .mb-5').append(filterItem);
						 //$('.filter_status').css('max-height',$('.filter_status').innerHeight() + $('.mb-5').innerHeight()+ $('.mb-5').innerHeight());
                        $('.filter_status').css('max-height','195px');
					}
			}
		}
	};
	
	var _displayMemberFilter = function(){
			var memberData = sessionStorage.getItem("memberData") ? JSON.parse(sessionStorage.getItem("memberData")) : null;
			var memberId = memberData &&  memberData.MemberIdentifier ?  memberData.MemberIdentifier : "";
			var memberFilterUrl = "/bin/expatportal/filtermemberid?memberId=" + memberId;
			 
			if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'block';
			}
			
				var settings = {
						"async" : true,
						"crossDomain" : true,
						"url" : memberFilterUrl,
						"method" : "GET",
						"processData" : false,
						"contentType" : false,
						"data" : ""
					}
					$.ajax(settings).done(function(response) {
						var filterJson = JSON.parse(response);
						for (var i = 0; i < filterJson.length; i++) {
							 var filterItem = '<label class="refine-checkbox-container"><span class="text">' + filterJson[i].FirstName + '</span><input data-filterId=' +filterJson[i].MemberIdentifier + ' type="checkbox"><span class="checkmark"></span></label>';
								$('.filter_member .mb-5').append(filterItem);
								$('.filter_member').css('max-height',$('.filter_member .mb-5').innerHeight() + 97);
						}
						
						var memberData = sessionStorage.getItem("memberData") ? JSON.parse(sessionStorage.getItem("memberData")) : null;
						 
						 var relationShipType = memberData && memberData.REL_TYP_CD ? "" + memberData.REL_TYP_CD : "";
						 
						if(relationShipType && relationShipType != "18" && relationShipType !="34"){
							$('.filter_member').hide();
							$('.filter_member_accordion').hide();
						}
						
						if(document.getElementById("system-error-note-loader")){
							document.getElementById("system-error-note-loader").style.display = 'none';
						}
			
					}).fail(function(response) {
						console.log('fail ', response);
						if(document.getElementById("system-error-note-loader")){
							document.getElementById("system-error-note-loader").style.display = 'none';
						}
					});
		};
		
		var _displayProviderFilter = function(providers){
			
			var tmp = [];
			for(var i=0; i<providers.length;i++){
				tmp.push(providers[i].provider);
			}
           $('.filter_provider #filterByProvider').empty();
			var providerJson = [];
			const map = new Map();
			for (var j=0; j<tmp.length;j++) {
			    if(!map.has(tmp[j].id)){
			        map.set(tmp[j].id, true);    // set any value to Map
			        providerJson.push({
			            id: tmp[j].id,
			            name: tmp[j].name,
			            firstName: tmp[j].firstName,
			            lastName: tmp[j].lastName
			        });
			    }
			}
            if(providerJson.length != 1){
			 $('.filter_provider #filterByProvider').append('<option></option>');
            }
			for (var k = 0; k < providerJson.length; k++) {
				if(providerJson[k] && providerJson[k].id)
				var providerText = providerJson[k].name ? providerJson[k].name : "";
				
				if(providerText == "" && (providerJson[k].firstName || providerJson[k].lastName)){
					providerText += providerJson[k].firstName ? providerJson[k].firstName + " " : "";
					providerText += providerJson[k].lastName ? providerJson[k].lastName : "";
				}
				if(providerText){
				 var filterItem = '<option data-id=' +providerJson[k].id + '>' + providerText + '</option>';
					$('.filter_provider #filterByProvider').append(filterItem);
					
				}
				$('.filter_provider').css('max-height',$('.filter_provider .mb-5').innerHeight() + 30);
			}

			
		}
				
	
	
	 return {

		 displayCoverageFilter : _displayCoverageFilter,
		 displayMemberFilter : _displayMemberFilter,
		 displayProviderFilter : _displayProviderFilter
};
})();


$(document).ready(function(){
	
	setTimeout(function(){
		filterClaims.displayMemberFilter();
	},2000);
	


});