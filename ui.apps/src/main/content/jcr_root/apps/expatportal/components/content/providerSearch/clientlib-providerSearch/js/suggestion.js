var userSearchKeyWord = "";
var suggestionAPI = (function() {
    var searchTimeout;

    var settings = {
        "async": true,
        "crossDomain": true,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "cache-control": "no-cache",
        },
        "processData": false
    };
     var data = {
        "query": "Allergy",
                              "city": "hyderabad",
                              "country": "india"
               }
    var _renderListTemplate = function(displayList) {
       
        var listBody = $("#autocomplete-container");
        $("#autocomplete-container .search-results").remove();
        for (var i = 0; i < displayList.length; i++) {
               
               var parser = new DOMParser();
               var temp = $("#suggestion-template").html();
               var template = parser.parseFromString(temp, "text/html");

            var providerName = "SPECIALITIES";
             
            var providerType = displayList[i].providerType[0].name;
            if(typeof providerType != 'undefined' && providerType.toLowerCase() == "speciality"){
				$(template).find("a").text(_getSpeaciality(displayList[i].specialty));
                $(template).find("a").prop("id", displayList[i].providerId);
                $(template).find("p").text(providerName);
                $(template).find("a").attr("data-speciality", $(template).find("a").text().trim());

            } else{
                 providerName = providerType.toUpperCase();
                $(template).find("a").text(displayList[i].name);
                $(template).find("a").prop("id", displayList[i].providerId);
                $(template).find("p").text(providerName);
                $(template).find("a").attr("href", displayList[i].website);
                $(template).find("a").attr("data-provider",providerType.toLowerCase());


            }





            var resultItemRow = $(template).find(".search-results");
            listBody.append(resultItemRow);
        };
    };
    var _suggestions = function() {
        providerSearchValue = $('#provider-search-value').val().trim();
        if (providerSearchValue.length > 0) {
            $(".show-all-result p").text("Show all results for '" + providerSearchValue + "'");
            $("#autocomplete-container").show();
            let changeLocationVal = $("#location1").text().trim();
            let locationData = $("#location1").attr('data-location');
            
            let locationCoordinateArray = locationData.split(",");
			data.location = locationCoordinateArray[0] + ", "
					+ locationCoordinateArray[1];
			
            let locatioName = changeLocationVal.split(",");
             data.city = remove_accents(locatioName[0]);
             data.country = remove_accents(locatioName[locatioName.length-1].trim());
             data.query = providerSearchValue;
            if (searchTimeout != undefined)
                clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                _search();
            }, 500);

        } else {
        	$("#autocomplete-container .search-results").remove();
            $("#autocomplete-container").hide();
            
        }
    }
    var _search = function() {


        settings.data = JSON.stringify(data);
        $.ajax(settings).done(function(response) {
            if (response && response.Suggests.length > 0) {
                _renderListTemplate(response.Suggests);
            }
             else {
				$("#autocomplete-container .search-results").remove();
			}
        }).fail(function(response) {
        	$("#autocomplete-container .search-results").remove();
		});;
    };
    var _getSpeaciality = function(speaciality) {
        var text = "";
        for (var i = 0; i < speaciality.length; i++) {
            text = speaciality[i].name + " ";
        }
        return text;
    }
    var _init = function() {
        var url = $("#searchSuggestionComponentPath").val();
        settings.url = url;
        $('#provider-search-value').on('keyup', function() {
        	$("#autocomplete-container .search-results").remove();
            _suggestions();
        });


        $(".show-all-result p").click(function() {
            providerSearchValue = $('#provider-search-value').val().trim();
            
            if (providerSearchValue.length > 0) {
                $("#form-search button").click();
                $("#autocomplete-container .search-results").remove();
                
            }
        });



        $("#autocomplete-container").on("click", ".search-results a", function(e) {
            e.preventDefault();
            $('#provider-search-value').val($(this).text().trim());
            $(".refine-checkbox-container input[type='checkbox']").prop('checked',false);
            userSearchKeyWord = $(this).text().trim();
            $("#autocomplete-container .search-results").remove();

             if( $(this).attr('data-provider') != null){
                providerDetailID = $(this).attr('id');
            	providerDetailsAPI.getProviderDetails();
            	$('#autocomplete-container').hide();
            	$('#provider-search-value').val('');
            	$('#filter-container').hide();
            	showBackToSearchButton = true;
            	showBackToSearchResultButton = false;
            	
            }
            else
            {
            	$('#filter-container').show();
            	searchJsApi.buttonClickData();
            }


            //searchJsApi.buttonClickData();
            //searchJsApi.getProviderDetail($(this).prop("id"));
        });
    };

    return {
       init: _init
    };

})();
$(document).ready(function() {
    suggestionAPI.init();
});
