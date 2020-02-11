function makeExternalCalllcl(url,openInNewTab) {

        var tkey = sessionStorage.getItem("tkey");
        if (!tkey) {
            alert("It seems your session / token is expired");
            window.location = $("#header").data("loginpage");
        } else {

            $.post("/bin/token/gen.txt", {
                    key: tkey
                },
                function(data, status) {
                    if (data.token) {
						var newForm;
                        if(openInNewTab) {
                         newForm = $('<form>', {
                            'action': url,
                            'method': "GET",
                           'target' : '_blank'
                        }).append(jQuery('<input>', {
                            'name': 'opentoken',
                            'value': data.token,
                            'type': 'hidden'
                        }));
                            }else {
						 newForm = $('<form>', {
                            'action': url,
                            'method': "GET"
                        }).append(jQuery('<input>', {
                            'name': 'opentoken',
                            'value': data.token,
                            'type': 'hidden'
                        }));

                            }
						// newForm.attr("target","_blank");
                        newForm.appendTo('body').submit();
                    }
                });
        }
}

$(document).ready(function() {


    //global-footer-anchor-expat-portal
    $('#quicklink').on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

		window.publishPostPageData('trackBottomUserSettingsLinkClick',{

    	"actions": { //Custom Link Tracking Fields    
        "linkText": $('#quicklink span').text(), //text displayed on the link
        "linkDescription": "Link to open account settings from footer"  //to distinguish and identify the context    
           
   	 }

	});

// Satellite Function Call 
_satellite.track('trackBottomUserSettingsLinkClick');

        var href = $(this).data("laddr");
         var isExternallcl = $(this).data("isexternallink");
        var openInNewTab=false;
        var targetValue = $(this).attr("target");
        if(targetValue=="_blank"){
				openInNewTab=true;
		}
        if(  $('#warning-message-submit-claim').length > 0){ 
			headerLink = href;
            isExternal= isExternallcl;
			//displayMenuWarning();
		} else if (isExternallcl) {

            //makeExternalCalllcl(href,openInNewTab);
            //already handled in opennewtabfunction
        } else {
            if (href) {
                if(openInNewTab) {
 						window.open(href);
                 }else{
              		    window.location = href;
                }
            }
        }

		e.preventDefault();
    });

    //Redirection Logic End - Footer



});

