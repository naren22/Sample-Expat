
		function openChangeLocation() {
            //change location Tagging 
            window.publishPostPageData ('trackSearchLinkClick',{

    			"actions": { //Custom Link Tracking Fields    
       			 "linkText": "Change Location", //text displayed on the link
       			 "linkDescription": "Button to open change location window"  //to distinguish and identify the context    
           
   		 }

		});

		// Satellite Function Call 
		_satellite.track('trackSearchLinkClick');	

    		$('#location-change-container').css('display','none');
     		$('#location4').val("");
			document.getElementById("change-location").style.display = "block";

		}


		function onLocationChange() {


			if ($('input#location4').val().length > 0) {
				$('#location-change-container').css('display','none');
			} else {
				$('#location-change-container').css('display','block');

			}

            if ($('input#location4').val().length > 0) {
				$('#loc').css('display','none');
			}

		}




		function closeChangeLocation() {
			document.getElementById("change-location").style.display = "none";
           $("#autocomplete-list").remove();
		}

		function openHowCanWeHelp() {
			document.getElementById("how-can-we-help-dialog").style.display = "block";
		}

		function closeHowCanWeHelp() {
			document.getElementById("how-can-we-help-dialog").style.display = "none";
		}
		function openRequestDirectBtn(event) {
			console.log('event ', event);
			sessionStorage.removeItem("providerDetails");
			var card = $(event.target).parent().parent().parent();
			var providerDetailsObject = {};
			providerDetailsObject.name = card.find('#provider-card-name h4 a').text();
			providerDetailsObject.address = card.find('#card-address div p').text();
			providerDetailsObject.number = card.find('#card-contact a').text();
			sessionStorage.setItem("providerDetails",JSON.stringify(providerDetailsObject));
			
	        document.getElementById("gop-important-notice").style.display = "block";
	    }

	   	function closeRequestDirectBtn() {
	        document.getElementById("gop-important-notice").style.display = "none";
	        window.location.href="/content/expatportal/findcare/arrange-payment-to-provider.html?wcmmode=disabled";
	    }


		function autoComplete() {
			var searchValue = document.getElementById("provider-search-value");
			console.log(searchValue.value.length);
			if (searchValue.value.length > 0) {
				document.getElementById("autocomplete-container").style.display = "block";
				document.getElementById("search-criteria-container").style.display = "block";
                document.getElementById("search-criteria-error-msg").style.display = "none";
			} else {
				document.getElementById("autocomplete-container").style.display = "none";
				document.getElementById("search-criteria-container").style.display = "none";
			}
		}
		
		   function displayFilterProvider() {
		       //$('#filter-container').attr('style','display:block !important');
		       $('#filterProvider').show();
		       $('#filterProviderMsg').hide();
		       $('.filter-container-sm .accordion').trigger('click');
		   }
		   
		   function closeFilterProvider() {
		        $("#filterProviderMsg").hide();
		        $('#filterProvider').hide();
		        $('.filter-container-sm .accordion').trigger('click');
		    }
		   
		    function closeLimitProvider() {
		        document.getElementById("limit-provider-result").style.display = "none";
		    }

$(document).ready(function(){

		        $('#new-search-link , .new-search').click(function(e){
		    		e.preventDefault();
		            location.reload();
		        });
 });
