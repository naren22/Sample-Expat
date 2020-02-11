var filterData = {};
filterData.memberFilters = [];
filterData.statusFilters = [];
filterData.coverageTypeFilters = [];
filterData.isApplied = false;

$(document).ready(function(){
	var acc = document.getElementsByClassName("accordion");
	var i;
    var submissionID = document.getElementById('submissionID');
    var submissionIDModal = document.getElementById('submissionIDModal');
    var paymentNumber = document.getElementById('paymentNumber');
    var paymentNumberModal = document.getElementById('paymentNumberModal');

    document.getElementById('submissionID-msg').style.display = "none";
    document.getElementById('payment-number-msg').style.display = "none";
    document.getElementById("filterClaimSubscriberMsg").style.display = "none";

    // logic for submission id and payment validation


   	  submissionID.addEventListener('keypress', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) { // 13 is enter
            var lengthVerified = true;
            var maxlen = $(this).attr('maxlength');
            var length = $(this).val().length;

            if (length < maxlen) {
                lengthVerified = false;
                $('#submissionID-msg').text('The Submission ID contains 21 characters.');
            }
            else {
                $('#submissionID-msg').text('');
            }
            if (lengthVerified == true) {  
                if (/^[0-9a-zA-Z]+$/.test(submissionID.value)) {
                   
                } else {
                    $('#submissionID-msg').text('Only alpha-numeric characters are allowed.');
                }
            }
            if (submissionID.value.length != 0) {
                document.getElementById('submissionID-msg').style.display = "block";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "block";
            } else {
                document.getElementById('submissionID-msg').style.display = "none";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "none";
            }
        }
    });
      submissionID.addEventListener('change', function (event) {
        var lengthVerified = true;
        var maxlen = $(this).attr('maxlength');
        var length = $(this).val().length;
        if (length < maxlen) {
            lengthVerified = false;
            $('#submissionID-msg').text('The Submission ID contains 21 characters.');
        }
        else {
            $('#submissionID-msg').text('');
        }
        if (lengthVerified == true) {
            if (/^[0-9a-zA-Z]+$/.test(submissionID.value)) {
                
            } else {
                $('#submissionID-msg').text('Only alpha-numeric characters are allowed.');
            }
        }
        if (submissionID.value.length != 0) {
            document.getElementById('submissionID-msg').style.display = "block";
            document.getElementById("filterClaimSubscriberMsg").style.display = "block";
        } else {
            document.getElementById('submissionID-msg').style.display = "none";
            document.getElementById("filterClaimSubscriberMsg").style.display = "none";
        }
    });

    submissionIDModal.addEventListener('keypress', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) { // 13 is enter
            var lengthVerified = true;
            var maxlen = $(this).attr('maxlength');
            var length = $(this).val().length;

            if (length < maxlen) {
                lengthVerified = false;
                $('#submissionID-msg-modal').text('The Submission ID contains 21 characters.');
            }
            else {
                $('#submissionID-msg-modal').text('');
            }
            if (lengthVerified == true) {  
                if (/^[0-9a-zA-Z]+$/.test(submissionIDModal.value)) {
                    
                } else {
                    $('#submissionID-msg-modal').text('Only alpha-numeric characters are allowed.');
                }
            }
            if (submissionIDModal.value.length != 0) {
                document.getElementById('submissionID-msg-modal').style.display = "block";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "block";
            } else {
                document.getElementById('submissionID-msg-modal').style.display = "none";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "none";
            }
        }
    });
      submissionIDModal.addEventListener('change', function (event) {
        var lengthVerified = true;
        var maxlen = $(this).attr('maxlength');
        var length = $(this).val().length;
        if (length < maxlen) {
            lengthVerified = false;
            $('#submissionID-msg-modal').text('The Submission ID contains 21 characters.');
        }
        else {
            $('#submissionID-msg-modal').text('');
        }
        if (lengthVerified == true) {
            if (/^[0-9a-zA-Z]+$/.test(submissionIDModal.value)) {
             
            } else {
                $('#submissionID-msg-modal').text('Only alpha-numeric characters are allowed.');
            }
        }
        if (submissionIDModal.value.length != 0) {
            document.getElementById('submissionID-msg-modal').style.display = "block";
            document.getElementById("filterClaimSubscriberMsg").style.display = "block";
        } else {
            document.getElementById('submissionID-msg-modal').style.display = "none";
            document.getElementById("filterClaimSubscriberMsg").style.display = "none";
        }
    });

    paymentNumber.addEventListener('keypress', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) { // 13 is enter
            if (/^[0-9a-zA-Z]+$/.test(paymentNumber.value)) {
                $('#payment-number-msg').text('');
            } else {
                $('#payment-number-msg').text('Only alpha-numeric characters are allowed.');
            }
            if (paymentNumber.value.length != 0 ) {
                document.getElementById('payment-number-msg').style.display = "block";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "block";
            } else {
                document.getElementById('payment-number-msg').style.display = "none";
                 document.getElementById("filterClaimSubscriberMsg").style.display = "none";
            }
        }
    });
 paymentNumber.addEventListener('change', function (event) {
        if (/^[0-9a-zA-Z]+$/.test(paymentNumber.value)) {
            $('#payment-number-msg').text('');
        } else {
            $('#payment-number-msg').text('Only alpha-numeric characters are allowed.');
        }
        if (paymentNumber.value.length != 0) {
            document.getElementById('payment-number-msg').style.display = "block";
             document.getElementById("filterClaimSubscriberMsg").style.display = "block";
        } else {
            document.getElementById('payment-number-msg').style.display = "none";
             document.getElementById("filterClaimSubscriberMsg").style.display = "none";
        }
    });

     paymentNumberModal.addEventListener('keypress', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) { // 13 is enter
            if (/^[0-9a-zA-Z]+$/.test(paymentNumberModal.value)) {
                $('#payment-number-msg-modal').text('');
            } else {
                $('#payment-number-msg-modal').text('Only alpha-numeric characters are allowed.');
            }
            if (paymentNumberModal.value.length != 0 ) {
                document.getElementById('payment-number-msg-modal').style.display = "block";
            } else {
                document.getElementById('payment-number-msg-modal').style.display = "none";
            }
        }
    });
 paymentNumberModal.addEventListener('change', function (event) {
        if (/^[0-9a-zA-Z]+$/.test(paymentNumberModal.value)) {
            $('#payment-number-msg-modal').text('');
        } else {
            $('#payment-number-msg-modal').text('Only alpha-numeric characters are allowed.');
        }
        if (paymentNumberModal.value.length != 0) {
            document.getElementById('payment-number-msg-modal').style.display = "block";
             document.getElementById("filterClaimSubscriberMsg").style.display = "block";
        } else {
            document.getElementById('payment-number-msg-modal').style.display = "none";
             document.getElementById("filterClaimSubscriberMsg").style.display = "none";
        }
    });

    // logic ends

	var panelCalendar = document.getElementById("panelCalendar");

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

	function adjustCollapseView() {
		var desktopView = $(document).width();
		if (desktopView >= "768") {
			for (i = 0; i < acc.length; i++) {
				acc[i].classList.toggle("accordion-active");
				var panel = acc[i].nextElementSibling;
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		}
	}

	$(function () {
		adjustCollapseView();
		$(window).on("resize", function () {
			adjustCollapseView();
		});
	});

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			this.classList.toggle("accordion-active");
			if (panelCalendar != null) {
				document.getElementById("panelCalendar").style.overflow = "hidden";
			}
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		});
	}

	$(function () {

        var currentYear = new Date().getFullYear();
		var minYear = currentYear - 2;
		var minDate = minYear.toString();

		$('#datetimepickerFrom').datetimepicker({
			viewMode: 'days',
			allowInputToggle: true,
			format: 'DD-MMM-YYYY',
			extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
			locale: 'en',
			maxDate: moment().endOf('d'),
            minDate:minDate,
			useCurrent: false,
			icons: {
				up: "fa fa-chevron-circle-up",
				down: "fa fa-chevron-circle-down",
				next: 'fa fa-chevron-circle-right',
				previous: 'fa fa-chevron-circle-left'
			}
		});
		$('#datetimepickerTo').datetimepicker({
			viewMode: 'days',
			allowInputToggle: true,
			format: 'DD-MMM-YYYY',
			extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
			locale: 'en',
			maxDate: moment().endOf('d'),
            minDate:minDate,
			useCurrent: false,
			icons: {
				up: "fa fa-chevron-circle-up",
				down: "fa fa-chevron-circle-down",
				next: 'fa fa-chevron-circle-right',
				previous: 'fa fa-chevron-circle-left'
			}
		});

         $('#datetimepickerFromModal').datetimepicker({
			viewMode: 'days',
			allowInputToggle: true,
			format: 'DD-MMM-YYYY',
			extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
			locale: 'en',
			maxDate: moment().endOf('d'),
            minDate:minDate,
			useCurrent: false,
			icons: {
				up: "fa fa-chevron-circle-up",
				down: "fa fa-chevron-circle-down",
				next: 'fa fa-chevron-circle-right',
				previous: 'fa fa-chevron-circle-left'
			}
		});
		$('#datetimepickerToModal').datetimepicker({
			viewMode: 'days',
			allowInputToggle: true,
			format: 'DD-MMM-YYYY',
			extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
			locale: 'en',
			maxDate: moment().endOf('d'),
            minDate:minDate,
			useCurrent: false,
			icons: {
				up: "fa fa-chevron-circle-up",
				down: "fa fa-chevron-circle-down",
				next: 'fa fa-chevron-circle-right',
				previous: 'fa fa-chevron-circle-left'
			}
		});
	});
	
	$('#filterClaims').on('change',function(){
		
		filterData.sort = $(this).children('option:selected').data('sort');
		filterData.isApplied = true;
		currentPageIndex = 0;
		viewClaims.getRelatedClaimsDetails(filterData);
	});
	
	fillYearValues();
	
	$('#filterByYear, #filterByYearModal').on('change',function(){
        $('#dateRangeFrom').val("");
         $('#dateRangeTo').val("");
		var year = $(this).val();
		if(year){
			dateFrom = year + "-01" + "-01";
			dateTo = year + "-12" + "-31";
			filterData.dateFrom = dateFrom;
			filterData.dateTo = dateTo;
			filterData.isApplied = true;
			currentPageIndex = 0;
			document.getElementById("filterClaimSubscriberMsg").style.display = "block";
			viewClaims.getRelatedClaimsDetails(filterData);
		}
		
	});
	
	$('#filterByProvider, #filterByProviderModal').on('change',function(){
		var providerId =$(this).children('option:selected').data('id');
		if(providerId){
			filterData.providerId = providerId;
			filterData.isApplied = true;
			currentPageIndex = 0;
			document.getElementById("filterClaimSubscriberMsg").style.display = "block";
			viewClaims.getRelatedClaimsDetails(filterData);
		}
	});
	
	$('#submissionID, #submissionIDModal').on('change',function(){
		filterData.submissionId = $(this).val();
		filterData.isApplied = true;
		currentPageIndex = 0;
		//if($(this).siblings('#submissionID-msg').text() == ""){
        document.getElementById("filterClaimSubscriberMsg").style.display = "block";
			viewClaims.getRelatedClaimsDetails(filterData);
		//}
	});
	
	$('#submissionID, #submissionIDModal').on('keypress', function (event) {

        var ua = window.navigator.userAgent;
        var isIE = /MSIE|Trident/.test(ua);
        
        if ( isIE ) {
            
            var key = event.which || event.keyCode;
            if (key === 13) { // 13 is enter
                filterData.submissionId = $(this).val();
                filterData.isApplied = true;
                currentPageIndex = 0;
                //if($(this).siblings('#submissionID-msg').text() == ""){
                document.getElementById("filterClaimSubscriberMsg").style.display = "block";
                viewClaims.getRelatedClaimsDetails(filterData);
                //}		
            }
        }		
    });	
	
	$('#paymentNumber, #paymentNumberModal').on('change',function(){
		filterData.paymentNumber = $(this).val();
		filterData.isApplied = true;
		currentPageIndex = 0;
       
        document.getElementById("filterClaimSubscriberMsg").style.display = "block";
		viewClaims.getRelatedClaimsDetails(filterData);
	});

    $('#paymentNumber, #paymentNumberModal').on('keypress',function(event){
        
        var ua = window.navigator.userAgent;
        var isIE = /MSIE|Trident/.test(ua);

        if ( isIE ) { 
            var key = event.which || event.keyCode;
            if (key === 13) { // 13 is enter
                filterData.paymentNumber = $(this).val();
                filterData.isApplied = true;
                currentPageIndex = 0;
                document.getElementById("filterClaimSubscriberMsg").style.display = "block";
                viewClaims.getRelatedClaimsDetails(filterData);
            }
        }
});
	
	$('#dateRangeFrom').on('blur',function(){
		$('#filterByYear').val("");
		var dateString  = $(this).val();
		if(dateString && dateString.length > 0){
			dateString = dateString.replaceAll('-',' ');		
			var date = new Date(dateString);
			var localeDateString = date.toDateString();
			var splittedDate = localeDateString.split(" ");	
			
			var pfromDate = filterData.dateFrom;
			filterData.isApplied = true;
			filterData.dateFrom = splittedDate[3] + "-" + getFormatedMonth(splittedDate[1].toUpperCase()) + "-" + splittedDate[2];
			var afromdate = $('#dateRangeFrom').val();
			if((pfromDate == undefined && afromdate.length >0 )  ||
						(typeof pfromDate != 'undefined' && pfromDate != filterData.dateFrom && afromdate.length >0 )){
				filterData.isApplied = true;
				currentPageIndex = 0;
				viewClaims.getRelatedClaimsDetails(filterData);
			}
		}
	});
	
	$('#dateRangeTo').on('blur',function(){
		$('#filterByYear').val("");
		var dateString  = $(this).val();
		if(dateString && dateString.length > 0){
			dateString = dateString.replaceAll('-',' ');
			var date = new Date(dateString);
			var localeDateString = date.toDateString();
			var splittedDate = localeDateString.split(" ");
			var ptoDate = filterData.dateTo;
			filterData.isApplied = true;
			filterData.dateTo = splittedDate[3] + "-" + getFormatedMonth(splittedDate[1].toUpperCase()) + "-" + splittedDate[2];
			var atodate = $('#dateRangeTo').val();
			if((ptoDate == undefined && atodate.length > 0)  ||
					(typeof ptoDate != 'undefined' && ptoDate != filterData.dateTo &&  atodate.length > 0 )){
				filterData.isApplied = true;
				currentPageIndex = 0;
			viewClaims.getRelatedClaimsDetails(filterData);
			
			}
		}
	});


    $('#dateRangeFromModal').on('blur',function(){
		$('#filterByYear').val("");
		$('#filterByYearModal').val("");
		var dateString  = $(this).val();
		if(dateString && dateString.length > 0){
			dateString = dateString.replaceAll('-',' ');		
			var date = new Date(dateString);
			var localeDateString = date.toDateString();
			var splittedDate = localeDateString.split(" ");
			
			var pfromDate = filterData.dateFrom;
			filterData.isApplied = true;
			filterData.dateFrom = splittedDate[3] + "-" + getFormatedMonth(splittedDate[1].toUpperCase()) + "-" + splittedDate[2];
			var afromdate = $('#dateRangeFromModal').val();
			if((pfromDate == undefined && afromdate.length >0 )  ||
						(typeof pfromDate != 'undefined' && pfromDate != filterData.dateFrom && afromdate.length >0 )){
				filterData.isApplied = true;
				currentPageIndex = 0;
                document.getElementById("filterClaimSubscriberMsg").style.display = "block";
				viewClaims.getRelatedClaimsDetails(filterData);
			}
		}
	});
	
	$('#dateRangeToModal').on('blur',function(){
		$('#filterByYear').val("");
		$('#filterByYearModal').val("");
		var dateString  = $(this).val();
		if(dateString && dateString.length > 0){
			dateString = dateString.replaceAll('-',' ');
			var date = new Date(dateString);
			var localeDateString = date.toDateString();
			var splittedDate = localeDateString.split(" ");
			var ptoDate = filterData.dateTo;
			filterData.isApplied = true;
			filterData.dateTo = splittedDate[3] + "-" + getFormatedMonth(splittedDate[1].toUpperCase()) + "-" + splittedDate[2];
			var atodate = $('#dateRangeToModal').val();
			if((ptoDate == undefined && atodate.length > 0)  ||
					(typeof ptoDate != 'undefined' && ptoDate != filterData.dateTo &&  atodate.length > 0 )){
				filterData.isApplied = true;
				currentPageIndex = 0;
                document.getElementById("filterClaimSubscriberMsg").style.display = "block";
			viewClaims.getRelatedClaimsDetails(filterData);
			
			}
		}
	});

	$('.filter_member').on("click",'input[type="checkbox"]',function(e) {
			var filterId ="" +  $(this).data('filterid');
			if ($(this).is(":checked")) {
				filterData.memberFilters.push(filterId);
			} else {
	
	            for(var i=0; i<filterData.memberFilters.length; i++)
	            	{
	                    if(filterData.memberFilters[i] == filterId)
	                    {
	                    	filterData.memberFilters.splice(i, 1);
	              	    	break;
	                    }
	                }
			}
        document.getElementById('filterClaimSubscriberMsg').style.display = "block";
			filterData.isApplied = true;
			currentPageIndex = 0;
			viewClaims.getRelatedClaimsDetails(filterData);
	});
	
	$('.filter_status').on("click",'input[type="checkbox"]',function(e) {
		var filterId ="" +  $(this).data('filterid');
		if ($(this).is(":checked")) {
			filterData.statusFilters.push(filterId);
		} else {

            for(var i=0; i<filterData.statusFilters.length; i++)
            	{
                    if(filterData.statusFilters[i] == filterId)
                    {
                    	filterData.statusFilters.splice(i, 1);
              	    	break;
                    }
                }
		}
         document.getElementById('filterClaimSubscriberMsg').style.display = "block";
		filterData.isApplied = true;
		currentPageIndex = 0;
		viewClaims.getRelatedClaimsDetails(filterData);
	});
	
	$('.filter_coverage_type').on("click",'input[type="checkbox"]',function(e) {
		var filterId ="" +  $(this).data('filterid');
		if ($(this).is(":checked")) {
			filterData.coverageTypeFilters.push(filterId);
		} else {

            for(var i=0; i<filterData.coverageTypeFilters.length; i++)
            	{
                    if(filterData.coverageTypeFilters[i] == filterId)
                    {
                    	filterData.coverageTypeFilters.splice(i, 1);
              	    	break;
                    }
                }
		}
         document.getElementById('filterClaimSubscriberMsg').style.display = "block";
		filterData.isApplied = true;
		currentPageIndex = 0;
		viewClaims.getRelatedClaimsDetails(filterData);
	});
	
});

function closeClaimInfo() {
    document.getElementById('claim-status').style.display = "none";
}

function displayCalendar() {
    document.getElementById("panelCalendar").style.overflow = "visible";
}
function displayCalendarModal() {
    document.getElementById("panelCalendarModal").style.overflow = "visible";
}
function resetFilters(){
	location.reload(true);
}

function resetFiltersModal() {
    location.reload(true);
}

function fillYearValues(){
	
	var currentDate = new Date();	
	var currentYear =currentDate.getFullYear(); //parseInt(formattedDate.split('/')[2]);	
	var pastYear = currentYear - 2;

	while(currentYear >= pastYear){
		var optionString = "<option>" + currentYear + "</option>";
		$('#filterByYear').append(optionString);
		$('#filterByYearModal').append(optionString);		
		currentYear --;
	}
	$('#filterByYear').val("");
	$('#filterByYearModal').val("");
}

   function closeRefineResult() {
        document.getElementById("filterClaimSubscriberMsg").style.display = "none";
        document.getElementById('filterClaimSubscriber').style.display = "none";
    }

function displayFilterClaimSubscriber() {
        document.getElementById('filterClaimSubscriber').style.display = "block";
      var filterMobileView = false;
        var acc = document.getElementsByClassName("accordion");
        if (filterMobileView == false) {
            for (i = 0; i < acc.length; i++) {
                acc[i].classList.toggle("accordion-active");
                var panel = acc[i].nextElementSibling;
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }
        filterMobileView = true;
    }

function openStatusNote() {
    document.getElementById("status-steps-note").style.display = "block";
}

function closeStatusNote() {
    document.getElementById("status-steps-note").style.display = "none";
}
//end of new form