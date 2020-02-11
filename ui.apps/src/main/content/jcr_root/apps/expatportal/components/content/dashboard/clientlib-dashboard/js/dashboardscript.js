 var elem = document.getElementById("rotatingText");
 var inst;



$(document).ready(function() {
 // Rotating Message Board 
	var text = [];

    	var counter = 1;
	function displayRotatingMessages(messages){

	    if(messages.length > 0){

	    for(var i=0; i<messages.length;i++){
			text.push(messages[i]);
	    }
	   $('#rotatingText').html(text[0]);
	    inst = setInterval(change, 10000);
	    
	    // stoping rotating messgae on double click
		 elem.addEventListener('click', function (event) {  
			 elem.removeAttribute("title");
       		 clearInterval(inst);
   		 });

	    }
	}


    function change() {

	   // elem.innerHTML = text[0];
        elem.classList.add('fade'); 
        setTimeout(function () {
            elem.innerHTML = text[counter];
            elem.classList.remove('fade');
            counter++;
            if (counter >= text.length) {
                counter = 0;
                // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
            }
        }, 2500);  //fade interval
        
               
    }
    
    if(document.getElementById("system-error-note-loader")){
		document.getElementById("system-error-note-loader").style.display = 'block';
	}
    
    
    // Displaying member name on dashboard pick from session storage
    setTimeout(function(){

    var memberData = sessionStorage.getItem("memberData") != null ? JSON.parse(sessionStorage.getItem("memberData")) : [] ;
    var name = memberData.FirstName
    let lowercase = name.toLowerCase();
    let uppercase = lowercase.charAt(0).toUpperCase() + lowercase.substring(1,lowercase.length); //changing name formate to sentence case
    
  	if(memberData)
  	{
       
       $('#memberName').text(uppercase);
       $('.memberWelcomeMessage').show();
  	}
  	
  	getMemberCoverageData(memberData);
  	
    },2000);

    // Displaying member-coverage -ID on dashboard 
    
    function getMemberCoverageData(memberData){
    	
    	var memberIdentifier = memberData.MemberIdentifier;
    	var clientIdentifier =  memberData.ClientIdentifier;
    	var effectiveDate =""; 
    	var terminationDate = ""; 
    	var coverageCode =""; 
    		  
    	var formData = new FormData();
		formData.append("memberIdentifier", memberIdentifier);
		formData.append("clientIdentifier", clientIdentifier);
		formData.append("effectiveDate", effectiveDate);
		formData.append("terminationDate", terminationDate);
		formData.append("coverageCode", coverageCode);
		
		var messages = [];
		 
        // displaying rotating message logic clientid | default numbers
       if($('#'+clientIdentifier + ' span').val() != undefined){

           $('#'+clientIdentifier + ' span').each(function(){
				messages.push($(this).text());
			});

       }else{
			$('#default' + ' span').each(function(){
				messages.push($(this).text());
			});

       }


		if(messages.length > 0){
			displayRotatingMessages(messages);
		}
		
		var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : "/bin/expatportal/membercoverage",
			"method" : "POST",
			"processData" : false,
			"contentType" : false,
			"data" : formData
		}
		$.ajax(settings).done(function(response) {
			if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'none';
			}

             var hasRxMemberId = false;
              var hasMedicalMemberId = false;
              var hasDentalMemberId = false;
			if(response && response.length > 0){
				var responseObj = JSON.parse(response);
				for(var i=0; i<responseObj.length;i++){
					var obj = responseObj[i];


                    let alternateId = "";
		
		 			var memberData = sessionStorage.getItem("memberData") != null ? JSON.parse(sessionStorage.getItem("memberData")) : [] ;
		 		  	if(memberData)
		  			 {
			  				 alternateId = memberData.AlternateId;  //picking alt id from session storage
		 			 }
				 if(obj.CoverageCode.toLowerCase() == "m" && obj.CoverageId != "" && obj.ActiveInd){
						$('#medicalMemberId').text(alternateId);
						hasMedicalMemberId = true;
                        $('#medicalMemberIdText').show();

					}

                   else if(obj.CoverageCode.toLowerCase() == "rx" && obj.CoverageId != "" && obj.ActiveInd){

						$('#rxMemberId').text(alternateId);
						$('#rxMemberIdText').show();
                        hasRxMemberId = true;
					}

					else if(obj.CoverageCode.toLowerCase() == "d" && obj.CoverageId != "" && obj.ActiveInd){
						$('#dentalMemberId').text(alternateId);
						hasDentalMemberId = true;
						$('#dentalMemberIdText').show();
					}
					else if(obj.CoverageCode.toLowerCase() == "v" && obj.CoverageId != "" && obj.ActiveInd){

						$('#visionMemberId').text(alternateId);
						$('#visionMemberIdText').show();
						
					}
			
				}
                // This is logic we are seperating " | " from member id
                var separator =  "|";

                if(hasMedicalMemberId){
                        $('#rxMemberIdText b').text(separator);
                }
                 if(hasRxMemberId  || hasMedicalMemberId){
                        
                        $('#dentalMemberIdText b').text(separator);
                }
                 if(hasRxMemberId  || hasMedicalMemberId || hasDentalMemberId){
                        
                        $('#visionMemberIdText b').text(separator);
                }
                
				
				
			}
		}).fail(function(response) {
			if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'none';
			}
			
		});
    }

});