use (function() {
	

	var Calendar = Packages.java.util.Calendar;
    var currentYear = Calendar.getInstance().get(Calendar.YEAR);

    return {
        year: currentYear
    };
	
});