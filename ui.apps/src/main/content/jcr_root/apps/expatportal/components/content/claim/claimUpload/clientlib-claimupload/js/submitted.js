function showSubmittedSuccess(id){

 $(".progress-tracker").hide();
     $(".claims").hide();
    // $(".claimUpload").hide();
     //$(".reviewClaim").hide();



	$("#excellaSubId span").text(id);
    $("#dateConfirmation").text(formatDate(new Date()));
    $(".submitted_claimInfo .k-content").show();
    sessionStorage.removeItem("step");
	sessionStorage.removeItem("step1_data");
    sessionStorage.removeItem("step2_data");
    $('#warning-message-submit-claim').remove();
}

function showTimeout(){
	$("#exela-timeout").show();
}


function closeExcelaTimeout(){
	pageDataLayer.content.pageName = $('#review-submit-title').text();
    window.publishPostPageData ('trackClaimJourneyStep',{

        "claims": { //Custom Link Tracking Fields    
            "claimStep": "step 3" //Claim journey step
                }
    });
    _satellite.track('trackClaimSubmitPageLoad');
	$("#exela-timeout").hide();
}

function closeFileMissingNote(){
	 pageDataLayer.content.pageName = $('#review-submit-title').text();
     window.publishPostPageData ('trackClaimJourneyStep',{

         "claims": { //Custom Link Tracking Fields    
             "claimStep": "step 3" //Claim journey step
                }
   });
     _satellite.track('trackClaimSubmitPageLoad');
    $("#file-missing-note").hide();
   editFiles();

}

function formatDate(date) {
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  
  var hrs=date.getHours();
  var mins=date.getMinutes();
  var secs = date.getSeconds();

  hrs = hrs < 10 ? "0" + hrs : hrs;
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  return day + '-' + monthNames[monthIndex] + '-' + year+","+ " " +hrs+":"+mins+":"+secs;
}

$(document).ready(function(){

    $("button.postsubmit").on("click",function(){
    	trackAnalyticsData($(this).text(),'button to navigate steps');
		var uri = $(this).data("href");
        window.location=uri;
    });
});

