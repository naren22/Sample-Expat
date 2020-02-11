$(document).ready(function() {
    var remoteMyUHG;
    //Redirection Logic Start - QuickLinks
    
    $('.quicklink > a').on("click", function(e) {
        tagPublishPostPageData($.trim($(e.target).parent().parent().parent().find('p').html()),'trackHomeTileClick');        
        e.preventDefault();
        var href = $(this).attr("href"); 
        var isExternal = $(this).parent().attr("data-isExternalLink");
        if (isExternal) {
            makeExternalCall(href);
        } else {
            if (href) {
                window.location = href;
            }
        }
        

    });
    
    $('.myuhc-button').on('click',function(e){
        e.preventDefault();
        
        var linkText = $(this).find(".myuhc-text").text().trim();
        
        window.publishPostPageData ('trackSiteOutboundLinkClick',{
            
            "actions": { //Custom Link Tracking Fields    
                "linkText":linkText, //text displayed on the link
                "linkDescription": linkText  //to distinguish and identify the context    
                
            }
            
        });
        
        // Satellite Function Call 
        _satellite.track(' trackSiteOutboundLinkClick ');
        
        
        var href = $(this).data('href');
        var linkdata = $(this).data('link');
        if(linkdata === 'accessPortal'){
            var newForm =  newTabExternalCall(href);
            remoteMyUHG = window.open(href, 'accessPortalPopupId');
            if (remoteMyUHG.opener == null) remoteMyUHG.opener = window;
            remoteMyUHG.opener.name = "accessPortalPopup";
            remoteMyUHG.focus();
            newForm.appendTo('body').submit();
        }else{
            makeExternalCall(href);
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
                               'method': "GET"
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
    
    function newTabExternalCall(url) {
        var tkey = sessionStorage.getItem("tkey");
        var newForm = null;
        if (!tkey) {
            alert("It seems your session / token is expired");
            window.location = $("#header").data("loginpage");
        } else {
            
            $.post("/bin/token/gen.txt", {
                key: tkey
            },
                   function(data, status) {
                       if (data.token) {
                           newForm = $('<form>', {
                               'action': url,
                               'method': "GET",
                               'target' : 'accessPortalPopupId' 
                           }).append(jQuery('<input>', {
                               'name': 'opentoken',
                               'value': data.token,
                               'type': 'hidden'
                           }));
                           /*remoteMyUHG = window.open(url, 'accessPortalPopupId');
                           if (remoteMyUHG.opener == null) remoteMyUHG.opener = window;
                           remoteMyUHG.opener.name = "accessPortalPopup";
                           remoteMyUHG.focus();
                           newForm.appendTo('body').submit();*/
                       }
                   });
        }
        return newForm;
        
    }
});
