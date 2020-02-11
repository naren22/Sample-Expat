$("#review-claim-btn").on("click", function(event){
       formErrors = [];
       var targetHtml = $(event.target).html();
    if(targetHtml.indexOf('span') != -1){
                    targetHtml = $(event.target).children().html();
    }
       tagPublishPostPageData(targetHtml,'trackNewClaimSubmitLinkClick');
       event.preventDefault();
    if(reviewBtnValidation()){
       document.getElementById("system-error-note-loader").style.display = 'block';
       window.setTimeout(
                function () {
                   // document.getElementById("system-error-note-loader").style.display = 'none';
                    var fd=prepareFormData();
                submit($("#form").attr("action"),fd);
                   // manageStep.handleClaimStep(3);
                }, 2000);
    }else{
    }
});

function submit(URL,formData){

    $.ajax({
        type: "POST",
        url: URL,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {

            }
            return myXhr;
        },
        success: function (data) {
            // your callback here

            var result =JSON.parse(data.result);

            var infcted=result.infectedFiles;
                    document.getElementById("system-error-note-loader").style.display = 'none';
            if(infcted){
                           $("#virus-files").text(infcted);
                           $("#potential-virus").show();
                           tagUploadError('Potential virus detected on your file(s); unable to upload. Please correct and try again.','trackFileUploadVirusErrorLoad');
            }else{

               // alert("Files upload status : "+ result.msg);
            	setStep2DataInSessionStorage(result.path);

                // window.pageDataLayer.content.pageName = "Review and Submit Claim";
                 manageStep.handleClaimStep(3);
            }
        },
        error: function (error) {
            // handle error

        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,      
        processData: false,
        timeout: 60000
        });
}

function prepareFormData(){
         var formData = new FormData();
      //var f=$("#fileElem")[0]
      var files = tempFiles;

      for (var i = 0; i < files.length; i++) {
          var file = files[i];
        
          // Check the file type.
          /*if (!file.type.match('image.*')) {
            continue;
          }*/
       
          // Add the file to the request.
          formData.append('file', file, file.name);
      }
   //var memberId = 796; 
  var memberId = getMbrId();
    formData.append("mbrId",memberId);
      return formData;
}


$(document).ready(function(){
       $("#potential-virus").hide();
       $(window).on('beforeunload', function(){
        console.log("beforeUnload event!");
        removeAllFiles();
    });
});

function closeVirusErrorNote(){
       /* var listOfFilesText = document.getElementById("virus-files");
        document.getElementById("potetial-virus-loader").style.display = 'none';
        document.getElementById("potential-virus").style.display = 'none';
        listOfFilesText.removeChild(listOfFilesText.children[0]); // remove the currenct infeted file in modal
        filesWithVirus = []; // remove the currenct infeted file on the list
        */
     $("#potential-virus").hide();
    }
