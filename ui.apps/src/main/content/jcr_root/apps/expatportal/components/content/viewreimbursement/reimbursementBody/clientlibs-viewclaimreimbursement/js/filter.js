var acc = document.getElementsByClassName("accordion");
		var i;

		var panelCalendar = document.getElementById("panelCalendar");

		function adjustCollapseView() {
			var desktopView = $(document).width();
			if (desktopView >= 991) {
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

		// For toggle
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


var currentYear = new Date().getFullYear();
		var minYear = currentYear - 2;
		var minDate = minYear.toString();
		$(function () {
			$('#datetimepickerFrom').datetimepicker({
				viewMode: 'days',
				allowInputToggle: true,
				format: 'DD-MMM-YYYY',
				extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
				locale: 'en',
				maxDate: moment().endOf('d'),
				useCurrent: false,
				minDate: minDate,
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
				useCurrent: false,
				minDate: minDate,
				icons: {
					up: "fa fa-chevron-circle-up",
					down: "fa fa-chevron-circle-down",
					next: 'fa fa-chevron-circle-right',
					previous: 'fa fa-chevron-circle-left'
				}
			});
		});

		// For Modal Date Picker
		$(function () {
			$('#datetimepickerFromModal').datetimepicker({
				viewMode: 'days',
				allowInputToggle: true,
				format: 'DD-MMM-YYYY',
				extraFormats: ['DD-MMM-YYYY', 'DD/MM/YYYY'],
				locale: 'en',
				maxDate: moment().endOf('d'),
				useCurrent: false,
				minDate: minDate,
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
				useCurrent: false,
				minDate: minDate,
				icons: {
					up: "fa fa-chevron-circle-up",
					down: "fa fa-chevron-circle-down",
					next: 'fa fa-chevron-circle-right',
					previous: 'fa fa-chevron-circle-left'
				}
			});
		});
		
		function fillYearValues(){
			
			var currentDate = new Date();	
			var currentYear =currentDate.getFullYear(); 	
			var pastYear = currentYear - 2;

			while(currentYear >= pastYear){
				var optionString = "<option>" + currentYear + "</option>";
				$('#filterByYear').append(optionString);	
				currentYear --;
			}
			$('#filterByYear').val("");
		}
		
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
				//document.getElementById("filterClaimSubscriberMsg").style.display = "block";
				viewReimbursment.getReimbursementClaimDetails(filterData);
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
					viewReimbursment.getReimbursementClaimDetails(filterData);
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
					viewReimbursment.getReimbursementClaimDetails(filterData);
				
				}
			}
		});
