var attributeArrayObj = {};
var paymentDetailRequestData = {};
var currencyCodeArray = [];
var totalPage = 0;
var currentPageIndex = 0;

var sortListJson = [
{"value":"FromDateOfService","displayText":"DATE OF SERVICE - NEWEST TO OLDEST"},
{"value":"FromDateOfService", "displayText":"DATE OF SERVICE - OLDEST TO NEWEST"},
{"value": "ClaimAmountTransactions.ProcessedDate", "displayText":"PROCESSED DATE - OLDEST TO NEWEST"},
{"value": "ClaimAmountTransactions.ProcessedDate", "displayText":"PROCESSED DATE - NEWEST TO OLDEST"},
{"value": "Provider.Name", "displayText":"PROVIDER NAME - A TO Z"},
{"value": "Provider.Name", "displayText":"PROVIDER NAME - Z TO A"},
{"value":"ClaimAmounts.TotalBilledAmount", "displayText":"BILLED AMOUNT - LARGEST TO SMALLEST"},
{"value":"ClaimAmounts.TotalBilledAmount", "displayText":"BILLED AMOUNT - SMALLEST TO LARGEST"},
{"value":"ClaimAmountTransactions.PaidAmount", "displayText":"PAID AMOUNT - LARGEST TO SMALLEST"},
{"value": "ClaimAmountTransactions.PaidAmount", "displayText":"PAID AMOUNT - SMALLEST TO LARGEST"}
  
];

var sortASCList = ["DATE OF SERVICE - OLDEST TO NEWEST","PROCESSED DATE - OLDEST TO NEWEST", "PROVIDER NAME - A TO Z", "BILLED AMOUNT - SMALLEST TO LARGEST", "PAID AMOUNT - SMALLEST TO LARGEST"];


var viewClaims = (function() {


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
	
	var _getTodayDate = function(){
		var date = new Date();
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		
		return splittedDate[3] + "-" + getFormatedMonth(splittedDate[1]) + "-" + splittedDate[2];
		 
	};
	
	var _fetchCurrencyDataFromService = function(){
		var currencyURL = "/content/expatportal/claims/viewclaims/jcr:content.paymentcurrency.json";
		var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : currencyURL,
			"method" : "GET",
			"processData" : false,
			"contentType" : false,
			"data" : ""
		}
		$.ajax(settings).done(function(response) {
            var currencyInfo =  response.currencyinfo;
            currencyCodeArray = currencyInfo;
           /* for(var i=0; i < currencyInfo.length;i++){
				if(currencyInfo[i].code.toLowerCase() == currencyCode.toLowerCase())
                {
                    $('.paymentdetails #currency').text(currencyInfo[i].name);
                }
            }*/

		}).fail(function(response) {
			console.log('fail ', response);
		});

};

	var _getCurrencyNameFromArray = function(currencyCode) {
		var currencyName = "";
		if (currencyCode && currencyCodeArray && currencyCodeArray.length > 0) {
			for (var i = 0; i < currencyCodeArray.length; i++) {
				if (currencyCodeArray[i].code.toLowerCase() == currencyCode.toLowerCase()) {
					currencyName = currencyCodeArray[i].name;
					break;
				}
			}
		}
		
		return currencyName;
	}
	
		var _getDecimalPointsFromArray = function(currencyCode) {
		var decimalPoint = "";
		if (currencyCode && currencyCodeArray && currencyCodeArray.length > 0) {
			for (var i = 0; i < currencyCodeArray.length; i++) {
				if (currencyCodeArray[i].code.toLowerCase() == currencyCode.toLowerCase()) {
					decimalPoint = currencyCodeArray[i].decimalPlaces;
					break;
				}
			}
		}
		
		return decimalPoint;
	}
	
	function getFormatedDateFromString(date){
						var splittedDate = date.split("-");

						var month = {
			                            "01" : "Jan",
			                            "1" : "Jan",
			                            "02" : "Feb",
			                            "2" : "Feb",
			                            "03" : "Mar",
			                            "3" : "Mar",
			                            "04" : "Apr",
			                            "4" : "Apr",
			                            "05" : "May",
			                            "5" : "May",
			                            "06" : "Jun",
			                            "6" : "Jun",
			                            "07" : "Jul",
			                            "7" : "Jul",
			                            "08" : "Aug",
			                            "8" : "Aug",
			                            "09" : "Sep",
			                            "9" : "Sep",
			                            "10" : "Oct",
			                            "11" : "Nov",
			                            "12" : "Dec",
                    }

					var finalDateString = splittedDate[2] + "-" + month[splittedDate[1].replace(/[^\x00-\x7F]/g, "")] + "-" + splittedDate[0];

					return finalDateString;

	}
	
	function getFormatedDate(dateObj)
	{			

        var date =  new Date(dateObj);
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		
		return splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[3];

	}


	var _getFromDate = function(){
		var tmpDate = new Date();
		var date = new Date(tmpDate.setMonth(tmpDate.getMonth()-6));
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		var year = splittedDate[3];
		var month =  getFormatedMonth(splittedDate[1]);

		if(month == 0){
			month = 12;
			year = parseInt(year) - 1;
		}
		
		return year + "-" + month + "-" + splittedDate[2];
		 
	};
	
	var _getRelatedClaimsDetails = function(requestData){
		var relatedClaimURL = "/bin/expatportal/memberclaimsearchservice";
		var requestData = requestData || {};
		 var memberData = sessionStorage.getItem("memberData") ? JSON.parse(sessionStorage.getItem("memberData")) : null;
	
		 if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'block';
			}
		 
		 
		 var relationShipType = memberData && memberData.REL_TYP_CD ? "" + memberData.REL_TYP_CD : "";
		 var altId = memberData ? memberData.AlternateId : "" ;
		 var providerId= requestData.providerId ? requestData.providerId : null;
		 var coverageTypeFilters = requestData.coverageTypeFilters ? requestData.coverageTypeFilters : [];
		 var  memberFilters= requestData.memberFilters ? requestData.memberFilters : [];
		 if(relationShipType && relationShipType != "18" && relationShipType !="34")
			 {
			 	var memberId  = memberData && memberData.MemberIdentifier ? "" + memberData.MemberIdentifier : "";
			 	var memberExistsInFilter = false;
			 	if(memberFilters.length > 0){
			 		for(var i=0; i<memberFilters.length;i++){
			 			if(memberFilters == memberId){
			 				memberExistsInFilter = true;
			 			}
			 		}
			 	}
			 	if(!memberExistsInFilter)
			 		{
			 			memberFilters.push(memberId);
			 		}
			 }
		 var statusFilters= requestData.statusFilters ? requestData.statusFilters : [];
		 
		 var fromDate= requestData.dateFrom ? requestData.dateFrom :  _getFromDate();     // before one month date  
		 var toDate= requestData.dateTo ? requestData.dateTo : _getTodayDate();      // current date  
		 var submissionId= requestData.submissionId ? requestData.submissionId :  null;
		 var paymentNumber= requestData.paymentNumber ? requestData.paymentNumber :  null;
		 var includeUnmatchedSubmissions= true;                 // its always true
		 var pageSize= 10;
		 var pageIndex = currentPageIndex;
		 //if(filterData.isApplied)
		 var sortType = $('select#filterClaims.form-control option:selected').text();
		 var order= sortASCList.indexOf(sortType) != -1 ? "Asc" : "Desc";
		 var eobTypeFilter = 1;
		 var sort = requestData && requestData.sort ? requestData.sort : "FromDateOfService";
		 paymentDetailRequestData.fromDate = fromDate;
		 paymentDetailRequestData.toDate = toDate;
		 paymentDetailRequestData.altId = altId;

		var formData = new FormData();
		formData.append("altId", altId);
		formData.append("providerId", providerId);
		formData.append("coverageTypeFilters", coverageTypeFilters);
		formData.append("memberFilters", memberFilters);
		formData.append("statusFilters", statusFilters);
		formData.append("fromDate", fromDate.replace(/[^ -~]/g,''));
		formData.append("toDate", toDate.replace(/[^ -~]/g,''));
		formData.append("submissionId", submissionId);
		formData.append("paymentNumber", paymentNumber);
		formData.append("includeUnmatchedSubmissions", includeUnmatchedSubmissions);
		formData.append("pageSize", pageSize);
		formData.append("pageIndex", pageIndex);
		formData.append("order", order);
		formData.append("sort", sort);
		formData.append("eobTypeFilter", eobTypeFilter);
		//$('#pagination').hide();

		var settings = {
			"async" : false,
			"crossDomain" : true,
			"url" : relatedClaimURL,
			"method" : "POST",
			"processData" : false,
			"contentType" : false,
			"data" : formData
		}
			$.ajax(settings).done(function(response) {
				var responseJSON = response ? JSON.parse(response) : [];
				if(responseJSON && responseJSON.items && responseJSON.items.length > 0){
					
					totalPage = Math.ceil(responseJSON.count/10);
					
					var size = responseJSON.size;
					currentPageIndex = responseJSON.index;
					var currentPage = 0;
					var step = currentPageIndex + 1;
					if(currentPageIndex == 0){
						var paginationText = "1" + " of " + totalPage;
				         $('#pagination #prev').attr('disabled','disabled');
	                        $('#pagination #next').removeAttr('disabled');
						$('#totalViewClaims').text(paginationText);
						
					}
					
					currentResultCount = responseJSON.items.length;
					totalResult = responseJSON.count;
					
					
					var displayCount = (size *(step -1) + 1) + "-" + (step * size) + " of " + totalResult;
					if(currentPageIndex >= totalPage -1 ){
						displayCount = (size *(step -1) + 1) + "-" + totalResult + " of " + totalResult;
					}
					var displayClaimCountText = displayCount;
					$('#totalNumberClaims').text(displayClaimCountText);
					
					var dateRangeText  = "From " + getFormatedDateFromString(fromDate) + " to " + getFormatedDateFromString(toDate);
					$('#p-ClaimsDateRange').text(dateRangeText);
					
					_bindRelatedClaimsTemplate(responseJSON.items);
					filterClaims.displayProviderFilter(responseJSON.items);
					$('#noClaimsOnFile').hide();
					$('#noClaimsByCriteria').hide();
					$('#claims').show();
					$('#sortByFilter').show();
				}
				else
					{
					if(filterData.isApplied = true){

						$('#noClaimsByCriteria').show();
					}
					else
						{
							$('#noClaimsOnFile').show();
						}
					
					$('#claims').hide();
					$('#pagination').hide();
					$('#sortByFilter').hide();
					var displayClaimCountText = " 0 of 0";
                        var dateRangeNoResultText  = "From " + getFormatedDateFromString(fromDate) + " to " + getFormatedDateFromString(toDate);
					$('#p-ClaimsDateRange').text(dateRangeNoResultText);
					$('#totalNumberClaims').text(displayClaimCountText);
					}
				
				if(document.getElementById("system-error-note-loader")){
					document.getElementById("system-error-note-loader").style.display = 'none';
				}
				

			}).fail(function(response) {
				console.log('fail membercall', response);
				$('#noClaimsOnFile').show();
				$('#claims').hide();
				$('#pagination').hide();
				$('#sortByFilter').hide();
				
				if(response.status === 504){
					$('#noServiceResponse').show();
					$('#noClaimsOnFile').hide();
					
				}
				
				if(document.getElementById("system-error-note-loader")){
					document.getElementById("system-error-note-loader").style.display = 'none';
				}
			});
	};
	
	var _getClaimAttributes = function(){
		var relatedClaimURL = "/bin/expatportal/memberclaimsearchservice";
		
		if(document.getElementById("system-error-note-loader")){
			document.getElementById("system-error-note-loader").style.display = 'block';
		}
		
		var settings = {
				"async" : true,
				"crossDomain" : true,
				"url" : relatedClaimURL,
				"method" : "GET",
				"processData" : false,
				"contentType" : false,
				"data" : ""
			}
				$.ajax(settings).done(function(response) {
					var responseJSON = JSON.parse(response);
					for(var i=0; i<responseJSON.length;i++){
						attributeArrayObj[responseJSON[i].id] = responseJSON[i].name;
					}
					_getRelatedClaimsDetails();
					filterClaims.displayCoverageFilter(responseJSON);
					
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
	
	var _getSortList = function(){
		
				
                  
					var responseJSON = sortListJson;
					for(var i=0; i<responseJSON.length;i++){
						var option ="";
						if(i == 0){
							option = '<option selected data-sort=' + responseJSON[i].value + ">" + responseJSON[i].displayText + "</option";
						}
						else
							{
							option = '<option data-sort=' + responseJSON[i].value + ">" + responseJSON[i].displayText + "</option";
							}
						$('#filterClaims').append(option);
					}
                

				
	};

// Function to set from date to previous 2 years
    var formatInvalidDate = function(invaliDate) {     
        let dateObj = invaliDate.split("-"),
            month = dateObj[1],
            day = dateObj[2],
            year = dateObj[0];
        //check to support Number calculation in Internet explorer
        if(year.length == 5) { 
            var correctYear = year.substring(1,5);
            year = Number(correctYear) -2;
        }else{
            year = Number(year) -2;
        }
        return [year, month, day].join('-');
    }

	var _bindRelatedClaimsTemplate = function(claimsData){
		$('#claims').empty();	
		for(var i=0; i<claimsData.length; i++){
				var claim = claimsData[i];
				 var parser = new DOMParser();
                 var temp = $("#view-claim-tile-template").html();
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
                 if(claim.ediStatus){
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
                	 $(tpl).find('#claimStatus').text(attributeArrayObj[claim.ediStatus.displayTextId]);   // coverage type
                 }
                 if(claim.claimAmounts && claim.claimAmounts.length > 0){
                	 $(tpl).find(".amount-billed-details #currency-billed").text(_getCurrencyNameFromArray(claim.claimAmounts[0].currencyCode)); 
					 //get decimal points
					 let decimalPt = _getDecimalPointsFromArray(claim.claimAmounts[0].currencyCode);
					 //full currency name
                	 $(tpl).find(".amount-billed-details #amount-billed").text(claim.claimAmounts[0].currencyCode+ " " + (claim.claimAmounts[0].totalBilledAmount).toFixed(decimalPt));  //Amount billed 
					 let decimalUSDPt = _getDecimalPointsFromArray("USD");
                     if(claim.claimAmounts[0].totalBilledAmountInUSD >= 0){
                     $(tpl).find(".amount-billed-details #dollarBilled").text("USD " + (claim.claimAmounts[0].totalBilledAmountInUSD).toFixed(decimalUSDPt));   //Amount Billed in usd
                     }else{
						$(tpl).find(".amount-billed-details #dollarBilled").css("display","none");
                     }
                     if(claim.claimAmounts[0].currencyCode.toLowerCase() == 'usd'){
                    	 $(tpl).find(".amount-billed-details #dollarBilled").css("display","none");
                     }
                  }else{
					$(tpl).find(".amount-billed-details").css("display","none");
                 }
                 if(claim.patient && claim.patient.member && claim.patient.member.firstName){
                         $(tpl).find(".view-claim-name #userClaim").text(claim.patient.member.firstName + "'s Claim");  //Patient name
                 }
                 if(claim.provider){
                     var checkName = claim.provider.name ? claim.provider.name : claim.provider.firstName;
                	 var providerText = claim.provider.name ? claim.provider.name : claim.provider.firstName + " " + claim.provider.lastName;
                     if(checkName){
                		 $(tpl).find(".view-clinic span").text(providerText);   // provider name
                     }else{
								$(tpl).find(".view-clinic i").css("display","none");
                     }
                 }
                 if(claim.paymentRecipientCode){
                	 var memberText = claim.paymentRecipientCode.toUpperCase() == "MBR" ? "Member" : "Provider"; 
                	 $(tpl).find(".view-claim-member p").text(memberText);  // Pay To
                	 
                 }
                 if(claim.claimAmountTransactions.length > 0 && claim.claimAmounts.length > 0){
                     if(claim.claimAmountTransactions[0].processedDate){

                     $(tpl).find('#processDate').text(getFormatedDate(claim.claimAmountTransactions[0].processedDate));   // Processed date
                     }else{

						$(tpl).find('#processDateRow').css("display","none");

                     }
                     if(claim && claim.claimAmountTransactions.length > 0){
                	 $(tpl).find(".amount-paid-details #currency-paid").text(viewClaims.getCurrencyNameFromArray(claim.claimAmountTransactions[0].paidCurrencyCode)); //  amount paid full currency name
                	
                 }
                     if(claim.claimAmountTransactions[0].paidAmountInUSD && Number(claim.claimAmountTransactions[0].paidAmountInUSD) >=0 && claim.claimAmountTransactions[0].paidCurrencyCode !== "USD"){
						 let decimalUSDPt = _getDecimalPointsFromArray("USD");
                      $(tpl).find(".amount-paid-details #dollarPaid").text("USD " + (claim.claimAmountTransactions[0].paidAmountInUSD).toFixed(decimalUSDPt));  // Amount paid in Usd
                     }
                     if(claim.claimAmountTransactions.length > 0 && claim.claimAmountTransactions[0].paidAmount && Number(claim.claimAmountTransactions[0].paidAmount) >=0){
						  let decimalPt = _getDecimalPointsFromArray(claim.claimAmountTransactions[0].paidCurrencyCode);
                      $(tpl).find(".amount-paid-details #amount-paid").text(claim.claimAmountTransactions[0].paidCurrencyCode + " " + (claim.claimAmountTransactions[0].paidAmount).toFixed(decimalPt));  //Amount Paid 
                     }else{
						 $(tpl).find(".amount-paid-details #amountPaid").css("display","none");
                     }
                     if(claim.claimAmountTransactions[0].payment && claim.paymentRecipientCode.toUpperCase() == "MBR" && claim.claimAmountTransactions[0].payment.bankReferenceNumber ){

                    	$(tpl).find('#payment-number a').text(claim.claimAmountTransactions[0].payment.bankReferenceNumber.trim());         // PAYMENT NUMBER

                     $(tpl).find('#payment-number a').click(function(event){
                    	 event.preventDefault();
						 var currentDate = new Date();
						 var fromDateStaamp = new Date();
						 paymentDetailRequestData.toDate = currentDate.toISOString().split("T")[0];
						  /* 
						  *Code to Reduce 18 months
						  *
						  fromDateStaamp.setMonth(fromDateStaamp.getMonth()-18);
						   paymentDetailRequestData.fromDate = fromDateStaamp.toISOString().split("T")[0];*/

						   //Remove below Line for 18 months requirement
						paymentDetailRequestData.fromDate = formatInvalidDate(fromDateStaamp.toISOString().split("T")[0]);
						
				    	 paymentDetailRequestData.paymentNumber = $(this).text();
                         paymentDetailRequestData.pageIndex = 0;
                    	 relatedClaims.getRelatedClaimsDetails(paymentDetailRequestData);
                    	 paymentDetails.getPaymentDetails(paymentDetailRequestData);

                     });
                    }else{
						 $(tpl).find('#payment-number-row').css("display","none");
                    }
                 }else{
					$(tpl).find('#processDateRow').css("display","none");
                      $(tpl).find(".amount-paid-details #amountPaid").css("display","none");
					 $(tpl).find('#payment-number-row').css("display","none");
                 }
                 
                 var showMemberBenefitsLink = (claim.claimTypeCode.toLowerCase() == 'v' || claim.claimTypeCode.toLowerCase() == 'd') ? false : true;
                 if(claim.claimAmountTransactions && claim.claimAmountTransactions.length > 0 
                		 && claim.claimAmountTransactions[0].duncanStatusCode == "STDS" && showMemberBenefitsLink){
                	 $(tpl).find('.btn-benefits').css('display','block');
                	 $(tpl).find('.btn-benefits').attr('data-claimId',claim.claimAmountTransactions[0].externalClaimId);
                	 $(tpl).find('.btn-benefits').on('click',function(e){
                 		 var claimId =  $(this).attr('data-claimId');
                 		 _getPdfFromService(claimId);
                 	 });
                 }

                
            if(claim.id && Number(claim.id) >= 0){
                 $(tpl).find('#claimid').text(claim.id);    //claim id
            }else{
				 $(tpl).find('#claimidRow').css("display","none");
            }

            if(getFormatedDate(claim.fromDateOfService)){
                 $(tpl).find('#dateOfService').text(getFormatedDate(claim.fromDateOfService));   //Date of Service
            }else{
				$(tpl).find('#dateOfServiceRow').css("display","none");
            }
            
                 if(totalPage > 1){
                	 $('#pagination').show();
                 }
                 else
                	 {
                	 $('#pagination').hide();
                	 }

                 $('#claims').append($(tpl).find('.view-claim-cards-container'));
		}
	};

	var _getPdfFromService = function(claimId){
		
		var externalClaimId = claimId || "";
		var currencyURL = "/bin/expatportal/getpdfresponse?claimId=" + externalClaimId;
		var settings = {
			"async" : true,
			"crossDomain" : true,
			"url" : currencyURL,
			"method" : "GET",
			"processData" : false,
			"contentType" : false,
			"data" : ""
		}
		$.ajax(settings).done(function(response) {
		
			if(response){
				var encodedString =JSON.parse(response);
				 var link = document.createElement('a');
		   		 link.download = externalClaimId + '.pdf';
		   		 link.href = 'data:application/pdf;base64,' + encodedString;
		   		// link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                
                if (navigator.msSaveBlob) 
                { // IE 10+ 
                	//console.log('IE clicked');
                	//var blob = new Blob([encodedString], { type: 'data:application/pdf;base64;charset=utf-8'});
                	//navigator.msSaveBlob(blob,externalClaimId + '.pdf' ); 
                	
                	    var byteCharacters = atob(encodedString);
                	    var byteNumbers = new Array(byteCharacters.length);
                	    for (var i = 0; i < byteCharacters.length; i++) {
                	        byteNumbers[i] = byteCharacters.charCodeAt(i);
                	    }
                	    var byteArray = new Uint8Array(byteNumbers);
                	    var blob = new Blob([byteArray], {type: 'application/pdf'});
                	    navigator.msSaveBlob(blob,externalClaimId + '.pdf' );
                }
                else
                	{
                	 link.click();
                	}
		   		
				//link.remove();
			}
		

		}).fail(function(response) {
			console.log('fail ', response);
		});
	};
	 return {
		 
		 getClaimAttributes : _getClaimAttributes,
		 getRelatedClaimsDetails : _getRelatedClaimsDetails,
		 getSortList : _getSortList,
		 fetchCurrencyDataFromService : _fetchCurrencyDataFromService,
		 getCurrencyNameFromArray : _getCurrencyNameFromArray,
         getDecimalPointsFromArray:  _getDecimalPointsFromArray,
		 getPdfFromService : _getPdfFromService
};
})();


$(document).ready(function(){
	
	 
	 
	viewClaims.fetchCurrencyDataFromService();
	viewClaims.getClaimAttributes();
	viewClaims.getSortList();
	$('#pagination #prev').on('click', function(e){
		//var requestData = {};
         $('#pagination #next').removeAttr('disabled');
		currentPageIndex--;
        var backPageIndex = currentPageIndex +1;
		var paginationText = backPageIndex + " of " + totalPage;
		$('#totalViewClaims').text(paginationText);
		if(currentPageIndex >= 0){
			viewClaims.getRelatedClaimsDetails(filterData);
			//$('#pagination #next').removeAttr('disabled');
		}
		if(currentPageIndex < 0)
		{
			$(this).attr('disabled','disabled');
			currentPageIndex = 0;
		}
		
		 $('html, body').animate({
             scrollTop: $("#tiles-top").offset().top
		 }, 100);		
	});
	$('#pagination #next').on('click', function(e){
		//var requestData = {};
		currentPageIndex++;
         var nextPageIndex = currentPageIndex +1;
		//if(currentPageIndex != 1){
			var paginationText = (nextPageIndex) + " of " + totalPage;
			$('#totalViewClaims').text(paginationText);
		//}

		
		if(currentPageIndex <= totalPage - 1){
			viewClaims.getRelatedClaimsDetails(filterData);
			$('#pagination #prev').removeAttr('disabled');
		}
		if(currentPageIndex >= totalPage -1 )
		{
			$(this).attr('disabled','disabled');
			
		}
		
					
		
		 $('html, body').animate({
             scrollTop: $("#tiles-top").offset().top
		 	}, 100);
		
	});
	

});
