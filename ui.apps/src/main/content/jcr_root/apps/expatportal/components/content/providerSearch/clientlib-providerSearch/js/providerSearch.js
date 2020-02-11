var redoData = {};
var isRedoClicked = false;


var remove_accents = (function(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents =    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖőØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜūùúûüÑñŠšŸÿýŽž";
    var accentsOut = "AAAAAAaaaaaaOOOOOOoOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');

    return strAccentsOut;
});

var searchJsApi = (function() {
	var settings = {
		"async" : true,
		"crossDomain" : true,
		"url" : "/content/expatportal/findcare/find-an-international-provider/jcr:content/par/providersearch.getSearchResults.POST.html",
		"method" : "POST",
		"headers" : {
			"Content-Type" : "application/json",
			"cache-control" : "no-cache",
		},
		"processData" : false
	};
	var data = {
		Others : [ "" ],
		ProviderType : [ "" ],
		Speciality : [ "" ],
		city : "",
		country : "",
		distance : 50,
		location : "",
		query : ""
	};
	
	

	
	var jsonData, currentFocus, resourcePath, providerSearchValue, jsonData, speciality, totalSearchResultCount, displayList, searchData = {}, paginationResultArray = [], paginationIndex = 0;

	var getProviderID = function(jsonData, providerSearchValue, speciality,
			providerSearchValueFromChkBox) {
		var jsonArray = [];
		for (var i = 0; i < speciality.length; i++) {
			var providerIDList = {};
			if (jsonData.specialty[i].name == providerSearchValue
					|| jsonData.specialty[i].name == providerSearchValueFromChkBox) {
				
				providerIDList["name"] = jsonData.name;
				providerIDList["speaciality"] = "Gastroenterology,General Medicine,Gynecology";
				providerIDList["providerType"] = "clinic";
				providerIDList["address"] = "2333,Leiden,Netherlands";
				providerIDList["phone"] = jsonData.phone;
				providerIDList["website"] = jsonData.website;
				providerIDList["language"] = "English";
				providerIDList["allowsDirectPay"] = jsonData.allowsDirectPay;
				jsonArray.push(providerIDList);
			}
		}
		return jsonArray;
	}
	var getSpeaciality = function(speciality) {
		var speacialityStr;
		for (var i = 0; i < 4; i++) {
			if (speacialityStr) {
				speacialityStr = speciality.name;
			} else {
				speacialityStr = speacialityStr + "," + speciality.name;
			}
		}
		return speacialityStr;
	}

	//method to render the result on search landing
	var _renderListTemplate = function(displayList) {
		var template = $("#hidden-listItem-template").html();
		var parser = new DOMParser();
		$(".result-item").remove();
		$('#new-search-container').removeClass('hide').addClass('new-search-container');
	    $('#new-search-line').removeClass('hide').addClass('new-search-line');
	    $(".info-gop").hide();
	    $('#new-search-mv').removeClass('hide').addClass('new-search-mv')
	    
		paginationIndex = 0;
		var searchHeaderText;
		var listBody = $("#div-result-container .col-lg-9");
		var tpl = parser.parseFromString(template, "text/html");
		var searchheader = $(tpl).find("#search-refine-title");
		var cityText = $('#location1').text();
		var tempSearchKeyText = userSearchKeyWord != "" ? userSearchKeyWord
				: (providerSearchValue ? providerSearchValue : "");
		var searchKeyText = tempSearchKeyText != "" ? "'" + tempSearchKeyText+ "'" : "";
		var searchCountText = "";
		if(displayList.length < 100){
			searchCountText = displayList.length > 1 ? displayList.length + " Results for " : displayList.length + " Result for ";
		}
 		else {
			searchCountText =  "100 Results for ";
		}
		
		if(isRedoClicked){
		 var tempCount = totalSearchResultCount < 100 ? totalSearchResultCount : 100;
		 var resultText = totalSearchResultCount > 1 ? totalSearchResultCount+ " Results for map area" : totalSearchResultCount + " Result for map area";
		 searchHeaderText = searchheader.text(resultText);
		}
		else{
			searchHeaderText = searchheader.text(searchCountText + searchKeyText + " near " + cityText);
		}
		$('.controls-pagination-row').hide();
        $('#how-can-we-help-dialog').css('display','none');

		searchheader.addClass('result-item');
		listBody.append(searchHeaderText);
		var filterText = userSearchKeyWord;
		var filterID = document.getElementById(filterText);
		$(filterID).prop('checked', true);

		for (var j = 0; j < displayList.length; j++) {
			displayList[j].counter = j + 1;
		}
		
		if(displayList.length >= 100){
			$('#limit-provider-result').show();
		}
		if (displayList.length > 0 && displayList.length <= 10) {
			var mapDiv = $(tpl).find('#mapcontainer');
			var mapInfoDiv = $(tpl).find('#mapinfo');

			mapDiv.addClass('result-item');
			mapDiv.find('.map').attr('id', 'myMap');
			mapInfoDiv.addClass('result-item');
			listBody.append(mapDiv).append(mapInfoDiv);
			initMap(displayList);

			for (var i = 0; i < displayList.length; i++) {
				tpl = parser.parseFromString(template, "text/html");
				$(tpl).find("#container-rounded p").text(i + 1);
				$(tpl).find("#provider-card-name a").text(displayList[i].name);
				$(tpl).find("#provider-card-name a").attr('data-providerId',displayList[i].providerId);


			$(tpl).find("#provider-card-name a").on('click', function(){
				providerDetailID = $(this).attr('data-providerId');
				distanceVal =  $(this).closest(".card-details").find(".provider-card-distance p").text();
				providerDetailsAPI.getProviderDetails();
				showBackToSearchButton = false;
            	showBackToSearchResultButton = true;
			 });

            $(tpl).find("#card-speciality p").append(_getSpeaciality(displayList[i].specialty));
			$(tpl).find("#card-speciality p a.providerSeeMore").on('click', function(e){
						e.preventDefault();
						providerDetailID = $(this).closest(".card-details").find('#provider-card-name a').attr('data-providerId');
						 distanceVal =  $(this).closest(".card-details").find(".provider-card-distance p").text();
						providerDetailsAPI.getProviderDetails();
						showBackToSearchButton = false;
		            	showBackToSearchResultButton = true;
					});

				$(tpl).find("#card-provider-type").text(displayList[i].providerType[0].name);
				$(tpl).find("#card-address p").text(displayList[i].address[0].full + ", "
								+ displayList[i].address[0].city[0].name + ", "
								+ displayList[i].address[0].country[0].name
								+ " " + displayList[i].address[0].postalcode);


                 if(displayList[i].phone)
                 {
                    $(tpl).find("#card-contact a").text("+" + displayList[i].phone);
					$(tpl).find("#card-contact a").attr("href","tel:+" + displayList[i].phone);                       
                 }

                if(displayList[i].website)
                 {                    
					 $(tpl).find("#card-site a").text(displayList[i].website);
                     $(tpl).find("#card-site a").attr("href","http://" + displayList[i].website);
               		 $(tpl).find("#card-site a").attr('target','_blank');

                 }




				if (displayList[i].allowsDirectPay == true) {
					$(tpl).find("#directPaySection").show();
					$(tpl).find('.gop-important-notice-dialog-open').show();
				}

				if (displayList[i].language[0].id == 'eng') {
					$(tpl).find("#languageSection").show();
				}

				var distanceText = displayList[i].DistanceAway;

				$(tpl).find("#distance p").text(distanceText + " KM AWAY");
				$(tpl).find(".provider-results-cards-container").css("display",
						"block");
				$(tpl).find(".map").css("display", "block");
				$(tpl).find(".no-result-message").css("display", "none");
				$(tpl).find("#search-refine-title").css("display", "block");
				var fragment = $(tpl).find(".col-lg-12");

				var resultItemRow = $(tpl).find(".row.my-3");
				var providerSectionID = "provider-" + displayList[i].providerId;
				resultItemRow.attr('id', providerSectionID);
				resultItemRow.addClass("result-item");
				listBody.append(resultItemRow);
			}
			;
		} else {
			paginationResultArray = [];
			showResultsWithPagination(displayList);
		}
	};
     
	//method to show results with pagination
	function showResultsWithPagination(displayList) {
		if (displayList.length > 0) {
			var tmpList = displayList.length > 100 ? displayList.slice(0,100) : displayList; 
			var tempResultArray = tmpList;
			var totalNumberOfPaginationSet = Math
					.ceil(tempResultArray.length / 10);

			for (var i = 0; i < totalNumberOfPaginationSet; i++) {
				paginationResultArray[i] = tempResultArray.splice(0, 10);
			}

			paginationIndex++;
			displayIndividualPaginationResult(1);
		}
	}

	function displayIndividualPaginationResult(index) {

		if (index > 0 && index <= paginationResultArray.length) {
			var listBody = $("#div-result-container .col-lg-9");
			var template = $("#hidden-listItem-template").html();
			$('.providers-result-item').remove();
			$('#mapContainerWrapper').remove();
			$('#mapInfoWrapper').remove();

			var parser = new DOMParser();
			var tpl = parser.parseFromString(template, "text/html");
			var paginationDiv = $(tpl).find('.controls-pagination-row');
			var spanDescription = $(paginationDiv).find('.description');
			$(spanDescription).text(
					index + " of " + paginationResultArray.length)

			var displayList = paginationResultArray[index - 1];

			if (displayList.length > 0) {
				var mapDiv = $(tpl).find('#mapcontainer');
				var mapInfoDiv = $(tpl).find('#mapinfo');

				mapDiv.addClass('result-item');
				mapDiv.show();
				mapInfoDiv.show();
				var mapContainerWrapper = $("<div id=\"mapContainerWrapper\"></div>");
				var mapInfoWrapper = $("<div id=\"mapInfoWrapper\"></div>");

				mapDiv.find('.map').attr('id', 'myMap');
				mapInfoDiv.addClass('result-item');
				mapContainerWrapper.append(mapDiv);
				mapInfoWrapper.append(mapInfoDiv);
				listBody.append(mapContainerWrapper).append(mapInfoWrapper);
				initMap(displayList);

				for (var i = 0; i < displayList.length; i++) {
					tpl = parser.parseFromString(template, "text/html");
					$(tpl).find("#container-rounded p").text(displayList[i].counter);
					$(tpl).find("#provider-card-name a").text(displayList[i].name);
					$(tpl).find("#provider-card-name a").attr('data-providerId', displayList[i].providerId);
					$(tpl).find("#card-speciality p").append(_getSpeaciality(displayList[i].specialty));
					$(tpl).find("#card-provider-type").text(displayList[i].providerType[0].name);
					$(tpl).find("#card-address p").text(displayList[i].address[0].full + ", "
									+ displayList[i].address[0].city[0].name
									+ ", "
									+ displayList[i].address[0].country[0].name
									+ " "
									+ displayList[i].address[0].postalcode);

					if(displayList[i].phone)
                 	{
						$(tpl).find("#card-contact a").text("+" + displayList[i].phone);
						$(tpl).find("#card-contact a").attr("href","tel:+" + displayList[i].phone);
                    }

                    if(displayList[i].website)
                 	{ 
						$(tpl).find("#card-site a").text(displayList[i].website);
                  		  $(tpl).find("#card-site a").attr("href","http://" + displayList[i].website);
                   		 $(tpl).find("#card-site a").attr('target','_blank');
                    }





					$(tpl).find("#provider-card-name a").on('click', function(){
						providerDetailID = $(this).attr('data-providerId');
                        distanceVal =  $(this).closest(".card-details").find(".provider-card-distance p").text();
						providerDetailsAPI.getProviderDetails();
						showBackToSearchButton = false;
		            	showBackToSearchResultButton = true;
					});
					
					$(tpl).find("#card-speciality p a.providerSeeMore").on('click', function(e){
						e.preventDefault();
						providerDetailID = $(this).closest(".card-details").find('#provider-card-name a').attr('data-providerId');
						distanceVal =  $(this).closest(".card-details").find(".provider-card-distance p").text();
						providerDetailsAPI.getProviderDetails();
						showBackToSearchButton = false;
		            	showBackToSearchResultButton = true;
					});


					if (displayList[i].allowsDirectPay == true) {
						$(tpl).find("#directPaySection").show();
						 $(tpl).find('.gop-important-notice-dialog-open').show();
					}

					if (displayList[i].language[0].id == 'eng') {
						$(tpl).find("#languageSection").show();
					}

					var distanceText = displayList[i].DistanceAway;

					$(tpl).find("#distance p").text(distanceText + " KM AWAY");
					$(tpl).find(".provider-results-cards-container").css(
							"display", "block");
					$(tpl).find(".map").css("display", "block");
					$(tpl).find(".no-result-message").css("display", "none");
					$(tpl).find("#search-refine-title").css("display", "block");
					var fragment = $(tpl).find(".col-lg-12");

					var resultItemRow = $(tpl).find(".row.my-3");
					var providerSectionID = "provider-"
							+ displayList[i].providerId;
					resultItemRow.attr('id', providerSectionID);
					resultItemRow.addClass("result-item").addClass(
							'providers-result-item');
					listBody.append(resultItemRow);
				}
				paginationDiv.addClass('providers-result-item');
				listBody.append(paginationDiv);
				$(listBody).find('.page-next').on('click', function(e) {
					e.preventDefault();
					paginationIndex++;
					displayIndividualPaginationResult(paginationIndex);
					$("html, body").animate({
						scrollTop : 0
					}, "fast");
					return false;
				});

				$(listBody).find('.page-prev').on('click', function(e) {
					e.preventDefault();
					paginationIndex--;
					displayIndividualPaginationResult(paginationIndex);
					$("html, body").animate({
						scrollTop : 0
					}, "fast");
					return false;
				});
				if (index == 1) {
					$(listBody).find('.page-prev').attr('disabled','disabled');
				} else {
					$(listBody).find('.page-prev').removeAttr('disabled');
				}
				if (index == paginationResultArray.length) {
					$(listBody).find('.page-next').attr('disabled','disabled');
				} else {
					$(listBody).find('.page-next').removeAttr('disabled');
				}
				paginationDiv.show();

			}
		}
	}

	//method to get specialty list in sorted order alphabetically	
	var _getSpeaciality = function(speaciality) {
		var text = "";
		var tempArray = [];

		for (var j = 0; j <= speaciality.length; j++) {
			if (speaciality[j] && speaciality[j].name) {
				tempArray.push(speaciality[j].name);
			}
		}

		var specialitySortedArray = tempArray.sort();

		for (var k = 0; k < specialitySortedArray.length; k++) {

			if (k < 3 && specialitySortedArray[k]
					&& specialitySortedArray[k] != ""
					&& specialitySortedArray[k] != undefined) {
				var delimiter = k < specialitySortedArray.length - 1 ? ", "
						: "";
				text = text + specialitySortedArray[k] + delimiter;
			} else {
				break;
			}
		}
		return specialitySortedArray.length > 3 ? text
				+ "... <a href=\"#\" class=\"providerSeeMore\">see more</a>"
				: text;
	}
	
	//method for no results case
	var _renderNoResultTemplate = function() {
		$("#noResult").css("display", "block");
		$(".result-item").hide();
		$('.controls-pagination-row').hide();
		var cityText = $('#location2').text();
		var providerSearchValueText = (providerSearchValue && providerSearchValue != "") ? '"'
				+ providerSearchValue + '"'
				: "";
		$("#noResult p.refine-title")
				.text(
						"0 Result for " + providerSearchValueText + " Near "
								+ cityText);
		return;
	}

	//method binded with filter checkbox to fetch data
	var _getDataAfterCheckBoxClick = function() {
		resourcePath = $("#searchComponentPath").val();
		settings.url = resourcePath;
		settings.method = "POST";
		$('#filter-container,#filterProvider').on(
				"click",
				'input[type="checkbox"]',
				function(e) {
					
					var parentDiv = e.delegateTarget ?  $(e.delegateTarget) : "";
					
					if(parentDiv && parentDiv.attr('id') == 'filterProvider'){
						$('#filterProviderMsg').show();
					}
					providerSearchValue = $('#provider-search-value').val()
							.trim();
					data.query = providerSearchValue;
					e.stopImmediatePropagation();

					if ($(this).attr('id') == userSearchKeyWord) {
						userSearchKeyWord = "";
					}
					var this_id = $(this).closest(".panel").attr("id");
					var item = "Speciality";
					if (this_id === "heading-FACILITY") {
						item = "ProviderType";
					} else if (this_id === "heading-OTHERS") {
						item = "Others";
					}
					if ($(this).is(":checked")) {

						data[item].push($(this).val());
					} else {

                        for(var i=0; i<data[item].length; i++)
                        	{
                                if(data[item][i] == $(this).val())
                                {
                                    data[item].splice(i, 1);
                                	
                          	    	break;
                                }
                            }

					}
					redoData = data;
					_search();

				});
	}

	//method binded to click even of search
	var _getDataAfterButtonClick = function() {
		providerSearchValue = $('#provider-search-value').val().trim();
		resourcePath = $("#searchComponentPath").val();
		settings.url = resourcePath;
		settings.method = "POST";
		isRedoClicked = false;
		if(typeof map !== 'undefined'){
			map = null;
		}

        // Search button Tagging
	window.publishPostPageData ('trackSearchLinkClick',{

   		 "actions": { //Custom Link Tracking Fields    
       			  "linkText": "Search", //text displayed on the link
       			  "linkDescription": "Button to search related to providers"  //to distinguish and identify the context    

   					 }

			});

		// Satellite Function Call 
		_satellite.track('trackSearchLinkClick');



		if (providerSearchValue.length > 0) {
			$('#search-criteria-container').css('display', 'none');
			$('#search-criteria-error-msg').css('display', 'none');
			
			let changeLocationVal = $("#location1").text().trim();
			let locationData = $("#location1").attr('data-location');

			data["Speciality"] = [];
			//data["heading-FACILITY"] = [];
			//data["heading-OTHERS"] = [];
			data["ProviderType"] = [];
			data["Others"] = [];

			if (changeLocationVal && changeLocationVal != '' && locationData
					&& locationData != '') {
				let locatioName = changeLocationVal.split(",");
				let locationCoordinateArray = locationData.split(",");
				data.city = remove_accents(locatioName[0]);
				data.country = remove_accents(locatioName[locatioName.length - 1].trim());
				data.location = [];
				let geoLoc = {"geoLoc":
					locationCoordinateArray[0] + ", "
					+ locationCoordinateArray[1]};
				data.location.push(geoLoc);
				data.query = providerSearchValue;
				$('#location-empty-error').hide();
				_search();
			} else {
				$('#location-empty-error').show();
				$('#autocomplete-container').hide();
			}

		} else {
			$('#search-criteria-container').css('display', 'block');
			$('#search-criteria-error-msg').css('display', 'block');
			
			$('#autocomplete-container').hide();
		}
	}
	var _getFilteredData = function() {
		resourcePath = $("#searchComponentPath").val();
		var checkmark = $('#checkboxTest').val();
		var providerSearchValue = $("#provider-search-value").val();
		var providerSearchValueFromChkBox = null;
		
		$.ajax({
			type : 'GET',
			url : resourcePath,
			dataType : 'json',
			success : function(jsonData, status, jqXHR) {
				if (jsonData && typeof jsonData !== 'undefined') {
					
					speciality = jsonData.specialty;
					displayList = getProviderID(jsonData, providerSearchValue,
							speciality, providerSearchValueFromChkBox);
					_renderListTemplate(displayList);
				}
			},
			error : function(jqXHR, status, errorThrown) {
				
			}
		});
	};

	//method to bind location result with auto population
	var _renderLocAutocomplition = function(locData, coordinateData) {
		$("#loc").empty();
        currentFocus =-1;
		$('.autocomplete-items').remove();
		var val = $('#location4').val();
		 var a = document.createElement("div");
		 a.setAttribute("id", "autocomplete-list");
         a.setAttribute("class", "autocomplete-items");
         var parentNode = $(".location-dropdown");
         parentNode.append(a);
         for (i = 0; i < locData.length; i++) {
            // if (locData[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                 b = document.createElement("div");
                 if (locData[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                     b.innerHTML = "<strong>" + locData[i].substr(0, val.length) + "</strong>"; // with highlighting the current input
                 } else {
                     b.innerHTML = locData[i].substr(0, val.length); // w/o highlighting the current input
                 }
                 // b.innerHTML = arr[i].substr(0, val.length); // w/o highlighting the current input
                 b.innerHTML += locData[i].substr(val.length);
                 b.innerHTML += '<input type="hidden" value="' + locData[i] + '" data-location="' + coordinateData[i] +  '">';
                 b.addEventListener("click", function (e) {
                	 var inputElement = this.getElementsByTagName("input")[0];
                	 $('#location4').val(this.getElementsByTagName("input")[0].value);
                	 $('#location4').attr('data-location',$(inputElement).data('location'));
                     closeAllLists();
                 });
                 a.appendChild(b);
            // }
         }
		/*/for (var i = 0; i < locData.length; i++) {
            var trimmedLocationString = locData[i].replace(/\s/g, "");
			$("#loc").append(
					"<option data-location='" + coordinateData[i] + "' value='"
							+ trimmedLocationString + "' />");

		}*/

	};
	
	 function closeAllLists(elmnt) {
         var x = document.getElementsByClassName("autocomplete-items");
         var inp =  $('#location4');
         for (var i = 0; i < x.length; i++) {
             if (elmnt != x[i] && elmnt != inp) {
                 x[i].parentNode.removeChild(x[i]);
             }
         }
     }
	
	//call api to fetch location list
	var _changeLocationData = function(locVal) {
		let locData = [];
		let coordinateData = [];

		var locationSettings = {
			"async" : true,
			"type" : 1,
			"crossDomain" : true,
			"url" : $("#changeLocationAPI").val() + "?location=" + locVal,
			"method" : "GET",
			"headers" : {
				"Content-Type" : "application/json",
				"cache-control" : "no-cache",
			},
			"data" : undefined,
			"processData" : false
		};
		$.ajax(locationSettings).done(
				function(result) {
					
                    if(result.length != undefined && result.length > 0){
					for (var i = 0; i < result.length; i++) {
						locData.push(result[i].LOC_NAME);
						coordinateData.push(result[i].LATITUDE + ","
								+ result[i].LONGITUDE);

					}

					_renderLocAutocomplition(locData, coordinateData);
                    } else {
                        $('#loc').html('');
                        $('.autocomplete-items').remove();
                    }
				});

	};

	var _optionList = function() {

		$('.changeLocation').on('keyup', function(e) {
            if(!((e.keyCode == 40) || (e.keyCode == 38) || (e.keyCode == 13))){
			var locVal = $(".changeLocation").val().replace(/^\s+/g, "");
			$(".changeLocation").val(locVal);
            var dataLocation = $(".changeLocation").attr('data-location');
            if(dataLocation){
           		 $(".changeLocation").removeAttr('data-location');
            }
			if (locVal.length >= 0) {
				_changeLocationData(locVal);
			}
            }
		});

    $('.changeLocation').on('keydown', function(e) {

         var x = document.getElementById("autocomplete-list");
                    if (x) x = x.getElementsByTagName("div");
                    if (e.keyCode == 40) { // Arrow down
                        currentFocus++;
                        addActive(x);
                    } else if (e.keyCode == 38) { // Arrow up
                        currentFocus--;
                        addActive(x);
                    } else if (e.keyCode == 13) { // Enter
                        e.preventDefault();
                        if (currentFocus > -1) {
                            if (x) x[currentFocus].click();
                        }
                    }

});

	};

  function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        };

        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        };

	//method binded with change location button to set location on UI and set member
	var _changeLocation = function() {
		$("#changeLocBtn")
				.click(
						function(e) {
                            var temLoc = $(".changeLocation").val();
                          
                            if(!temLoc){
                                $('#location-change-container').css('display',
										'block');
								return;
                            }
                            var tempLocationVal = $(".changeLocation").val().split(",");
							var changeLocationVal = "";
							/*var locationData = $(
									'#loc [value="' + tempLocationVal + '"]')
									.data('location');*/
							var locationData = $(".changeLocation").attr('data-location')

                            for(var i = 0 ; i < tempLocationVal.length ; i++){

                                if(i !=  tempLocationVal.length -1 ){
                                    changeLocationVal = changeLocationVal  + tempLocationVal[i] + ", ";
                                }

                                else{
                                    changeLocationVal = changeLocationVal +  tempLocationVal[i] ;
                                }

                            }

							$('#location-change-container').css('display',
									'none');
							if (!locationData) {
								$('#location-change-container').css('display',
										'block');
								return;
							}
							e.preventDefault();

							$('#div-result-container').hide();
							$("div#searchNearby").show();
							$("div#my-uhc-anchor").show();
							 $("#autocomplete-container .search-results").remove();
                            $('#autocomplete-container').css('display','none');
                            $(".refine-checkbox-container input[type='checkbox']")
							.prop('checked', false);

							$('#location-empty-error').hide();
							$("#location").html(changeLocationVal);
							$("#location1").html(changeLocationVal);
							$("#location1").attr('data-location', locationData);
							$("#location2").html(changeLocationVal);
							$("#location2").attr('data-location', locationData);
                            $("#loc").html('');

							let locationArray = locationData.split(",");

							let memberId = "";

							var memberData = sessionStorage
									.getItem("memberData") != null ? JSON
									.parse(sessionStorage.getItem("memberData"))
									: [];
							if (memberData) {
								memberId = memberData.MemberIdentifier;
							}

							 // updating memberlocation in API  

							var memberSettings = {
								"async" : true,
								"url" : $("#memberLocationPath").val(),
								"method" : "POST",
								"headers" : {
									"Content-Type" : "application/json;charset=utf-8",
									"cache-control" : "no-cache",
								},
								"data" : '{"MBR_ID":' + memberId
										+ ',"LOC_NAME":"' +remove_accents(changeLocationVal)
										+ '","LATITUDE":' + locationArray[0]
										+ ',"LONGITUDE":' + locationArray[1]
										+ '}',
								"processData" : false
							};

							$.ajax(memberSettings).done(function(response) {
								
							});

							closeChangeLocation();
						});
	};

	//method invokded when search nearby button is clicked
	var _search_nearby = function() {
		data.query = "";
		if(typeof map !== 'undefined'){
			map = null;
		}
		let changeLocationVal = $("#location1").text().trim();
		isRedoClicked = false;
		let locationData = $("#location1").attr('data-location');
		if (changeLocationVal && changeLocationVal != '' && locationData
				&& locationData != '') {
            $('#provider-search-value').val('');
            userSearchKeyWord = "";
            providerSearchValue = "";
			let locatioName = changeLocationVal.split(",");
			let locationCoordinateArray = locationData.split(",");
			data.city = remove_accents(locatioName[0]);
			data.country = remove_accents(locatioName[locatioName.length - 1].trim());
			data.location = [];
			let geoLoc = {"geoLoc":
				locationCoordinateArray[0] + ", "
				+ locationCoordinateArray[1]};
			data.location.push(geoLoc);
			data.distance = 50;
			$("select.form-control.location-distance").val(data.distance);
             $(".refine-checkbox-container input[type='checkbox']")
							.prop('checked', false);
			$('#location-empty-error').hide();
            data["Speciality"] = [];
			//data["heading-FACILITY"] = [];
			//data["heading-OTHERS"] = [];
			data["ProviderType"] = [];
			data["Others"] = [];
			_search();
		} else {
			$('#location-empty-error').show();
		}

	};

	var _filter_distance = function(fd) {
		let changeLocationVal = $("#location1").text().trim();
		let locationData = $("#location1").attr('data-location');
		let locatioName = changeLocationVal.split(",");
		let locationCoordinateArray = locationData.split(",");
		data.city = remove_accents(locatioName[0]);
		data.country = remove_accents(locatioName[locatioName.length - 1].trim());
		data.location = [];
		let geoLoc = {"geoLoc":
			locationCoordinateArray[0] + ", "
			+ locationCoordinateArray[1]};
		data.location.push(geoLoc);
		data.distance = fd;
		_search();
	};

	//called whenever search is performed on the page
	var _search = function() {
		
		settings.data = JSON.stringify(data);
		$("#autocomplete-container").hide();
		$('#how-can-we-help-dialog').hide();
		
		$.ajax(settings).done(function(response) {
			if (response && response.length > 0) {
				totalSearchResultCount = response.length;
				_renderListTemplate(response);
				$(".result-item").show();
				$("#div-result-container").show();
				$("div#searchNearby").hide();
				$("div#my-uhc-anchor").hide();
				$("#noResult").hide();
				if (!isFilterEnabled) {
					filterList.enableFilters();
				}
			} else {
				$("div#searchNearby").hide();
				$("div#my-uhc-anchor").hide();
				_renderNoResultTemplate();
			}
		}).fail(function(response) {
			$("div#searchNearby").hide();
			$("div#my-uhc-anchor").hide();
			$("#div-result-container").show();
			_renderNoResultTemplate();
		});
	};
	var _init = function() {
		$("#form-search").submit(
				function(e) {
					e.preventDefault();
					$(".refine-checkbox-container input[type='checkbox']")
							.prop('checked', false);
                    $('#filter-container').show();
					userSearchKeyWord = "";
					_getDataAfterButtonClick();
				});
		_getDataAfterCheckBoxClick();
		$("select.form-control.location-distance").on("change", function() {
			_filter_distance($(this).val());
		});
		$("select.form-control.location-distance").val(data.distance);
	};

	//called to fetch data for provider details
	var _getProviderDetail = function(id) {
		settings.data = undefined;
		settings.method = "GET";
		settings.type = 1;
		settings.url = $("#providerDetailAPI").val() + "?id=" + id;
		$("#autocomplete-container").hide();
		$("div#searchNearby").hide();
		$("div#my-uhc-anchor").hide();
		$.ajax(settings).done(done).fail(fail);
		userSearchKeyWord = $("#autocomplete-container .search-results a#" + id)
				.attr('data-speciality').trim();
	};
	
	var _redoSearch = function(searchData, zoom){
		data = searchData;
			data["Speciality"] = redoData["Speciality"] ? redoData["Speciality"] : [];
			//data["heading-FACILITY"] = redoData["heading-FACILITY"] ? redoData["heading-FACILITY"] : [];
			//data["heading-OTHERS"] = redoData["heading-OTHERS"] ? redoData["heading-OTHERS"] : [];
			data["ProviderType"] = redoData["ProviderType"] ? redoData["ProviderType"] : [];
			data["Others"] = redoData["Others"] ? redoData["Others"] : [];
			data.distance = "";
		_search();
		
		isRedoClicked = true;
		
		data["Speciality"] = [];
		//data["heading-FACILITY"] =  [];
		//data["heading-OTHERS"] = [];
		data["ProviderType"] =  [];
		data["Others"] =  [];
		
		$('#provider-search-value').val('');
		setTimeout(function()
				{
			map.setView({ zoom: zoom })
			 var tempCount = totalSearchResultCount < 100 ? totalSearchResultCount : 100;
			 var resultText = tempCount > 1 ?  " Results for map area" : " Result for map area";
			$('#search-refine-title.result-item').text(tempCount + resultText);
		},1000);
		
		setTimeout(function()
				{
			//map.setView({ zoom: zoom })
			 var tempCount = totalSearchResultCount < 100 ? totalSearchResultCount : 100;
			  var resultText = tempCount > 1 ?  " Results for map area" : " Result for map area";
			$('#search-refine-title.result-item').text(tempCount + resultText);
		},2000);
		
	}

	function done(response) {
		if (settings.type != 1) {
			if (response && response.length > 0) {
				_renderListTemplate(response);
				handleDone();
			} else {
				_renderNoResultTemplate();
			}
		} else {
			_renderListTemplate([ response ]);
			handleDone();

		}
	}

	function handleDone() {
		$(".result-item").show();
		$("#div-result-container").show();
		$("#div-near-by").hide();
		$("#noResult").hide();
		if (!isFilterEnabled) {
			filterList.enableFilters();
		}
	}

	function fail(response) {
		$("#div-near-by").hide();
		$("#div-result-container").show();
		_renderNoResultTemplate();
	}
	return {
		init : _init,
		getProviderDetail : _getProviderDetail,
		search_nearby : _search_nearby,
		getFilteredData : _getFilteredData,
		checkBoxData : _getDataAfterCheckBoxClick,
		buttonClickData : _getDataAfterButtonClick,
		//searchSuggestions: _searchSuggestions,
		changeLocation : _changeLocation,
		changeLocationData : _changeLocationData,
		optionList : _optionList,
		redoSearch : _redoSearch,
		filter_distance : _filter_distance
	};

})();
$(document).ready(function() {
	searchJsApi.init();
	//searchJsApi.getFilteredData();
	searchJsApi.checkBoxData();
	searchJsApi.changeLocation();
	searchJsApi.optionList();
	//memberSearchApi.init();
	psga.pageLoad();
    $("body div:first").addClass("bodyMainDiv");

  //fetching memberlocation from API
	setTimeout(function(){
		//let tokenId = $("#header").attr("data-mmid"); 
		// if ($("#getMemberLocationAPI").length > 0) {
		let memberId = "";
		
		 var memberData = sessionStorage.getItem("memberData") != null ? JSON.parse(sessionStorage.getItem("memberData")) : [] ;
		   if(memberData)
		   {
			   memberId = memberData.MemberIdentifier;
		   }
        if($("#getMemberLocationAPI").val() != undefined){
		let globalLocationSettings = {
			"async" : true,
			"type" : 1,
			"cache": false,
			"crossDomain" : true,
			"url" : $("#getMemberLocationAPI").val() + "?memberId=" + memberId,
			"method" : "GET",
			"headers" : {
				"Content-Type" : "application/json",
				"cache-control" : "no-cache, no-store",
			},
			"data" : undefined,
			"processData" : false
		};
		$.ajax(globalLocationSettings).done(function(result) {
			
			if (Object.keys(result).length > 0) {
				let changeLocationVal = result.LOC_NAME;
				let locationData = result.LATITUDE + "," + result.LONGITUDE;
				$("#location").html(changeLocationVal);
				$("#location1").html(changeLocationVal);
				$("#location1").attr('data-location', locationData);
				$("#location2").html(changeLocationVal);
				$("#location2").attr('data-location', locationData);
				
				 psga.setLocation(changeLocationVal);
			}
		});	
}
	},1000)
	

});



var psga ={
	    "datalayer": {

	                "content": {
	                    "pageName": document.title, //title of the page rendered on screen
	                    "siteSectionL1": document.location.pathname,// section name L1 [site URL breadcrumb level 1 within which page is present]           
	                    "siteSectionL2": "", // section name L2 within which page is present, [site URL breadcrumb level 2 within which page is present]           
	                    "website": "uhcglobalinsurance",
	                    "businessUnit": "uhc",
	                    "referringSite": "", // not applicable, if the page is not accessed via other internal sites
	                    "language": "en" // if the Language is always english, the Adobe analytics team will set the value as default "en" through Adobe DTM (this property will be optional)
	                         }
	            },
	    "pageLoad": function(){
			// Global Pagedatalayer  

	            window.pageDataLayer = psga.datalayer;
	            
	            // Satellite Function Call 
	            
	            _satellite.track('trackSearchPageLoad');
	    },
	    "setLocation":function(location){
				// Global Pagedatalayer  

	        window.pageDataLayer = psga.datalayer;

	        window.pageDataLayer.user= {
	                    				"location": location, //location name set on the screen
	                           };
	            
	            
	            
	            // Satellite Function Call 
	            _satellite.track('trackSearchPageLoad');
	    }
	};