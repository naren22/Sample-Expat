
var totalPage = 0;
var currencyCodeArray = [];
var totalPage = 0;
var currentPageIndex = 0;
var paymentDetailRequestData = {};


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

        var date = new Date(dateObj);
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		
		return splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[3];

	}


var sortByListJson = [
{"value":"+IssueDate","displayText":"PAYMENT DATE - OLDEST TO NEWEST"},
{"value":"-IssueDate", "displayText":"PAYMENT DATE - NEWEST TO OLDEST"},
{"value": "+PaidAmount", "displayText":"PAID AMOUNT - LARGEST TO SMALLEST"},
{"value": "-PaidAmount", "displayText":"PAID AMOUNT - SMALLEST TO LARGEST"},
 
];

var sortByASCList = ["PAYMENT DATE - OLDEST TO NEWEST","PAYMENT DATE - NEWEST TO OLDEST", "PAID AMOUNT - LARGEST TO SMALLEST", "PAID AMOUNT - SMALLEST TO LARGEST"];

var viewReimbursment = (function() {
	
	 var _getSortByList = function(){
			
			var responseJSON = sortByListJson;
			for(var i=0; i<responseJSON.length;i++){
				var option ="";
				if(i == 0){
					option = '<option selected data-sort=' + responseJSON[i].value + ">" + responseJSON[i].displayText + "</option";
				}
				else
					{
					option = '<option data-sort=' + responseJSON[i].value + ">" + responseJSON[i].displayText + "</option";
					}
				$('#filterSortByClaims').append(option);
			}
	   
	};
	
	var _getTodayDate = function(){
		var date = new Date();
        var localeDateString = date.toDateString();
		var splittedDate = localeDateString.split(" ");
		
		return splittedDate[3] + "-" + getFormatedMonth(splittedDate[1]) + "-" + splittedDate[2];
		 
	};

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

	var _getReimbursementClaimDetails = function(requestData){
		var reimbursementClaimURL = "/bin/expatportal/viewreimbursement";
		var requestData = requestData || {};
		 var memberData = sessionStorage.getItem("memberData") ? JSON.parse(sessionStorage.getItem("memberData")) : null;
	
		 if(document.getElementById("system-error-note-loader")){
				document.getElementById("system-error-note-loader").style.display = 'block';
		 }
		 var altId = "918571538"; //memberData ? memberData.AlternateId : "" ;
		 var bankRefNum= "null"; //requestData.bankRefNum ? requestData.bankRefNum : null;
		 var topsSequenceNumber = "02";
		 var recipientType = "MBR";
		 var endDate=  requestData.dateTo ? requestData.dateTo : "2019-08-12";// _getFromDate();      
		 var startDate= requestData.dateFrom ? requestData.dateFrom :"2010-08-12";// _getTodayDate();        
		 var claimId= "null"; //requestData.claimId ? requestData.claimId :  null;
		 var includeRefundedPayments= true;                 // its always true
		 var limit= 5;
		 var offset = currentPageIndex;
		 var sort = requestData && requestData.sort ? requestData.sort : "+IssueDate";

		$('#reimbursementClaims').empty();
		$('#pagination').hide();

		var formData = new FormData();
            formData.append("altId", altId);
            formData.append("bankRefNum", bankRefNum);
            formData.append("recipientType", recipientType);
            formData.append("topsSequenceNumber", topsSequenceNumber);
            formData.append("endDate", endDate.replace(/[^ -~]/g,''));
            formData.append("startDate", startDate.replace(/[^ -~]/g,''));
            formData.append("claimId", claimId);
            formData.append("includeRefundedPayments", includeRefundedPayments);
            formData.append("limit", limit);
            formData.append("offset", offset);
            formData.append("sort", sort);

		var settings = {
			"async" : false,
			"crossDomain" : true,
			"url" : reimbursementClaimURL,
			"method" : "POST",
			"processData" : false,
			"contentType" : false,
			"data" : formData
		}
			$.ajax(settings).done(function(response) {
				var responseJSON = response;
				if(responseJSON && responseJSON.items && responseJSON.items.length > 0){
					

					totalPage = Math.ceil(responseJSON.count/5);
					
					var size = responseJSON.size;
					currentPageIndex = responseJSON.index;
					var currentPage = 0;
					var step = currentPageIndex + 1;
					if(currentPageIndex == 0){
						var paginationText = "1" + " of " + totalPage;
				         $('#pagination #prev').attr('disabled','disabled');
	                        $('#pagination #next').removeAttr('disabled');
						$('#totalReimbursementPages').text(paginationText);
						
					}
					
					currentResultCount = responseJSON.items.length;
					totalResult = responseJSON.count;
					
					
					var displayCount = (size *(step -1) + 1) + "-" + (step * size) + " of " + totalResult;
					if(currentPageIndex >= totalPage -1 ){
						displayCount = (size *(step -1) + 1) + "-" + totalResult + " of " + totalResult;
					}
					var displayClaimCountText = displayCount;
					$('#totalNumberClaims').text(displayClaimCountText);
					
					var dateRangeText  = "From " + getFormatedDateFromString(startDate) + " to " + getFormatedDateFromString(endDate);
					$('#claimDateRange').text(dateRangeText);
					
					_bindReimbursementClaimsTemplate(responseJSON.items);
					$('#sortByFilterList').show();
					$('#reimbursementClaims').show();
					$('#noClaimsOnFile').hide();
					$('#noClaimsByCriteria').hide();
				}else{
					$('#sortByFilterList').hide();
					var displayClaimCountText = " 0 of 0";
                    var dateRangeNoResultText  = "From " + getFormatedDateFromString(startDate) + " to " + getFormatedDateFromString(endDate);
                    $('#claimDateRange').text(dateRangeNoResultText);
                    $('#totalNumberClaims').text(displayClaimCountText);
                    
                	if(filterData.isApplied == true){
						$('#noClaimsByCriteria').show();
						$('#noClaimsOnFile').hide();
					}
					else {
							$('#noClaimsOnFile').show();
							$('#noClaimsByCriteria').hide();
					}
				}
			}).fail(function(response) {
				$('#sortByFilterList').hide();
				
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
            _getReimbursementClaimDetails();

		}).fail(function(response) {
			console.log('fail ', response);
		});

	};
	
	var _bindReimbursementClaimsTemplate = function(reimbursementClaimsData){
		$('#reimbursementClaims').empty();	
		for(var i=0; i<reimbursementClaimsData.length; i++){
				var reimbursementClaim = reimbursementClaimsData[i];
				 var parser = new DOMParser();
                 var temp = $("#view-reimbursement-tile-template").html();
                 var tpl = parser.parseFromString(temp, "text/html");
                 
                 if(reimbursementClaim){
                	 $(tpl).find("p#currencyreimbursed").text(_getCurrencyNameFromArray(reimbursementClaim.paymentCurrencyCode)); 
					 //get decimal points
					 var decimalPt = _getDecimalPointsFromArray(reimbursementClaim.paymentCurrencyCode);
					 //full currency name
                	 $(tpl).find(" #amountreimbursed").text(reimbursementClaim.paymentCurrencyCode + " " + (reimbursementClaim.paidAmount).toFixed(decimalPt));  //Amount billed 
					 var decimalUSDPt = _getDecimalPointsFromArray("USD");
                     if(reimbursementClaim.paidAmountUSD >= 0){
                     $(tpl).find(" #dollarreimbursed").text("USD " + (reimbursementClaim.paidAmountUSD).toFixed(decimalUSDPt));   //Amount Billed in usd
                     }else{
						$(tpl).find(" #dollarreimbursed").css("display","none");
                     }
                     if(reimbursementClaim.paymentCurrencyCode.toLowerCase() == 'usd'){
                    	 $(tpl).find(" #dollarreimbursed").css("display","none");
                     }
                  }
                 
                 if(reimbursementClaim.fundingAccountNumber){
                	 $(tpl).find("#paymentAccount").text(reimbursementClaim.fundingAccountNumber);
                 }
                 
                 if(reimbursementClaim.transmissionType){
                     $(tpl).find(" .payment-type-details #paytype").text(reimbursementClaim.transmissionType);   //Date of Service
                }else{
    				$(tpl).find('#paytypeRow').css("display","none");
                }
                     
                     if(reimbursementClaim.bankReferenceNumber){

                    	$(tpl).find('#payment-number').text(reimbursementClaim.bankReferenceNumber.trim());         // PAYMENT NUMBER

                     $(tpl).find('#payment-number-button').click(function(event){
                    	 event.preventDefault();
						 var currentDate = new Date();
						 var fromDateStaamp = new Date();
						// paymentDetailRequestData.toDate = currentDate.toISOString().split("T")[0];
						 var cardContainer = $(this).parent().parent();
						 
						 var paymentDetails = {};
						 
						 paymentDetails.amountPaid = cardContainer.find('#amountreimbursed').text();
						 paymentDetails.currencyName = cardContainer.find('#currencyreimbursed').text();
						 paymentDetails.amountPaidUSD = cardContainer.find('#dollarreimbursed').text();
						 paymentDetails.paymentDate = cardContainer.find('#paydate').text();
						 paymentDetails.paymentType = cardContainer.find('#paytype').text();
						 paymentDetails.paymentNumber = cardContainer.find('#paytype').text();
						 paymentDetails.paymentAccount = cardContainer.find('#paymentAccount').text();
						  /* 
						  *Code to Reduce 18 months
						  *
						  fromDateStaamp.setMonth(fromDateStaamp.getMonth()-18);
						   paymentDetailRequestData.fromDate = fromDateStaamp.toISOString().split("T")[0];*/

						   //Remove below Line for 18 months requirement
						 //paymentDetailRequestData.fromDate = formatInvalidDate(fromDateStaamp.toISOString().split("T")[0]);
						
				    	 paymentDetailRequestData.paymentNumber = $(this).text();
                         paymentDetailRequestData.pageIndex = 0;
                    	 //relatedClaims.getRelatedClaimsDetails(paymentDetailRequestData);
                    	// paymentDetails.getPaymentDetails(paymentDetailRequestData);

                     });
                    }else{
						 $(tpl).find('#payment-number-row').css("display","none");
                    }
                
                 if(getFormatedDate(reimbursementClaim.issueDate)){
                     $(tpl).find('#paydate').text(getFormatedDate(reimbursementClaim.issueDate));   //Payment date
                }else{
    				$(tpl).find('#paydateRow').css("display","none");
                }                    
                
                 var claimId = "";
                 var claimIdLength = reimbursementClaim.claimAmountTransactions.length;
                 
                 for(var k=0; k<claimIdLength; k++){
                	 if(k < claimIdLength -1 ){
                		 claimId += reimbursementClaim.claimAmountTransactions[k].claimId + ',';
                	 }
                	 else
                		 {
                		 claimId += reimbursementClaim.claimAmountTransactions[k].claimId;
                		 }
                 }
            if(claimIdLength > 0){
                 $(tpl).find(".claim-id-details #claimIdList").text(claimId);    //claim id
            }else{
				 $(tpl).find('#claimIdListRow').css("display","none");
            }

            if(getFormatedDate(reimbursementClaim.claimAmountTransactions[0].claim.fromDateOfService)){
                 $(tpl).find(".date-of-service-details #dateService").text(getFormatedDate(reimbursementClaim.claimAmountTransactions[0].claim.fromDateOfService));   //Date of Service
            }else{
				$(tpl).find('#dateServiceRow').css("display","none");
            }
            
            if(claimIdLength > 1){
            	$(tpl).find('#dateServiceRow').css("display","none");
            }
            
            
                 if(totalPage > 1){
                	 $('#pagination').show();
                 }
                 else
                	 {
                	 $('#pagination').hide();
                	 }

                 $('#reimbursementClaims').append($(tpl).find('.view-reimbursement-cards-container'));
		}
	};
    return{
         
    	  getSortByList : _getSortByList,
		 fetchCurrencyDataFromService : _fetchCurrencyDataFromService,
		 getReimbursementClaimDetails : _getReimbursementClaimDetails,
		 getCurrencyNameFromArray : _getCurrencyNameFromArray,
         getDecimalPointsFromArray:  _getDecimalPointsFromArray
         
	};
})();

$(document).ready(function(){
	viewReimbursment.getSortByList();
	//viewReimbursment.getReimbursementClaimDetails();
	viewReimbursment.fetchCurrencyDataFromService();
	
	$('#pagination #prev').on('click', function(e){
		//var requestData = {};
         $('#pagination #next').removeAttr('disabled');
		currentPageIndex--;
        var backPageIndex = currentPageIndex +1;
		var paginationText = backPageIndex + " of " + totalPage;
		$('#totalReimbursementPages').text(paginationText);
		if(currentPageIndex >= 0){
			viewReimbursment.getReimbursementClaimDetails(filterData);
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
			$('#totalReimbursementPages').text(paginationText);
		//}

		
		if(currentPageIndex <= totalPage - 1){
			//var filterData = {};
			//filterData.sort = $('#filterSortByClaims').children('option:selected').data('sort')
			viewReimbursment.getReimbursementClaimDetails(filterData);
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