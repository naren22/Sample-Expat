var providerDetailID = "";
var addressContentLoaded = false;
var distanceVal = "";

var showBackToSearchButton = false;
var showBackToSearchResultButton = false;

var providerDetailsAPI = (function() {
               var searchTimeout;

               var settings = {
                              "async" : true,
                              "crossDomain" : true,
                              "method" : "POST",
                              "headers" : {
                                             "Content-Type" : "application/json",
                                             "cache-control" : "no-cache",
                              },
                              "processData" : false
               };
               var data = {
                              "query" : "Allergy",
                              "city" : "hyderabad",
                              "country" : "india"
               }
               var _renderProviderDetails = function(providerDetails) {
                              var providerDetailContainer = $("#provider-details-container");
                              $("#autocomplete-container .search-results").remove();
                              $(".info-gop").hide();
                              if (providerDetails) {
                                             $('.provider-detail-card').remove();
                                             var parser = new DOMParser();
                                             var temp = $("#provider-detail-template").html();
                                             var tpl = parser.parseFromString(temp, "text/html");
                                  		   	$("html, body").animate({ scrollTop: 0 }, "fast");

                                             $(tpl).find(".user-name h3").text(providerDetails.name);
                                             var specialityElements = _getSpecialityElements(providerDetails.specialty);
                                             $(tpl).find(".specialties").append(specialityElements.html());
                                             $(tpl).find(".facilityText").text(providerDetails.providerType[0].name);
                                             var url=_getMobileOperatingSystem(providerDetails);
           									 $(tpl).find(".addressSection").prop("href",url);
                                             $(tpl).find(".addressSection").prop("target","_blank");
                                             
                                             $(tpl).find(".addressSection p").text(
                                                                           providerDetails.address[0].full + ", "
                                                                                                         + providerDetails.address[0].city[0].name + ", "
                                                                                                         + providerDetails.address[0].country[0].name + " "
                                                                                                         + providerDetails.address[0].postalcode);
                                		  if(providerDetails.phone){
                                  			var tempPhoneLinkProp = "callto:+" + providerDetails.phone;
                                             //var tempPhoneLinkProp = "tel:" + providerDetails.phone;
                                             $(tpl).find(".phoneLink").text("+"+providerDetails.phone).attr('href',tempPhoneLinkProp);
                                          }
                                		  if(providerDetails.website){
                                             $(tpl).find(".emailLink").text(providerDetails.website).attr('href',"http://" + providerDetails.website);
                                              $(tpl).find(".emailLink").attr('target','_blank');
                               			   }
                                  			var providerNameText = providerDetails.providerType[0].name.toLowerCase();

                                		  if(providerNameText == "hospital" || providerNameText == "outpatient clinic" || providerNameText == "pharmacy"){
												$(tpl).find('.facility-icon').show();
                               				 }
                                			  else
                                 			 {
												$(tpl).find('.user-icon').show();
                                  			  }
                                             if (providerDetails.allowsDirectPay == true) {
                                                            $(tpl).find(".directPayDetails").show();
                                             }

                                             if (providerDetails.language[0].id == 'eng') {
                                                            $(tpl).find(".speaksEnglishDetails").show();
                                             }

                                             var distanceText = providerDetails.DistanceAway;
           									 // $(tpl).find("#distanceDetails").text(distanceText + " KM AWAY");
                                 			 $(tpl).find("#distanceDetails").text(distanceVal.toUpperCase());

                            			     $(tpl).find('#btnBackToResults').on('click', function(e) {
                         						  e.preventDefault();
                        						  	 $('.providerSearch').show();
                        						 	  $('#div-result-container').show();
                         							  $('#provider-details-container').hide();
                         							 distanceVal = "";
             								       });


                                             $(tpl).find('#btnBackToSearch').on('click', function(e) {
												e.preventDefault();
												$('.providerSearch').show();
												$('#div-result-container').hide();
												$('#provider-details-container').hide();
												$(".info-gop").show();
												$("div#searchNearby").show();
												$("div#my-uhc-anchor").show();
												distanceVal = "";
											});

												if (showBackToSearchButton == true) {
												$(tpl).find('#btnBackToSearch').show();
												$(tpl).find('#btnBackToResults').hide();
												$("div#searchNearby").hide();
												$("div#my-uhc-anchor").hide();
											}

												if (showBackToSearchResultButton == true) {
												$(tpl).find('#btnBackToSearch').hide();
												$(tpl).find('#btnBackToResults').show();
											}


                                             var detailMain = $(tpl).find("main");
                                             detailMain.addClass("provider-detail-card");
                                             providerDetailContainer.append(detailMain);
                              }
                              ;
               };

               var _getSpecialityElements = function(speaciality) {
                              var text = "";
                              var tempArray = [];
                              var elements = $("<li class=\"elements\"></li>");

                              for (var j = 0; j <= speaciality.length; j++) {
                                             if (speaciality[j] && speaciality[j].name) {
                                                            tempArray.push(speaciality[j].name);
                                             }
                              }

                              var specialitySortedArray = tempArray.sort();

                              for (var k = 0; k < specialitySortedArray.length; k++) {
                                             var li = $("<li>" + specialitySortedArray[k] + "</li>")
                                             elements.append(li);
                              }
                              return elements;
               }
               var _getProviderDetails = function() {
                              
                              //var apiURL = "/content/expatportal/findcare/findaninternationalprovide/jcr:content/par/providersearch.getProviderDeails.html?id=" + providerDetailID;
        var apiURL = "/content/expatportal/findcare/find-an-international-provider/jcr:content/par/providersearch.getProviderDeails.html?id=" + providerDetailID;
                              
                              $.ajax({
            type: 'GET',
            url: apiURL,
            dataType: 'json',
            success: function(jsonData, status, jqXHR) {
                if (jsonData && typeof jsonData !== 'undefined') {
                    providerDetails = jsonData;
                    _renderProviderDetails(providerDetails);
                    $('.providerSearch').hide();
                              $('#div-result-container').hide();
                              $('#provider-details-container').show();
                }
            },
            error: function(jqXHR, status, errorThrown) {
                console.log('JSON FAILED for data');
            }
        });

               };
               var _getSpeaciality = function(speaciality) {
                              var text = "";
                              for (var i = 0; i < speaciality.length; i++) {
                                             text = speaciality[i].name + " ";
                              }
                              return text;
               };

    var _getMobileOperatingSystem = function(providerDetails) {
               var location= providerDetails.address[0].location;
                              var url='https://www.bing.com/maps/?v=2&cp='+location.Latitude+','+location.Longitude+'&lvl=16&dir=0&sty=c&sp=point.'+location.Latitude+'_'+location.Longitude+'_'+providerDetails.name
                                             
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return url;
        }
        if (/android/i.test(userAgent)) {
            return "https://maps.google.com/maps?daddr="+location.Latitude+","+location.Longitude+"&amp;ll=";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
           return "maps://maps.google.com/maps?daddr="+location.Latitude+","+location.Longitude+"&amp;ll=";
        }

        return url;
    }

               return {
                              getProviderDetails : _getProviderDetails
               };

})();
$(document).ready(function() {
               
});
