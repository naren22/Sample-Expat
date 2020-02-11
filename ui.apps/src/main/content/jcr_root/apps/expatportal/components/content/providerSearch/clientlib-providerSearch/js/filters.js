var userSearchKeyWord = "";
var isFilterEnabled = false;
var filterList = (function() {
    var ids = [];
    var _renderFilterTemplate = function(displayList) {
       // var template =
        var parser = new DOMParser();
    	var temp =  $("#filter-template").html();
    	var template = parser.parseFromString(temp, "text/html");
        for (var i = 0; i < displayList.length; i++) {
            var id = "heading-" + displayList[i].ATTRIBUTETYPE;
            if ($(template).find("div.panel").attr("id") != id) {
                ids.push("#" + id);
                if (i != 0)
                    $("#filter-container").append($(template).find('.filter-heading-result').html());
               // template = $("template#filter-template").clone()[0].content;
                template = parser.parseFromString(temp, "text/html");
                $(template).find("button.accordion").text(displayList[i].ATTRIBUTETYPE);
                $(template).find("div.panel").attr("id", id);
            }

            var temp1 =  $("#checkbox-template").html();
            var labelTemplate = parser.parseFromString(temp1, "text/html");
            var directPayPopupText = "Direct Pay Available indicates that UnitedHealthcare Global has an agreement with this provider to bill UnitedHealthcare Global directly for your health benefits. If you experience difficulty with this, please ask the provider to contact us using the phone number on the back of your member ID card.";


            $(labelTemplate).find("span.text").text(displayList[i].NAME);
            $(labelTemplate).find("input").attr("id", displayList[i].NAME);
            $(labelTemplate).find("input").attr("value", displayList[i].NAME);
            
            if(displayList[i].ATTRIBUTETYPE.toLowerCase() == "others" && 
            		displayList[i].ID == "2"){
            	var spanInfoIcon = '<i class="fa fa-info-circle pl-1"></i>';
            	$(labelTemplate).find("span.text").attr('title',directPayPopupText);
            	$(labelTemplate).find("span.text").append(spanInfoIcon);
            	$(labelTemplate).find("span.text").attr('onclick','openDirectPayNote()');

//               $(labelTemplate).find("span.text").on('click',function(){
//                   openDirectPayNote();
//                });

            }
            $(template).find(".panel div").append($(labelTemplate).find('.checkbox-filter-result').html());



        };
       // alert('filter binded');
        $("#filter-container").append($(template).find('.filter-heading-result'));
        
        sortItems();
        
        $(".filter-container-sm").append($("#filter-container").html());
        $(".filter-container-sm").find('.refine-title').hide();
        
        $(".filter-container-sm").find("select.form-control.location-distance").on("change", function() {
        	searchJsApi.filter_distance($(this).val());
        	$('#filterProviderMsg').show();
		});
    };

    var _getFilteredData = function() {
        $.ajax({
            type: 'GET',
            url: '/content/expatportal/findcare/find-an-international-provider/jcr:content/par/providersearch.getFilters.html',
            dataType: 'json',
            success: function(jsonData, status, jqXHR) {
                if (jsonData && typeof jsonData !== 'undefined') {
                    displayList = jsonData.ProviderAttributeItems;
                    _renderFilterTemplate(displayList);
                }
            },
            error: function(jqXHR, status, errorThrown) {
                console.log('JSON FAILED for data');
            }
        });
    };

    var _enableFilter = function() {
        var acc = document.getElementsByClassName("accordion");
        var i;
        // Default open
        var width = (window.innerWidth > 0) ? window.innerWidth : document.documentElement.clientWidth;
        if(width > 1024){

        for (i = 0; i < acc.length; i++) {
            acc[i].classList.remove("accordion-active");
            acc[i].classList.add("accordion-active");
            var panel = acc[i].nextElementSibling;
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
        }

        // For toggle
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("accordion-active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
        isFilterEnabled = true;
    };
    var sortItems = function() {
        for (var i = 0; i < ids.length; i++) {
            _sortItemsBySelector($(ids[i] + " .mb-5"), "label", "span.text");
        }
    };
    var _sortItemsBySelector = function(parent, childSelector, keySelector) {
        var items = parent.children(childSelector).sort(function(a, b) {
            var vA = $(keySelector, a).text();
            var vB = $(keySelector, b).text();
            return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
        });
        parent.append(items);
    };

    return {
        bindFilterList: _getFilteredData,
        enableFilters: _enableFilter
    };
})();


$(document).ready(function() {
    filterList.bindFilterList();
});