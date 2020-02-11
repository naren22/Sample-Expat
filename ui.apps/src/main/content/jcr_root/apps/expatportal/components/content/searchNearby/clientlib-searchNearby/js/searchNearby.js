$(document).ready(function() {
    
   var remoteMyUHGNearBy;
    
    $("div#searchNearby a").on("click",function(){

        //Search near by tagging
		window.publishPostPageData ('trackSearchLinkClick',{

   		 "actions": { //Custom Link Tracking Fields    
       		 "linkText": "Search Nearby", //text displayed on the link
       		 "linkDescription": "Button to open search nearby window"  //to distinguish and identify the context    
           
   		 }

		});

		// Satellite Function Call 
		_satellite.track('trackSearchLinkClick');

        $('#search-criteria-container').hide();
        $('#filter-container').show();
        searchJsApi.search_nearby();
    });
    
    $('.my-uhc-anchor').on('click',function(e){
        e.preventDefault();
        window.publishPostPageData ('trackSiteOutboundLinkClick',{
      		 "actions": { //Custom Link Tracking Fields    
          			  "linkText": "US Provider Search link", //text displayed on the link
          			  "linkDescription": "US Provider Search link"  //to distinguish and identify the context    
      					 }
   			});
   		// Satellite Function Call 
   		_satellite.track('trackSiteOutboundLinkClick');
        var href = $(this).attr('href');
        makeExternalCallSearch(href);
    });
});


function makeExternalCallSearch(url) {
    var tkey = sessionStorage.getItem("tkey");
    if (!tkey) {
        alert("It seems your session / token is expired");
        window.location = $("#header").data("loginpage");
    } else {

         remoteMyUHGNearBy = window.open(url, 'accessPortalNearbyPopupId');
                       if (remoteMyUHGNearBy.opener == null) remoteMyUHGNearBy.opener = window;
                       remoteMyUHGNearBy.opener.name = "accessPortalNearbyPopup";
                       remoteMyUHGNearBy.focus();
                       newForm.appendTo('body').submit();
       
    }
    
}
     