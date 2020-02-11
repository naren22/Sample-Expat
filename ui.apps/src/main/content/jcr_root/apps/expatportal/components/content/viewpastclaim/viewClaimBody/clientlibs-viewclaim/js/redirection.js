$(document).ready(function() {

    var remoteMyUHGViewClaims;

	$('.my-uhc-link').on('click',function(e){
        e.preventDefault();
        window.publishPostPageData ('trackSiteOutboundLinkClick',{
     		  "actions": { //Custom Link Tracking Fields    
         			  "linkText": "US Claims from View Claims", //text displayed on the link
         			  "linkDescription": "US Claims from View Claims"  //to distinguish and identify the context    
     					 }
  			});
  		// Satellite Function Call 
  		_satellite.track('trackSiteOutboundLinkClick');
		var href = $(this).attr('data-href');

		var newForm = makeExternalCallViewClaimSearch(href);
        if(newForm){
        remoteMyUHGViewClaims = window.open(href, 'accessPortalViewClaimsPopupId');
                          if (remoteMyUHGViewClaims.opener == null) remoteMyUHGViewClaims.opener = window;
                            remoteMyUHGViewClaims.opener.name = "accessPortalViewClaimsPopup";
                            remoteMyUHGViewClaims.focus();
                    newForm.appendTo('body').submit();
        }
	});
});

function makeExternalCallViewClaimSearch(url) {
    var tkey = sessionStorage.getItem("tkey");
var newForm = null;
    if (!tkey) {
        alert("It seems your session / token is expired");
        window.location = $("#header").data("loginpage");
        return newForm;
    } else {

        $.ajax({
            url:"/bin/token/gen.txt",
            data:{ 'key': tkey},
            type:"POST",
            async: false,
            success: function(data) {
                if (data.token) {
                    newForm = $('<form>', {
                        'action': url,
                        'method': "GET",
                         'target' : 'accessPortalViewClaimsPopupId' 
                    }).append(jQuery('<input>', {
                        'name': 'opentoken',
                        'value': data.token,
                        'type': 'hidden'
                    }));

                 }
            }

        });
         return newForm;
    }


}