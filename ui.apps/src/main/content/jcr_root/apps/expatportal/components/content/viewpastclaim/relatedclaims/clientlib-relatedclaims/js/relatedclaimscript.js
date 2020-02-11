var totalPageNum = 0;
var currentPageNum = 0;
var paymentNum="";


var relatedClaims = (function() {
	
	function getFormatedDate(dateObj)
	{			

        var date = new Date(dateObj);
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		
		return splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[3];

	}

	
	
	var _getRelatedClaimsDetails = function(requestData){
		var relatedClaimURL = "/bin/expatportal/memberclaimsearchservice";

		if(document.getElementById("system-error-note-loader")){
			document.getElementById("system-error-note-loader").style.display = 'block';
		}
		var memberData = sessionStorage.getItem("memberData") ? JSON.parse(sessionStorage.getItem("memberData")) : null;
		 var relationShipType = memberData && memberData.REL_TYP_CD ? "" + memberData.REL_TYP_CD : "";
		 var altId = null;                                    //memberData ? memberData.AlternateId : "" 
		 var providerId= null;
		 var coverageTypeFilters = [];
		 var  memberFilters= [];
		 if(relationShipType && relationShipType != "18" && relationShipType !="34")
		 {
		 	var memberId  = memberData && memberData.MemberIdentifier ? "" + memberData.MemberIdentifier : "";
		 	memberFilters = [memberId];
         }
			 if(requestData.paymentNumber != null && requestData.paymentNumber != undefined){
				 sessionStorage.setItem("paymentNum", requestData.paymentNumber);
			 
		 }
	
		 var statusFilters= [];
		 var fromDate= null;                               //requestData.fromDate;      // before one month date  
		 var toDate= null;                                              // current date
		 var submissionId= null;
		 var paymentNumber= requestData.paymentNumber != null? requestData.paymentNumber: sessionStorage.getItem("paymentNum");
		 var includeUnmatchedSubmissions= true;                 // its always true
		 var pageSize= 10;
		
		 var pageIndex= currentPageNum;
		  if(requestData.pageIndex == 0){
			  pageIndex = requestData.pageIndex;
		  }
		 var order="Desc";
		 var sort= "FromDateOfService";
		 var eobTypeFilter = 1;
		 
		
		 var paymentText = "PAYMENT NUMBER - " + paymentNumber;
		 $('#payment-detail-header-title').text(paymentText)
		 
		var formData = new FormData();
		formData.append("altId", altId);
		formData.append("providerId", providerId);
		formData.append("coverageTypeFilters", coverageTypeFilters);
		formData.append("memberFilters", memberFilters);
		formData.append("statusFilters", statusFilters);
		formData.append("fromDate", fromDate);
		formData.append("toDate", toDate);
		formData.append("submissionId", submissionId);
		formData.append("paymentNumber", paymentNumber);
		formData.append("includeUnmatchedSubmissions", includeUnmatchedSubmissions);
		formData.append("pageSize", pageSize);
		formData.append("pageIndex", pageIndex);
		formData.append("order", order);
		formData.append("sort", sort);
		formData.append("eobTypeFilter", eobTypeFilter);
		var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : relatedClaimURL,
			"method" : "POST",
			"processData" : false,
			"contentType" : false,
			"data" : formData
		}
			$.ajax(settings).done(function(response) {
	              var responseJSON = JSON.parse(response);
				  paymentNum = responseJSON.paymentInstructionNumber;
				  if(responseJSON && responseJSON.items && responseJSON.items.length > 0){
					
					totalPageNum = Math.ceil(responseJSON.count/10);
					 if(totalPageNum > 1){
                	 $('#pagination-related-claim').show();
                 }
                 else
                	 {
                	 $('#pagination-related-claim').hide();
                	 }
					
					var size = responseJSON.size;
					currentPageNum = responseJSON.index;
					var step = currentPageNum + 1;
					if(currentPageNum == 0){
						var paginationText = "1" + " of " + totalPageNum;
				         $('#pagination-related-claim #prev').attr('disabled','disabled');
	                        $('#pagination-related-claim #next').removeAttr('disabled');
						$('#relatedClaims').text(paginationText);
						
					}
					
					currentResultCount = responseJSON.items.length;
					totalResult = responseJSON.count;
					
					
					var displayCount = (size *(step -1) + 1) + "-" + (step * size) + " of " + totalResult;
					if(currentPageNum >= totalPageNum -1 ){
						displayCount = (size *(step -1) + 1) + "-" + totalResult + " of " + totalResult;
					}
					
				  }
				_bindRelatedClaimsTemplate(responseJSON.items);
				if(document.getElementById("system-error-note-loader")){
					document.getElementById("system-error-note-loader").style.display = 'none';
				}

			}).fail(function(response) {
				console.log('fail ', response);
				if(document.getElementById("system-error-note-loader")){
					document.getElementById("system-error-note-loader").style.display = 'none';
				}
			});
	};
	
	var _bindRelatedClaimsTemplate = function(claimsData){
		
		 $('#relatedPaymentContainer').empty();
			
		for(var i=0; i<claimsData.length; i++){
				var claim = claimsData[i];
				 var parser = new DOMParser();
                 var temp = $("#related-payment-cards-container-template").html();
                 var tpl = parser.parseFromString(temp, "text/html");

	              if(claim.submission){
                	 $(tpl).find(".view-claim-desc p").text(claim.submission.nickname);  //claim NickName
                	 if(claim.submission.exelaSubmissionId && claim.paymentRecipientCode.toUpperCase() == "MBR"){         // submission Id
                    	 $(tpl).find("p#view-claim-submissionvalue").text(claim.submission.exelaSubmissionId);      
                     }else{
						$(tpl).find("#view-claim-submissionid-row").css("display","none");
                     }
                 }
                 else
           	  {
           	  	$(tpl).find("#view-claim-submissionid-row").css("display","none");
           	  }
                 if(claim.ediStatus){																	// coverage type
                	 var displayId = "" + claim.ediStatus.displayTextId;
                	 switch(displayId){
                	 case "1901": $(tpl).find(".icon-container-rounded").html($('#received_icon').html());
                	 			  break;
                	 case "1902": $(tpl).find(".icon-container-rounded").html($('#processing_icon').html());
                	 			  break;
                	 case "1903": $(tpl).find(".icon-container-rounded").html($('#issuing_payment_icon').html());
                	 				break;
                	 case "1904": $(tpl).find(".icon-container-rounded").html($('#processed_icon').html());
   	 			  					break;
                	 default: console.log("No Processing status found");
                	 				break;
   	 			  

                	 }
                	 $(tpl).find('#claimStatus').text(attributeArrayObj[claim.ediStatus.displayTextId]);   
                 }
                 if(claim.claimAmounts && claim.claimAmounts.length > 0){
                	 $(tpl).find(".amount-billed-details #currency-relatedclaims-billed").text(viewClaims.getCurrencyNameFromArray(claim.claimAmounts[0].currencyCode));  // full currency name
					let decimalPt = viewClaims.getDecimalPointsFromArray(claim.claimAmounts[0].currencyCode);
                     $(tpl).find(".amount-billed-details #amount-relatedclaims-billed").text(claim.claimAmounts[0].currencyCode+ " " + (claim.claimAmounts[0].totalBilledAmount).toFixed(decimalPt));  //Amount billed 
                     if(claim.claimAmounts[0].totalBilledAmountInUSD >= 0){
                         let decimalUSDPt = viewClaims.getDecimalPointsFromArray("USD");
                     $(tpl).find(".amount-billed-details #dollar-relatedclaims-billed").text("USD " + (claim.claimAmounts[0].totalBilledAmountInUSD).toFixed(decimalUSDPt));   //Amount Billed in usd
                     }else{
                      
						$(tpl).find(".amount-billed-details #dollar-relatedclaims-billed").css("display","none");
                     }
                     if(claim.claimAmounts[0].currencyCode.toLowerCase() == 'usd'){
                    	 $(tpl).find(".amount-billed-details #dollar-relatedclaims-billed").css("display","none");
                     }
                  }else{
					$(tpl).find(".amount-billed-details").css("display","none");
                 }
                 if(claim.patient && claim.patient.member && claim.patient.member.firstName){                                    //Patient name
                         $(tpl).find(".view-claim-name #userClaim").text(claim.patient.member.firstName + "'s Claim");  
                 }
                 if(claim.provider){                                                                                     // provider name
                     var checkName = claim.provider.name ? claim.provider.name : claim.provider.firstName;
                	 var providerText = claim.provider.name ? claim.provider.name : claim.provider.firstName + " " + claim.provider.lastName;
                     if(checkName){
                		 $(tpl).find(".view-clinic span").text(providerText);   
                     }else{
								$(tpl).find(".view-clinic i").css("display","none");
                     }
                 }
                 if(claim.paymentRecipientCode){
                	 var memberText = claim.paymentRecipientCode.toUpperCase() == "MBR" ? "Member" : "Provider"; 
                	 $(tpl).find(".view-claim-member p").text(memberText);  // Pay To
                	 
                 }
                 if(claim.claimAmountTransactions.length > 0 && claim.claimAmounts.length > 0){                                  // Processed date
                     if(claim.claimAmountTransactions[0].processedDate){

                     $(tpl).find('#processDate').text(getFormatedDate(claim.claimAmountTransactions[0].processedDate));  
                     }else{

						$(tpl).find('#processDateRow').css("display","none");

                     }
                     if(claim && claim.claimAmountTransactions.length > 0){
                    	 $(tpl).find(".amount-paid-details #currency-relatedclaims-paid").text(viewClaims.getCurrencyNameFromArray(claim.claimAmountTransactions[0].paidCurrencyCode)); //  amount paid full currency name
                    	
                     }
                         if(claim.claimAmountTransactions[0].paidAmountInUSD && Number(claim.claimAmountTransactions[0].paidAmountInUSD) >=0){
                              let decimalUSDPt = viewClaims.getDecimalPointsFromArray("USD");
                          $(tpl).find(".amount-paid-details #dollar-relatedclaims-paid").text("USD " + (claim.claimAmountTransactions[0].paidAmountInUSD).toFixed(decimalUSDPt));  // Amount paid in Usd
                         }
                         if(claim.claimAmountTransactions.length > 0 && claim.claimAmountTransactions[0].paidAmount && Number(claim.claimAmountTransactions[0].paidAmount) >=0){
 							let decimalPt = viewClaims.getDecimalPointsFromArray(claim.claimAmountTransactions[0].paidCurrencyCode);

                          $(tpl).find(".amount-paid-details #amount-relatedclaims-paid").text(claim.claimAmountTransactions[0].paidCurrencyCode + " " + (claim.claimAmountTransactions[0].paidAmount).toFixed(decimalPt));  //Amount Paid 
                         }else{
    						 $(tpl).find(".amount-paid-details #amountPaid").css("display","none");
                         }
                         
                         if(claim.claimAmountTransactions[0].paidCurrencyCode && claim.claimAmountTransactions[0].paidCurrencyCode.toLowerCase() == 'usd'){
                        	 $(tpl).find(".amount-paid-details #amountPaid #dollar-relatedclaims-paid").css("display","none");
                         }
                         if(claim.claimAmountTransactions[0].payment && claim.paymentRecipientCode.toUpperCase() == "MBR" && claim.claimAmountTransactions[0].payment.bankReferenceNumber ){

                        	$(tpl).find('#payment-number a').text(claim.claimAmountTransactions[0].payment.bankReferenceNumber.trim());         // PAYMENT NUMBER



                    }else{
						 $(tpl).find('#payment-number-row').css("display","none");
                    }
                 }else{
					$(tpl).find('#processDateRow').css("display","none");
                      $(tpl).find(".amount-paid-details #amountPaid").css("display","none");
					                 }
                 var showMemberEobLink = (claim.claimTypeCode.toLowerCase() == 'v' || claim.claimTypeCode.toLowerCase() == 'd') ? false : true; 
                 if(claim.claimAmountTransactions && claim.claimAmountTransactions.length > 0 
                		 && claim.claimAmountTransactions[0].duncanStatusCode == "STDS" && showMemberEobLink){
                	 $(tpl).find('.btn-benefits').css('display','block');
                	 $(tpl).find('.btn-benefits').attr('data-claimId',claim.claimAmountTransactions[0].externalClaimId);
                	 $(tpl).find('.btn-benefits').on('click',function(e){
                 		 var claimId =  $(this).attr('data-claimId');
                 		viewClaims.getPdfFromService(claimId);
                 	 });
                 }
                 
            if(claim.id && Number(claim.id) >= 0){
                 $(tpl).find('#claimid').text(claim.id);    //claim id
            }else{
				 $(tpl).find('#claimidRow').css("display","none");
            }

            if(getFormatedDate(claim.fromDateOfService)){
                 $(tpl).find('#dateOfService').text(getFormatedDate(claim.fromDateOfService));   //Date of Service
            }
            else{
				$(tpl).find('#dateOfServiceRow').css("display","none");
            }



                 $('#relatedPaymentContainer').append($(tpl).find('.view-claim-cards-container'));
                
		}
		 $('#relatedPaymentContainer').show();
		 $('.paymentdetails').show();
         $('.viewClaimBody').hide();
         $('html, body').animate({
             scrollTop: $("#claims").offset().top
		 	}, 100);
		};
		
		
	 return {
		 getRelatedClaimsDetails : _getRelatedClaimsDetails
};
})();


$(document).ready(function(){
	
	$('.header-text').click(function(){
		 $('#relatedPaymentContainer').hide();
		 $('.paymentdetails').hide();
         $('.viewClaimBody').show();
	});
	
	$('#pagination-related-claim #prev').on('click', function(e){
		//var requestData = {};
         $('#pagination-related-claim #next').removeAttr('disabled');
		currentPageNum--;
        var backPageIndex = currentPageNum +1;
		var paginationText = backPageIndex + " of " + totalPageNum;
		filterData.paymentNum = paymentNum;
		$('#relatedClaims').text(paginationText);
		if(currentPageNum >= 0){
			relatedClaims.getRelatedClaimsDetails(filterData);
			//$('#pagination-related-claim #next').removeAttr('disabled');
		}
		if(currentPageNum < 0)
		{
			$(this).attr('disabled','disabled');
			currentPageNum = 0;
		}
		
		 $('html, body').animate({
             scrollTop: $("#tiles-top").offset().top
		 }, 100);		
	});
	$('#pagination-related-claim #next').on('click', function(e){
		//var requestData = {};
		currentPageNum++;
		
         var nextPageNum = currentPageNum +1;
		
			var paginationText = (nextPageNum) + " of " + totalPageNum;
			$('#relatedClaims').text(paginationText);
		

		
		if(currentPageNum <= totalPageNum - 1){
			relatedClaims.getRelatedClaimsDetails(filterData);
			$('#pagination-related-claim #prev').removeAttr('disabled');
		}
		if(currentPageNum >= totalPageNum -1 )
		{
			$(this).attr('disabled','disabled');
			
		}

});

});