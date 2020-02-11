
var filterData = {};
filterData.memberFilters = [];
filterData.statusFilters = [];
filterData.coverageTypeFilters = [];
filterData.isApplied = false;

$(document).ready(function(){
$('#filterSortByClaims').on('change',function(){
		
		filterData.sort = $(this).children('option:selected').data('sort');
		filterData.isApplied = true;
		currentPageIndex = 0;
		viewReimbursment.getReimbursementClaimDetails(filterData);
	});
});


function getFormatedMonth(monthValue)
{			
					var month = {
					   "JAN" : "01",
                        "FEB":"02",
                        "MAR":"03", 
                        "APR" : "04",
                        "MAY": "05" ,
                        "JUN": "06" ,
                        "JUL" : "07" ,
                        "AUG" : "08",
                        "SEP": "09" ,
                        "OCT":"10" ,
                        "NOV" : "11"  ,
                        "DEC": "12",
                }

				var finalDateString = month[monthValue.toUpperCase()];

				return finalDateString;

}


function displayCalendar() {
        document.getElementById("panelCalendar").style.overflow = "visible";
    }

    var dateFrom = document.getElementById('dateRangeFrom');
    var dateTo = document.getElementById('dateRangeTo');

    function checkValue(str, max) {
        if (str.charAt(0) !== '0' || str == '00') {
            var num = parseInt(str);
            if (isNaN(num) || num <= 0 || num > max) num = 1;
            str = num > parseInt(max.toString().charAt(0)) &&
                num.toString().length == 1 ? '0' + num : num.toString();
        };
        return str;
    };

    dateFrom.addEventListener('input', function (e) {
        this.type = 'text';
        var input = this.value;
        if (/\D\-$/.test(input)) {
            input = input.substr(0, input.length - 3);
        }
        var values = input.split('-').map(function (v) {
            return v.replace(/\D/g, '')
        });
        if (values[0]) values[0] = checkValue(values[0], 31);
        if (values[1]) values[1] = checkValue(values[1], 12);

        var output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + ' - ' : v;
        });
        this.value = output.join('').substr(0, 14);
    });

    dateFrom.addEventListener('input', function (e) {
            this.type = 'text';
            var input = this.value;
            if (/\D\-$/.test(input)) {
                input = input.substr(0, input.length - 3);
            }
            var values = input.split('-').map(function (v) {
                return v.replace(/\D/g, '')
            });
            if (values[0]) values[0] = checkValue(values[0], 31);
            if (values[1]) values[1] = checkValue(values[1], 12);
    
            var output = values.map(function (v, i) {
                return v.length == 2 && i < 2 ? v + ' - ' : v;
            });
            this.value = output.join('').substr(0, 14);
        });

    dateTo.addEventListener('input', function (e) {
        this.type = 'text';
        var input = this.value;
        if (/\D\-$/.test(input)) {
            input = input.substr(0, input.length - 3);
        }
        var values = input.split('-').map(function (v) {
            return v.replace(/\D/g, '')
        });
        if (values[0]) values[0] = checkValue(values[0], 31);
        if (values[1]) values[1] = checkValue(values[1], 12);

        var output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + ' - ' : v;
        });
        this.value = output.join('').substr(0, 14);
    });


    function resetFilters() {
    	location.reload(true);
    }

    // To display filter results when in mobile view
    document.getElementById("filterReimbursement").style.display = "none";
    document.getElementById("filterClaimReimbursementMsg").style.display = "none";

    var filterMobileView = false;
    var dateFromModal = document.getElementById('dateRangeFromModal');
    var dateToModal = document.getElementById('dateRangeToModal');
    var selectFilterByYear = document.getElementById("filterByYearModal");
    var valueFilterByYear;

 dateFromModal.addEventListener('input', function (e) {
        this.type = 'text';
        var input = this.value;
        if (/\D\-$/.test(input)) {
            input = input.substr(0, input.length - 3);
        }
        var values = input.split('-').map(function (v) {
            return v.replace(/\D/g, '')
        });
        if (values[0]) values[0] = checkValue(values[0], 31);
        if (values[1]) values[1] = checkValue(values[1], 12);

        var output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + ' - ' : v;
        });
        this.value = output.join('').substr(0, 14);
    });

    dateToModal.addEventListener('input', function (e) {
        this.type = 'text';
        var input = this.value;
        if (/\D\-$/.test(input)) {
            input = input.substr(0, input.length - 3);
        }
        var values = input.split('-').map(function (v) {
            return v.replace(/\D/g, '')
        });
        if (values[0]) values[0] = checkValue(values[0], 31);
        if (values[1]) values[1] = checkValue(values[1], 12);

        var output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + ' - ' : v;
        });
        this.value = output.join('').substr(0, 14);
    });

function displayFilterClaimReimbursement() {
        document.getElementById('filterReimbursement').style.display = "block";
        var acc = document.getElementsByClassName("accordion");
        if (filterMobileView == false) {
            for (i = 0; i < acc.length; i++) {
                acc[i].classList.toggle("accordion-active");
                var panel = acc[i].nextElementSibling;
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }
        filterMobileView = true;
        valueFilterByYear = selectFilterByYear.options[selectFilterByYear.selectedIndex].text;
    }

    selectFilterByYear.addEventListener('change', function (event) {
        var selectedFilterByYear = selectFilterByYear.options[selectFilterByYear.selectedIndex].text;
        if (selectedFilterByYear !== valueFilterByYear) {
            document.getElementById("filterClaimReimbursementMsg").style.display = "block";
        } else {
            document.getElementById("filterClaimReimbursementMsg").style.display = "none";
        }
    });

    function closeRefineResult() {
        document.getElementById("filterClaimReimbursementMsg").style.display = "none";
        document.getElementById('filterReimbursement').style.display = "none";
    }

    function subscriberFilterCheck() {
        var text = document.getElementById("filterClaimSubscriberMsg");
        var filterSubscriber = document.getElementById("filterClaimSubscriber");
        var checked = 0;

        // Reference all the checkBoxes
        var chks = filterSubscriber.getElementsByTagName("INPUT");

        // Loop and count the number of checked CheckBoxes.
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                checked++;
            }
        }

        if (checked > 0) {
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }

 function displayCalendarModal() {
        document.getElementById("panelCalendarModal").style.overflow = "visible";
    }

    function checkDatePickerValue () {
        if (dateFromModal.value.length != 0) {
            document.getElementById("filterClaimReimbursementMsg").style.display = "block";
        }
        if (dateToModal.value.length != 0) {
            document.getElementById("filterClaimReimbursementMsg").style.display = "block";
        }
    }

    dateFromModal.addEventListener("focusout", checkDatePickerValue);
    dateToModal.addEventListener("focusout", checkDatePickerValue);

    function resetFiltersModal() {
        document.getElementById("dateRangeFromModal").value = "";
        document.getElementById("dateRangeToModal").value = "";
        document.getElementById("filterByYearModal").value = "";
        document.getElementById("filterClaimReimbursementMsg").style.display = "none";
    }