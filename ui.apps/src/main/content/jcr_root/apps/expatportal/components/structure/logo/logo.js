// Back-end JavaScript for logo component
use(function () {

    // default logo for mobile vs desktop screen;
    var defaultLogoUrl = "/apps/expatportal/clientlibs/icons/logo-uhcg.png";
    var defaultRedirectUrl = "/content/expatportal/homepage.html";
    var finalUrl = {} ;

    var logoUrl = pageProperties.logoUrl;
    var redirectUrl = pageProperties.redirectUrl;

    if (logoUrl != undefined ) {
        finalUrl.logoUrl = logoUrl;
    }
    else{
    	finalUrl.logoUrl = defaultLogoUrl;
    }
    if (redirectUrl != undefined ) {
        finalUrl.redirectUrl = redirectUrl;
    }
    else{
    	finalUrl.redirectUrl = defaultRedirectUrl;
    }
    return finalUrl;
});
