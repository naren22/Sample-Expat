$(document).ready(function() {

	
	//this is my change

    removeOtherMemberData();
    //Redirection Logic Start - QuickLinks

  //  $('.bottom-button-entry > a').on("click", function(e) {
    $('#bottomLinks-first-container ,#bottomLinks-centre-container , #bottomLinks-last-container').on("click", function(e) {
        e.preventDefault();
        var href = $(this).find(".bottom-button-entry > a").attr("href");
        var isExternal = $(this).parent().attr("data-isExternalLink");
		var descripttion = $(this).find(".card-body").find("p").text();
        var btnTitle = $(this).find(".card-body").find(".promo-title").text();



		window.publishPostPageData ('trackBottomCategoryLinkClick', {
        
            "actions": { //Custom Link Tracking Fields    
                "linkText":  btnTitle, //text displayed on the link
                "linkDescription": descripttion  //to distinguish and identify the context    
                   
            }
        
        });

		_satellite.track('trackBottomCategoryLinkClick');

        if (isExternal) {
            makeExternalCall(href);
        } else {
            if (href) {
				var isIE = /*@cc_on!@*/false || !!document.documentMode;
               
                if(isIE){
                	window.location.href=href;
                }else{
					window.open(href);
                }
            }
        }


    });

    //Redirection Logic End - QuickLinks

    function makeExternalCall(url) {
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
                        var newForm = $('<form>', {
                            'action': url,
                            'method': "POST"
                        }).append(jQuery('<input>', {
                            'name': 'opentoken',
                            'value': data.token,
                            'type': 'hidden'
                        }));
                        newForm.appendTo('body').submit()
                    }
                });
        }

    }

    function removeOtherMemberData() {
        var headerElement = $("#header");
        var groupIDFromHeader = headerElement.data("groupid");
        if(undefined==groupIDFromHeader){
            $("#bottomLinks-centre-container >>> div[data-groupid]").each(function() {
                    var configuredgroupID = $(this).data("groupid");
                    if (configuredgroupID && configuredgroupID != undefined) {
                        $(this).remove();
                    }
                });
                        $("#bottomLinks-first-container >>> div[data-groupid]").each(function() {
                    var configuredgroupID = $(this).data("groupid");
                    if (configuredgroupID && configuredgroupID != undefined) {
                        $(this).remove();
                    }
                });
                        $("#bottomLinks-last-container >>> div[data-groupid]").each(function() {
                    var configuredgroupID = $(this).data("groupid");
                    if (configuredgroupID && configuredgroupID != undefined) {
                        $(this).remove();
                    }
                });
        }
       else if (groupIDFromHeader) {
           	var matchFound=false;
            $("#bottomLinks-centre-container >>> div[data-groupid]").each(function() {
                var configuredgroupID = $(this).data("groupid");
                if (configuredgroupID && configuredgroupID != groupIDFromHeader) {
                    $(this).remove();
                }else{
					matchFound=true;
                }
            });
            if(matchFound){
				$("#bottomLinks-default-centre").remove();
            }
           matchFound=false;
             $("#bottomLinks-first-container >>> div[data-groupid]").each(function() {
                var configuredgroupID = $(this).data("groupid");
                if (configuredgroupID && configuredgroupID != groupIDFromHeader) {
                    $(this).remove();
                }else{
					matchFound=true;
                }
            });
           if(matchFound){
				$("#bottomLinks-default-first").remove();
            }
           matchFound=false;
            $("#bottomLinks-last-container >>> div[data-groupid]").each(function() {
                var configuredgroupID = $(this).data("groupid");
                if (configuredgroupID && configuredgroupID != groupIDFromHeader) {
                    $(this).remove();
                }else{
					matchFound=true;
                }
            });
           if(matchFound){
				$("#bottomLinks-default-last").remove();
            }

        }
    }




});