
    function openUploadFileExplorer() {
        document.getElementById("upload-file-btn").click();
    }

    // ************************ Drag and drop ***************** //
    var dropArea = document.getElementById("drop-area");

    // Prevent default drag behaviors
    if(dropArea){
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it

    ['dragenter', 'dragover'].forEach(function(eventName) {
        dropArea.addEventListener(eventName, highlight, false);
    });


    ['dragleave', 'drop'].forEach(function(eventName) {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('active');
    }

    function handleDrop(e) {
        // console.log("e",e);
        var dt = e.dataTransfer;
        var files = dt.files;

        handleFiles(files);
    }

    var tempFiles = [];
    var initFileLength = 0;
    var currentFileSize = 0;

    var checkbox = document.getElementById('attestation-mark');
    if(checkbox){
    checkbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            document.getElementById("submit-claim-attestation-msg").style.display = 'none';
            if(tempFiles.length > 0){
                document.getElementById("review-claim-btn").style.backgroundColor = '#0D880B';///$primary2-color
            }
        } else {
            document.getElementById("review-claim-btn").style.backgroundColor = '#5a6268';
        }
    });
    }
    function reviewBtnValidation(){
    	document.getElementById('submit-claim-filename-duplicate-msg').style.display ='none';
        document.getElementById('submit-claim-file-size-msg').style.display ='none';
        document.getElementById('submit-claim-invalid-file-type-msg').style.display ='none';
        document.getElementById('submit-claim-file-size-zero-msg').style.display = 'none';
        document.getElementById('submit-claim-file-name-period-msg').style.display = 'none';
        
		var valid = false;
        if(!document.getElementById("attestation-mark").checked){
            document.getElementById("submit-claim-attestation-msg").style.display = 'block';
            valid = false;
             // return valid;
        }else{
            document.getElementById("submit-claim-attestation-msg").style.display = 'none';
            valid = true;
        }

        if(tempFiles.length == 0){
            document.getElementById("submit-claim-file-required-msg").style.display = 'block';
            valid = false;
        }else{
            document.getElementById("submit-claim-file-required-msg").style.display = 'none';
            valid = valid && true;
        }

        var errorArr = [];
        $.each($('.text-danger:visible'), function(){
            errorArr.push({"errorname" : this.innerHTML});
        });
        tagFormErrorStep1(errorArr,'trackFormErrorLoad');
        
        return valid;


    }

    function handleFiles(files) {
    	//document.getElementById('submit-claim-filename-duplicate-msg').style.display = 'none';
        document.getElementById('submit-claim-filename-duplicate-msg').style.display ='none';
        document.getElementById('submit-claim-file-size-msg').style.display ='none';
        document.getElementById('submit-claim-invalid-file-type-msg').style.display ='none';
        document.getElementById('submit-claim-file-size-zero-msg').style.display = 'none';
        document.getElementById('submit-claim-file-name-period-msg').style.display = 'none';
        // console.log("files", files.length);
        rawFiles = [];
        Array.prototype.push.apply(rawFiles, files);
        // console.log(rawFiles);
        var myNode = document.getElementById('files');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        
        filesValidations(rawFiles);
        // tempFiles.forEach(uploadFile);
      /*  rawFiles.every(function(file){
            var sameNameCtr = 0;
            rawFiles.forEach(function(testFile){ ///checker for incoming files
                if(file.name === testFile.name && file.type === testFile.type){
                    sameNameCtr++;
                }
            });
            tempFiles.forEach(function(testFile){ ///checker for current files
                if(file.name === testFile.name){
                    sameNameCtr++;
                }
            });
            if(sameNameCtr <= 1){
                // console.log("currentFileSize", currentFileSize);
                if((currentFileSize + Math.round((file.size / 1048576) * 100) / 100)  <= 5.00){  //// file size checker
                    currentFileSize = currentFileSize + Math.round((file.size / 1048576) * 100) / 100;
                    // console.log("new currentFileSize", currentFileSize);

                    var FileName = file.name;//// file type checker
                    var FileExt = FileName.substr(FileName.lastIndexOf('.') + 1);

                    if ((FileExt.toUpperCase() === "PDF") || (FileExt.toUpperCase() === "JPG") || (FileExt.toUpperCase() === "JPEG") || 
                    (FileExt.toUpperCase() === "PNG") || (FileExt.toUpperCase() === "TIF") /* || (FileExt.toUpperCase() === "TXT")*) {

                        tempFiles.push(file);
                        return true; 
                    }else{
                        document.getElementById('submit-claim-invalid-file-type-msg').style.display ='block';
                        return false; /// stop file name check and display error  
                    }
                }else{
                    document.getElementById('submit-claim-file-size-msg').style.display ='block';
                    return false; /// stop file name check and display error  
                }
            }else{
                document.getElementById('submit-claim-filename-duplicate-msg').style.display ='block';
                return false; /// stop file name check and display error
            }
        });
        // console.log("tempFiles",tempFiles);
        if(tempFiles.length > 0){
            document.getElementById("submit-claim-file-required-msg").style.display = 'none';
            if(document.getElementById("attestation-mark").checked){
                document.getElementById("review-claim-btn").style.backgroundColor = '#0D880B';///$primary2-color
            }else{
                document.getElementById("review-claim-btn").style.backgroundColor = '#5a6268';
            }
        }*/
        tempFiles.forEach(previewFileName);
        tempFiles.forEach(previewFileImage);
        //document.getElementById("fileElem").value = '';
    }

    function deleteFile(event, fileName) {
        preventDefaults(event);
       // alert("Deleting : "+fileName);
        removeFiile(fileName);
        document.getElementById('submit-claim-filename-duplicate-msg').style.display ='none';
        document.getElementById('submit-claim-file-size-msg').style.display ='none';
        document.getElementById('submit-claim-invalid-file-type-msg').style.display ='none';
       // document.getElementById('submit-claim-invalid-file-type-msg').style.display = 'none';
        // console.log("delete trigger",fileName);
        var fileList = tempFiles; //document.getElementById("fileElem").files;
        // console.log("fileList", fileList);
        fileList = fileList.filter( function(s){ 
            // console.log("fileList", s.name);
            if(s.name !== fileName){
                return s;
            }else{
                currentFileSize = currentFileSize - Math.round((s.size / 1048576) * 100) / 100;
                // console.log("delted currentFileSize", currentFileSize);
            }
        });
        tempFiles = fileList;
        // console.log("file lenght check", tempFiles.length);
        if(tempFiles.length > 0){
            var myNode = document.getElementById('files');;
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            // console.log(tempFiles);
            // tempFiles.forEach(uploadFile);
            tempFiles.forEach(previewFileName);
            tempFiles.forEach(previewFileImage);
        }else{
            currentFileSize = 0;
            var myNode = document.getElementById('files');;
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            document.getElementById("fileElem").value = "";
            document.getElementById('txtUpload').style.display = "block";
            document.getElementById("review-claim-btn").style.backgroundColor = '#5a6268';
        }

        var dropArea = document.getElementById('drop-area');
        dropArea.scrollTop = 0;

    }
    function previewFileImage(file) {
    //    console.log("file type", file.type);
       var pdfImg = "data:image/png;base64,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";

       var reader = new FileReader();
        reader.readAsDataURL(file);
        var promise = new Promise( function(resolve, reject) {
            reader.onloadend = function (e) {
                resolve(e.target.result);
            }
            reader.onerror = function () {
                var reason = new Error("No image found");
                reject(reason);
            }  
        });

        promise.then(function(data) {
            if(file.type === "application/pdf"){
                document.getElementById(file.name).src = pdfImg;
                tempFiles.forEach(function(tempFile, index){
                    if(tempFile.name === file.name && tempFile.type === file.type){
                        // console.log(tempFiles[index].name,tempFile.name, "match", file.name, data);
                        tempFiles[index].data = data;
                        tempFiles[index].src = pdfImg;
                    }
                });
            }else{
                document.getElementById(file.name).src = data;
                tempFiles.forEach(function(tempFile, index){
                    if(tempFile.name === file.name && tempFile.type === file.type){
                        // console.log(tempFiles[index].name,tempFile.name, "match", file.name, data);
                        tempFiles[index].data = data;
                        tempFiles[index].src = data;
                    }
                });
            }
        }, function(error) {
            console.log(error.message);
        });

        // console.log("Final", tempFiles);
    }
    function previewFileName(file) {
        // console.log("file length",tempFiles.length);
        document.getElementById('txtUpload').style.display = "none";

        var div = document.createElement('div');
        div.className = 'card card-container m-1';
        var displayTitle = "";
        var fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        var img ="";
        // console.log("file.name.lastIndexOf('.')",file.name.slice(0,file.name.lastIndexOf('.')));
        var fileName = file.name.slice(0,file.name.lastIndexOf('.'));
        if(fileName.length > 40){
            displayTitle = fileName.match(new RegExp('.{1,' + 40 + '}', 'g'))[0] + "..." + " ." + 
            fileExt;
        }else{
            displayTitle = file.name;
        }
        var title = "<div><p class='card-text m-0 filename px-1' title='"+file.name+"'>" + "" + displayTitle + "</p><p class='card-text filesize px-1'> " + Math.round(
        (file.size / 1048576) * 100) / 100 + " MB</p></div>";

        if(file.type === "application/pdf"){
            img = "<span class='thumbail-close'><i onclick='deleteFile(event,\""+file.name+"\")' class='fa fa-times'></i></span><div class='text-center'><img class='card-img-top thumbnail-pdf' id='"+ file.name +"'/></div>";
        }else{
            img = "<span class='thumbail-close'><i onclick='deleteFile(event,\""+file.name+"\")' class='fa fa-times'></i></span><div class=''><img class='card-img-top thumbnail-img' id='"+ file.name +"' src='../assets/toolkit/images/loader.svg'/></div>";
        }

        div.innerHTML = img + title;
        document.getElementById('files').appendChild(div);


    }
    
    function setStep2DataInSessionStorage(path){
    	var step2_data=[];
    	tempFiles.forEach(function(file){
    		var file_data={};
    		file_data.name = file.name;
    		file_data.type = file.type;
    		file_data.size = file.size;
            file_data.src = path+file.name; //file.src;
    		step2_data.push(file_data);
        });
        console.log(step2_data);
        console.log(JSON.stringify(step2_data).length);
    	sessionStorage.setItem('step2_data', JSON.stringify(step2_data));
    }
    
    function checkDuplicateFile(rawFiles, file, validFile) {
        var sameNameCtr = 0;
        rawFiles.forEach(function (testFile) { ///checker for incoming files
            if (file.name === testFile.name && file.type === testFile.type) {
                sameNameCtr++;
            }
        });
        tempFiles.forEach(function (testFile) { ///checker for current files
            if (file.name === testFile.name && file.type === testFile.type) {
                sameNameCtr++;
            }
        });
        if (sameNameCtr > 1) {
            document.getElementById('submit-claim-filename-duplicate-msg').style.display = 'block';
            return false;
        } else {
            return validFile;
        }
    }

    function checkFileType(file, validFile) {
        var FileName = file.name; //// file type checker
        var FileExt = FileName.substr(FileName.lastIndexOf('.') + 1);
        if ((FileExt.toUpperCase() === "PDF") || (FileExt.toUpperCase() === "JPG") || (FileExt
                .toUpperCase() === "JPEG") || (FileExt.toUpperCase() === "PNG") || (FileExt
                .toUpperCase() === "TIF")|| (FileExt.toUpperCase() === "TIFF")) {
            return validFile;
        } else {
            document.getElementById('submit-claim-invalid-file-type-msg').style.display = 'block';
            return false;
        }
    }

    function checkFileName(file, validFile) {
        var FileName = file.name; //// file type checker

        if (FileName.split(".").length > 2) { /// check filename symbols
            document.getElementById('submit-claim-file-name-period-msg').style.display = 'block';
            return false;
        } else if (!/[\\/:*?"<>|]/.test(FileName)) { /// check filename symbols
            return validFile;
        } else {
            document.getElementById('submit-claim-filename-character-msg').style.display =
                'block';
            return false; /// invalid character in filename error massage
        }
    }

    function checkCurrentFileSize(file, validFile) {


       if(file.size <= 0) {
            document.getElementById('submit-claim-file-size-zero-msg').style.display = 'block';
            return false;
        } else if ((currentFileSize + Math.round((file.size / 1048576) * 100) / 100) <=
            20.00) {
            if (validFile) {
                currentFileSize = currentFileSize + Math.round((file.size / 1048576) * 100) / 100;
            }

            return validFile;
        } else {
            document.getElementById('submit-claim-file-size-msg').style.display = 'block';
            return false;
        }
    }

    function filesValidations(rawFile) {
        rawFiles.every(function (file) {
            var validFile = true;
            validFile = checkDuplicateFile(rawFiles, file, validFile);
            validFile = checkFileType(file, validFile);
            validFile = checkFileName(file, validFile);
            validFile = checkCurrentFileSize(file, validFile); /// file size must be alway the last to validate the file
            if (validFile) {
                tempFiles.push(file);
            }
            return true; /// return true to continue validation in every files
        });
        if (tempFiles.length > 0) {
            document.getElementById("submit-claim-file-required-msg").style.display = 'none';
            if (document.getElementById("attestation-mark").checked) {
                document.getElementById("review-claim-btn").style.backgroundColor = '#0D880B'; ///$primary2-color
            } else {
                document.getElementById("review-claim-btn").style.backgroundColor = '#5a6268';
            }
        }
    }

    $(document).ready(function(){
    	var element = document.getElementById('fileElem');

        $("#submit-claim-file-name-period-msg, #submit-claim-file-size-zero-msg").hide();
    	element.addEventListener('change',function(){
    		handleFiles(element.files);
    		console.log('change js');
    	});
    });


