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
    	output.mbrid=tokenMap.get("ghmbrID");
		output.lname=tokenMap.get("LastName");
       	output.eeid=tokenMap.get("MemberID");
		output.grp=tokenMap.get("GroupID");
    	output.dob=tokenMap.get("DateOfBirth");
    	output.key=tokenMap.get("key");
    	output.mbrid=tokenMap.get("ghmbrId");

    return output;

});