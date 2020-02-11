$(document).ready(function() {
	var IDLE_TIMEOUT = 1080; // seconds
	var _idleSecondsTimer = null;
	var _idleSecondsCounter = 0;

	function clearTimer() {
		if ($("#page-timeout").is(":not(:visible)")) {
			_idleSecondsCounter = 0;
			countDownTimer = 0;
		}
	}

	document.onclick = function() {
		clearTimer();
	};

	document.onmousemove = function() {
		clearTimer();

	};

	document.onkeypress = function() {
		clearTimer();
	};

	_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);

	var countDownTimer = 0;

	function CheckIdleTime() {
		_idleSecondsCounter++;

		if (_idleSecondsCounter >= IDLE_TIMEOUT) {
			window.clearInterval(_idleSecondsTimer);
			removeAllFiles();
			sessionStorage.removeItem("tkey");
			sessionStorage.removeItem("memberData"); // this line is for
														// removing member data
														// from session storage
			// alert("It seems your session / token is expired");
			window.setTimeout(function() {
				window.location = $("#header").data("loginpage");
			}, 2000);

		}

		if (_idleSecondsCounter >= IDLE_TIMEOUT - (2 * 60)) {
			countDownTimer += 1;
			$("#page-timeout").show();
			updateCountdownTimer(120 - countDownTimer);
		}
	}
});

function reloadPageSession() {

	$("#page-timeout").hide();
	$("#page-timeout").is(":not(:visible)");

}

function closePageSession() {
	removeAllFiles();
	sessionStorage.removeItem("tkey");
	sessionStorage.removeItem("memberData");

	window.setTimeout(function() {
		window.location = $("#header").data("loginpage");
	}, 2000);
}

function updateCountdownTimer(seconds) {

	var updatedMinuts = parseInt(seconds / 60);
	var updatedSeconds = seconds % 60;
	if (updatedSeconds < 10) {
		updatedSeconds = "0" + updatedSeconds;
	}
	if(parseInt(seconds) >= 0){
	var updatedtime = updatedMinuts + ":" + updatedSeconds;
	$("#page-timeout-timer").html(updatedtime);
	}
}