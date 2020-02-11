"use strict";
use(function () {
    var output={
        "fname":"xyz"//tokenMap.get("FirstName");

    };
	
output.token = request.getParameter("opentoken");
    	var token = sling.getService(Packages.com.expatportal.core.service.TokenService);
   	 var tokenMap = token.readtoken(request);

		output.msg=tokenMap.get("msg");
        output.fname=tokenMap.get("FirstName");
    	output.eeid=tokenMap.get("MemberID");
		output.lname=tokenMap.get("LastName");
    	output.grp=tokenMap.get("GroupID");
    	output.dob=tokenMap.get("DateOfBirth");
    	output.key=tokenMap.get("key");
    	
    	

    return output;

});
