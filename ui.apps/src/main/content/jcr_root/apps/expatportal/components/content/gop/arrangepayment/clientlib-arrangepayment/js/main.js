
    var diagnosisSymptomsTextCtrMaxLimit = 150;
    var diagnosisSymptomsTextvalue = document.getElementById("diagnosisSymptomsText").value;

    function diagnosisSymptomsTextCtr(str) {
        var lng = str.length;
        document.getElementById("charDiagLimit").innerHTML = diagnosisSymptomsTextCtrMaxLimit - lng;
    }

    function init() {
        diagnosisSymptomsTextCtr(diagnosisSymptomsTextvalue);
    }
    window.onload = init;


<!-- Displaying the datepicker for date of service -->

    var date = document.getElementById('dateOfService');

    function checkValue(str, max) {
        if (str.charAt(0) !== '0' || str == '00') {
            var num = parseInt(str);
            if (isNaN(num) || num <= 0 || num > max) num = 1;
            str = num > parseInt(max.toString().charAt(0)) &&
                num.toString().length == 1 ? '0' + num : num.toString();
        };
        return str;
    };

    date.addEventListener('input', function (e) {
        this.type = 'text';
        var input = this.value;
        if (/\D\-$/.test(input)) {
            input = input.substr(0, input.length - 3);
        }
        var values = input.split('-').map(function (v) {
            return v.replace(/\D/g, '');
        });
        if (values[0]) values[0] = checkValue(values[0], 31);
        if (values[1]) values[1] = checkValue(values[1], 12);

        var output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + ' - ' : v;
        });
        this.value = output.join('').substr(0, 14);
    });

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

		// Default open
		// for (i = 0; i < acc.length; i++) {
		// 	acc[i].classList.toggle("accordion-active");
		// 	var panel = acc[i].nextElementSibling;
		// 	panel.style.maxHeight = panel.scrollHeight + "px";
		// }

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

function getGopMaxDate() {

			///// "today's date + 30 days and get in years format" compare to "get todays end of year date in years format"
			if (moment().add(30, 'days').endOf('d').format("YYYY") === moment().endOf('y').format("YYYY")) {
				return moment().add(30, 'days').endOf('d');
			} else {
				return moment().endOf('y');
			}

		}
		$(function () {
			$('#gop-date-of-service').datetimepicker({
				viewMode: 'days',
				allowInputToggle: true,
				format: 'DD-MMM-YYYY',
				extraFormats: ['DD-MMM-YYYY', 'DD-MM-YYYY'],
				locale: 'en',
				minDate: moment().subtract(3, 'days'),
				maxDate: getGopMaxDate(),
				useCurrent: false,
				icons: {
					up: "fa fa-chevron-circle-up",
					down: "fa fa-chevron-circle-down",
					next: 'fa fa-chevron-circle-right',
					previous: 'fa fa-chevron-circle-left'
				},
				keyBinds: {
					enter: function () {
						this.hide();
					},
					escape: function () {
						this.hide();
					}
				},
			});
		});


function cancelClaim() {
			document.getElementById("cancel-claim").style.display = "block";
		}

		function closeClaim() {
			document.getElementById("cancel-claim").style.display = "none";
		}

		function cancelClaimNotif() {
			window.location.href = '../standard-pages/landing.html';
		}

		function autoComplete() {
			var searchValue = document.getElementById("provider-search-value");
			if (searchValue.value.length > 0) {
				document.getElementById("autocomplete-container").style.display = "block";
				// document.getElementById("search-criteria-container").style.display = "block";
			} else {
				document.getElementById("autocomplete-container").style.display = "none";
				// document.getElementById("search-criteria-container").style.display = "none";
			}
		}