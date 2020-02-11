var patientErrorMsg = true;
		var diagnosisSymptomsErrorMsg = true;
		var diagnosisSymptomsCharErrorMsg = true; ////
		var serviceErrorMsg = true;
		var dateOfServiceErrorMsg = true;
		var dateOfServiceThreeDaysErrorMsg = true;
		var dateOfServiceThirtyDaysErrorMsg = true;
		var dateOfServiceYearErrorMsg = true;

		var diagnosisSymptomsValidation = /^[A-Za-z0-9.,&;'-\s]*$/;

		var patientValue = document.getElementById('patient');
		var diagnosisSymptomsValue = document.getElementById('diagnosisSymptomsText');
		var serviceValue = document.getElementById('service');
		var dateOfServiceValue = document.getElementById('dateOfService');

		// white space checker
		function whiteSpaceTrim(x) {
			return x.replace(/^\s+|\s+$/gm, '');
		}
		// end white space checker

		function patientChecker() {
			if (whiteSpaceTrim(patientValue.value.toString()) !== "") {
				document.getElementById('gop-patient-required-msg').style.display = "none";
				patientErrorMsg = false;
			} else {
				document.getElementById('gop-patient-required-msg').style.display = "block";
				patientErrorMsg = true;
			}
		}

		function diagnosisSymptomsChecker() {
			if (whiteSpaceTrim(diagnosisSymptomsValue.value.toString()) !== "") {
				document.getElementById('gop-diagnosis-symptons-required-msg').style.display = "none";
				diagnosisSymptomsErrorMsg = false;
			} else {
				document.getElementById('gop-diagnosis-symptons-required-msg').style.display = "block";
				diagnosisSymptomsErrorMsg = true;
			}
		}

		function serviceChecker() {
			if (whiteSpaceTrim(serviceValue.value.toString()) !== "") {
				document.getElementById('gop-service-procedure-required-msg').style.display = "none";
				serviceErrorMsg = false;
			} else {
				document.getElementById('gop-service-procedure-required-msg').style.display = "block";
				serviceErrorMsg = true;
			}
		}

		function dateOfServiceChecker() {
			if (whiteSpaceTrim(dateOfServiceValue.value.toString()) !== "") {
				document.getElementById('gop-date-service-required-msg').style.display = "none";
				dateOfServiceErrorMsg = false;
			} else {
				document.getElementById('gop-date-service-required-msg').style.display = "block";
				dateOfServiceErrorMsg = true;
			}
		}

		function dateOfServiceGopChecker() {
			var value = dateOfServiceValue.value;
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var newDateOfServiceGOP = '';
			if (isNaN(value.split("-")[1])) {
				newDateOfServiceGOP = value.split("-")[2] + "-" + (months.indexOf(value.split("-")[1]) + 1) + "-" + value.split(
					"-")[0];
			} else {
				newDateOfServiceGOP = whiteSpaceTrim(value.split("-")[2]) + "-" + whiteSpaceTrim(value.split("-")[1]) + "-" +
					whiteSpaceTrim(value.split(
						"-")[0]);
			}
			
			if (moment(new Date(newDateOfServiceGOP)).endOf('d').diff(moment().endOf('d'), 'days') > 30) {
				document.getElementById('gop-date-service-thirty-days-msg').style.display = "block";
				dateOfServiceThreeDaysErrorMsg = true;
			} else {
				document.getElementById('gop-date-service-thirty-days-msg').style.display = "none";
				dateOfServiceThreeDaysErrorMsg = false;
			}

			if (moment(new Date(newDateOfServiceGOP)).endOf('d').diff(moment().endOf('d'), 'days') < -30) {
				document.getElementById('gop-date-service-three-days-msg').style.display = "block";
				dateOfServiceThirtyDaysErrorMsg = true;
			} else {
				document.getElementById('gop-date-service-three-days-msg').style.display = "none";
				dateOfServiceThirtyDaysErrorMsg = false;
			}

			if (moment().endOf('y').format("YYYY") !== whiteSpaceTrim(value.split("-")[2])) {
				document.getElementById('gop-date-service-next-calendar-msg').style.display = "block";
				dateOfServiceYearErrorMsg = true;
			} else {
				document.getElementById('gop-date-service-next-calendar-msg').style.display = "none";
				dateOfServiceYearErrorMsg = false;
			}
		}

		["input", "blur", "change", "select"].forEach(function (event, index) {
			patientValue.addEventListener(event, function (event) {
				patientChecker();
			});
		});
		["input", "blur", "change"].forEach(function (event) {
			diagnosisSymptomsValue.addEventListener(event, function (event) {
				patientChecker();
				diagnosisSymptomsChecker();
			});
		});
		["input", "blur", "change", "select"].forEach(function (event) {
			serviceValue.addEventListener(event, function (event) {
				patientChecker();
				diagnosisSymptomsChecker();
				serviceChecker();
			});
		});
		["input", "blur", "change"].forEach(function (event) {
			dateOfServiceValue.addEventListener(event, function (event) {
				patientChecker();
				diagnosisSymptomsChecker();
				serviceChecker();
				dateOfServiceChecker();
			});
		});
		dateOfServiceValue.addEventListener('blur', function (e) {
			if (dateOfServiceValue.value !== "") {
				dateOfServiceGopChecker();
			}
		});

		function setInputFilterProvider(textbox, inputFilter) {
			["input", "mousedown", "blur", "contextmenu", "drop"].forEach(function (event) {
				textbox.addEventListener(event, function () {
					if (inputFilter(this.value)) {
						this.oldValue = this.value;
						this.oldSelectionStart = this.selectionStart;
						this.oldSelectionEnd = this.selectionEnd;
					} else if (this.hasOwnProperty("oldValue")) {
						this.value = this.oldValue;
						this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
					}
				});
			});
		}
		setInputFilterProvider(diagnosisSymptomsValue, function (value) {
			if (diagnosisSymptomsValidation.test(value)) {
				document.getElementById('gop-diagnosis-symptons-regex-msg').style.display = "none";
				return diagnosisSymptomsValidation.test(value);
			} else {
				document.getElementById('gop-diagnosis-symptons-regex-msg').style.display = "block";
			}
		});

		/// start change button color functionality
		function setInputFilterGopButton(textbox) {
			["input", "mousedown", "blur", "contextmenu", "drop", "change"].forEach(function (event) {
				textbox.addEventListener(event, function () {
					if (!patientErrorMsg && !diagnosisSymptomsErrorMsg && !serviceErrorMsg && !dateOfServiceErrorMsg && !
						dateOfServiceThreeDaysErrorMsg && !dateOfServiceThirtyDaysErrorMsg && !dateOfServiceYearErrorMsg) {
						document.getElementById("submit-gop-info-btn").style.backgroundColor =
							'#00a8f7'; ///$accent-color
						document.getElementById("submit-gop-info-btn").style.borderColor =
							'#00a8f7'; ///$accent-color
					} else {
						document.getElementById("submit-gop-info-btn").style.backgroundColor = '#5a6268';
						document.getElementById("submit-gop-info-btn").style.borderColor = '#5a6268';
					}
				});
			});
		}
		/// check field for every events if the required and error validations check
		/// change color of button if there are no error messages
		[patientValue, diagnosisSymptomsValue, serviceValue, dateOfServiceValue].forEach(
			function (field, index) {
				setInputFilterGopButton(field);
			}
		);
		/// end change button color functionality

		function submitReviewGopForm() {


			document.getElementById("system-error-note-loader").style.display = 'block';
			window.setTimeout(
				function () {
					document.getElementById("system-error-note-loader").style.display = 'none';
					document.getElementById("system-error-note").style.display = 'block';
				}, 5000);
		}

		function submitGopForm() {

            var providerDetailJSON =JSON.parse(sessionStorage.getItem("providerDetails"));
            providerDetailJSON.memeberName = $('#patient option:selected').text();
			providerDetailJSON.diagnosis = $('#diagnosisSymptomsText').val();
            providerDetailJSON.service = $('#service').val();
            providerDetailJSON.date = $('#dateOfService').val();
			sessionStorage.setItem("providerDetails",JSON.stringify(providerDetailJSON));

			patientChecker();
			diagnosisSymptomsChecker();
			serviceChecker();
			dateOfServiceChecker();

			///// check if there still required or error fields if none submit the form
			if (!patientErrorMsg && !diagnosisSymptomsErrorMsg && !serviceErrorMsg && !dateOfServiceErrorMsg && !
				dateOfServiceThreeDaysErrorMsg && !dateOfServiceThirtyDaysErrorMsg && !dateOfServiceYearErrorMsg) {
				document.getElementById("system-error-note-loader").style.display = 'block';
				window.setTimeout(
					function () {
						document.getElementById("system-error-note-loader").style.display = 'none';
						//document.getElementById("system-error-note").style.display = 'block';
                        var checkIcon = $('<i class="fa fa-check"></i>');
						$('#step2').hide();
                        $('#step3').show();
                        $('.progress2').removeClass('is-active').addClass('is-complete');
						$('.progress2 .progress-marker').html('').html(checkIcon);

                        $('.progress3').addClass('is-active');

                        fillStep3();
					}, 500);
			}

		}

        function fillStep3(){
			sessionData = JSON.parse(sessionStorage.getItem("providerDetails"));
			if(sessionData){
			$('#name').text(sessionData.memeberName.substring(0, sessionData.memeberName.lastIndexOf(' ')));
   		    $('#address').text(sessionData.address);
    		$('#number').text(sessionData.number);
   		    $('#providername').text(sessionData.name);
   		    $('#diagnosis').text(sessionData.diagnosis);
   		    $('#Procedure').text(sessionData.service);
   		    $('#date').text(sessionData.date); 

        	}
        }

		function closeSystemErrorNote() { // close the system error note
			document.getElementById("system-error-note-loader").style.display = 'none';
			document.getElementById("system-error-note").style.display = 'none';
		}


		window.onload = function checkFields() { /// to check the current fields when page is refreshed
			if (whiteSpaceTrim(patientValue.value.toString()) != '') {
				patientChecker();
			}
			if (whiteSpaceTrim(diagnosisSymptomsValue.value.toString()) != '') {
				diagnosisSymptomsChecker();
			}
			if (whiteSpaceTrim(serviceValue.value.toString()) != '') {
				serviceChecker();
			}
			if (whiteSpaceTrim(dateOfServiceValue.value.toString()) != '') {
				dateOfServiceChecker();
				dateOfServiceGopChecker();
			}
			if (!patientErrorMsg && !diagnosisSymptomsErrorMsg && !serviceErrorMsg && !dateOfServiceErrorMsg && !
				dateOfServiceThreeDaysErrorMsg && !dateOfServiceThirtyDaysErrorMsg && !dateOfServiceYearErrorMsg) {
				document.getElementById("submit-gop-info-btn").style.backgroundColor =
					'#00a8f7'; ///$accent-color
				document.getElementById("submit-gop-info-btn").style.borderColor =
					'#00a8f7'; ///$accent-color
			} else {
				document.getElementById("submit-gop-info-btn").style.backgroundColor = '#5a6268';
				document.getElementById("submit-gop-info-btn").style.borderColor = '#5a6268';
			}
		}

		function cancelGopSubmit() {
			document.getElementById("cancel-gop-claim").style.display = "block";
		}

		function closeGopModal() {
			document.getElementById("cancel-gop-claim").style.display = "none";
		}

		function cancelGopForm() {
			window.location.href = '/content/expatportal/homepage.external.html';
            sessionStorage.removeItem("providerDetails");
		}

		function displayMenuWarning(url) {
			currentMenuURL = url;
			document.getElementById("cancel-gop-claim").style.display = "block";
		}
