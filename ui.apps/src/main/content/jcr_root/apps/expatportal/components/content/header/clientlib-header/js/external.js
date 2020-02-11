var headerLink = "";
var isExternal = false;
var cancelBtnLink;
var isCancelExternal=false;
var nextpage =false;
var remoteOverviewMyUHG;
function getMbrId(){


   
    var mdata =sessionStorage.getItem("memberData");
    if(mdata){
        return JSON.parse(mdata).MemberIdentifier;
    }else{
        return  $("#header").data("mmid");
    }
}



$(document).ready(function() {
    var remoteMyUHG;
    //adding key into session storage
    var ibackbutton = document.getElementById("backbuttonstate");
    if (ibackbutton.value == "0") {
        // Page has been loaded for the first time - Set marker
        ibackbutton.value = "1";
        // alert('First time load');
    } else {
       
        /*sessionStorage.removeItem("tkey");
        $("#header").removeAttr('data-tkey');
        location.reload(true); */
    }
    if(!sessionStorage.getItem("tkey")){
        if($("#header").data("tkey")){
            sessionStorage.setItem("tkey",$("#header").data("tkey"));
            $("#header").removeAttr('data-tkey');
        }else{
           
        window.location=$("#header").data("loginpage");//comment it for working without session
        }
    }
    $("button.btn-cancel-claim").each(function(i,ele){
        cancelBtnLink = $(ele).data("link") != undefined ? $(ele).data("link") : "";
        if((cancelBtnLink != "" && cancelBtnLink.indexOf("/content/") == -1) || ($(ele).data("external") != undefined && $(ele).data("external")==true)){
            isCancelExternal =true    
        }
    });
   
    $("button.btn-cancel-claim").on("click",function(e){
        e.preventDefault();
       
        if($('#cancel-claim-container').length > 0){
            cancelClaim(e);
        }
        else{
            checkIfExternal(isCancelExternal,cancelBtnLink);
        }
    }) ;
   
    $(".dropdown.nav-item").on("hide.bs.dropdown", function () {
        $(".btn.account-btn").html('Account / Profile <span class="caret-down" id="caret-down"></span>');
    });
    $(".dropdown.nav-item").on("show.bs.dropdown", function () {
        $(".btn.account-btn").html('Account / Profile <span class="caret-up"></span>');
    });

    $("a.dropdown-item, a.nav-link, button.account-btn, a.browser_preferences,a.global-footer-anchor-expat-portal").on("click",function(e){
       /* if($(e.target).is('a.nav-link, a.dropdown-item')){
            tagPublishPostPageData($.trim(this.text), 'trackTopCategoryLinkClick');
        }*/

         //Help & Account Settings Drop down Tagging
        var btnId = $(this).attr('id') ?  $(this).attr('id') : '';
        var trackingDone = false;

        if(btnId.toLowerCase() == 'btnhelp'){
            trackingDone = true;
            window.publishPostPageData ('trackTopUserSettingsLinkClick',{

    "actions": { //Custom Link Tracking Fields    
        "linkText": $(this).find('span.help').text().trim(), //text displayed on the link
        "linkDescription": "Help button from top navigation"  //to distinguish and identify the context    

     }

});
_satellite.track('trackTopUserSettingsLinkClick');

        }

          if(btnId.toLowerCase() == 'btnlogout'){
              trackingDone = true;
            window.publishPostPageData ('trackTopUserSettingsLinkClick',{

    "actions": { //Custom Link Tracking Fields    
        "linkText": $(this).text().trim(), //text displayed on the link
        "linkDescription": "Logout button from top navigation"  //to distinguish and identify the context    

     }

});
_satellite.track('trackTopUserSettingsLinkClick');

        }

         if(btnId.toLowerCase() == 'btnaccountsetting'){
             trackingDone = true;
            window.publishPostPageData ('trackTopUserSettingsLinkClick',{

    "actions": { //Custom Link Tracking Fields    
        "linkText": $(this).text().trim(), //text displayed on the link
        "linkDescription": "Account setting button from top navigation"  //to distinguish and identify the context    

     }

});
_satellite.track('trackTopUserSettingsLinkClick');

        }

        if($(e.target).is('a.nav-link, a.dropdown-item') && !trackingDone){
            tagPublishPostPageData($.trim(this.text), 'trackTopCategoryLinkClick');
        }

       
        var parentDiv = $(e.target).parent();
        if(parentDiv != undefined && !($(parentDiv).hasClass("dropdown"))){
            e.preventDefault();
           
            var href = $(this).data("link-url");//data-linkUrl
            if(href == undefined){
                href = $(this).data("laddr");
            }
            if(href == undefined){
                href = $(this).attr("href");
            }
            isExternal = $(this).data("isExternalLink");
            var openInNewTab=false;
            var targetValue = $(this).attr("target");
            if(targetValue=="_blank"){
                openInNewTab=true;
            }
           
            if(!isExternal){
                isExternal = $(this).data("external");
            }
            if(!isExternal){
                isExternal = $(this).data("isexternalLink");
            }
            if(!isExternal){
                isExternal = $(this).data("isexternallink");
            }
           

           
            if(  $('#warning-message-submit-claim').length > 0 && !openInNewTab){
               
                if($(this).attr("target")){nextpage = true;}
                headerLink = href;

                if(href == "javascript:iperceptions_128337.ipeCC();"){
                    gotoUrlMenuWarning();
                }else{
                    displayMenuWarning();
                }
            }
            else{
                //checkIfExternal(isExternal,href,openInNewTab);
				 if(isExternal){
					if(nextpage){
					   
						makeExternalCalllcl(href,true);
					}else if(openInNewTab){
						var newForm = openInNewTabFunc(href);
						
						let urlArray = href.split('/');
						let targetName = urlArray[urlArray.length - 1];
						let targetId = targetName+"Id";
                       remoteOverviewMyUHG = window.open(href, targetId);
                       if (remoteOverviewMyUHG.opener == null) remoteOverviewMyUHG.opener = window;
                       remoteOverviewMyUHG.opener.name = targetName;
                       remoteOverviewMyUHG.focus();
                       newForm.appendTo('body').submit();
					}
					else{
						makeExternalCall(href);
					}
				}else{
				   
					if(href){
						if(openInNewTab || nextpage) {
							window.open(href);
						}else{
							window.location = href;
						}
					}
				}
            }
           
            //makeExternalCall(href);
           
           
           
        }
       
       
    }) ;
   
    showHideClaimCancelledPopup();
   
});

function showHideClaimCancelledPopup(){
    var cancelFlag = sessionStorage.getItem('cancelClaim');
    if(cancelFlag == 'true'){
        $("#cancel-submit-claim-note").fadeIn("fast");
        setTimeout(function () {
            $('#cancel-submit-claim-note').fadeOut("fast");
        }, 3000);
        sessionStorage.removeItem('cancelClaim');
    }
}

function checkIfExternal(isExternal, href, openInNewTab){
    if(isExternal){
        if(nextpage){
           
            makeExternalCalllcl(href,true);
        }else if(openInNewTab){
            openInNewTabFunc(href);
        }
        else{
            makeExternalCall(href);
        }
    }else{
       
        if(href){
            if(openInNewTab || nextpage) {
                window.open(href);
            }else{
                window.location = href;
            }
        }
    }
}

function makeExternalCall(url){
    var tkey=sessionStorage.getItem("tkey");
    if(!tkey){
        alert("It seems your session / token is expired");
        window.location=$("#header").data("loginpage");
    }else{
       
        $.post("/bin/token/gen.txt",
               {
                   key:tkey
               },
               function(data, status){
                   if(data.token){
                       var newForm = $('<form>', {
                           'action': url,
                           'method':"POST"
                       }).append(jQuery('<input>', {
                           'name': 'opentoken',
                           'value': data.token,
                           'type': 'hidden'
                       }));
                       newForm.appendTo('body').submit();
                   }
               });
    }
   
}

function openInNewTabFunc(url) {
var newForm = null;
    var tkey = sessionStorage.getItem("tkey");
    if (!tkey) {
        alert("It seems your session / token is expired");
        window.location = $("#header").data("loginpage");		
    } else {
       
let urlArray = url.split('/');
let targetName = urlArray[urlArray.length - 1];
let targetId = targetName+"Id";

        $.post("/bin/token/gen.txt", {
            key: tkey
        },
               function(data, status) {
                   if (data.token) {
                       newForm = $('<form>', {
                           'action': url,
                           'method': "GET",
                           'target' : targetId
                       }).append(jQuery('<input>', {
                           'name': 'opentoken',
                           'value': data.token,
                           'type': 'hidden'
                       }));
                       
					  /* let urlArray = url.split('/');
						let targetName = urlArray[urlArray.length - 1];
						let targetId = targetName+"Id";
                       remoteOverviewMyUHG = window.open(url, targetId);
                       if (remoteOverviewMyUHG.opener == null) remoteOverviewMyUHG.opener = window;
                       remoteOverviewMyUHG.opener.name = targetName;
                       remoteOverviewMyUHG.focus();
                       newForm.appendTo('body').submit();*/
                   }
               });
    }
	return newForm;
   
}
