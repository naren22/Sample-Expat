$(function () {
			$('#datetimepicker2').datetimepicker({
				viewMode: 'days',
				allowInputToggle: true,
				format: 'DD-MMM-YYYY',
				extraFormats: ['DD-MMM-YYYY', 'DD-MM-YYYY'],
				locale: 'en',
				maxDate: moment().endOf('d'),
				useCurrent: false,
				icons: {
					up: "fa fa-chevron-circle-up",
					down: "fa fa-chevron-circle-down",
					next: 'fa fa-chevron-circle-right',
					previous: 'fa fa-chevron-circle-left'
				}
			});

});


var currentMenuURL = "";


function displayMenuWarning(){
			//currentMenuURL = url;

			document.getElementById("warning-message-submit-claim").style.display = "block";
		}



		function gotoUrlMenuWarning(){
			trackAnalyticsData('YES, CONTINUE AND LOSE CLAIM DATA','Navigating from submit claim to Manu items');

			//window.location.href = currentMenuURL;
			sessionStorage.removeItem('step');
			sessionStorage.removeItem('step1_data');
			sessionStorage.removeItem('step2_data');
			sessionStorage.removeItem('CNTRYDefIndicator');
			sessionStorage.removeItem('substep');
			sessionStorage.removeItem('isSubscriber');
			removeAllFiles();
			/*console.log("gotoUrlMenuWarning");
			console.log(headerLink);
			console.log(isExternal)*/
			if(headerLink == "#"){
				checkIfExternal(true,"https://stg.myuhcg.com/content/expatportal/claims/submitnewclaims.external.html");
			} else{
			checkIfExternal(isExternal,headerLink);
			}
			document.getElementById("warning-message-submit-claim").style.display = "none";
		}
		

$('#header a').on('click',function(e){
    e.preventDefault();
   // displayMenuWarning($(this).attr('data-link-url'));

});

function hideMenuWarning(){
	trackAnalyticsData('NO, TAKE ME BACK','Coming back to the step from cancel pop up');
			document.getElementById("warning-message-submit-claim").style.display = "none";
		}

function cancelClaim(event) {
			document.getElementById("cancel-claim").style.display = "block";
			var targetHtml = $(event.target).html();
		    if(targetHtml.indexOf('span') != -1){
					targetHtml = $(event.target).children().html();
		    }
			tagPublishPostPageData(targetHtml,'trackNewClaimSubmitLinkClick');
		}

		function closeClaim() {
			trackAnalyticsData('NO, TAKE ME BACK','Coming back to the step from cancel pop up');
			document.getElementById("cancel-claim").style.display = "none";
		}

function cancelClaimNotif() {
	trackAnalyticsData('YES, CONTINUE AND LOSE CLAIM DATA','Cancel claim submittion in between steps');
	removeAllFiles();
	sessionStorage.setItem('cancelClaim','true');
	sessionStorage.removeItem('step');
	sessionStorage.removeItem('step1_data');
	sessionStorage.removeItem('step2_data');
	sessionStorage.removeItem('CNTRYDefIndicator');
	sessionStorage.removeItem('substep');
	sessionStorage.removeItem('isSubscriber');
	checkIfExternal(isCancelExternal,cancelBtnLink);
}


function trackAnalyticsData(linkText,  linkDescription){
	window.publishPostPageData ('trackNewClaimSubmitLinkClick',{

		    "actions": { //Custom Link Tracking Fields    
		        "linkText": linkText, //text displayed on the link
		        "linkDescription": linkDescription  //to distinguish and identify the context    
		           
		    }

		});

		// Satellite Function Call 
		_satellite.track(' trackNewClaimSubmitLinkClick');
}

