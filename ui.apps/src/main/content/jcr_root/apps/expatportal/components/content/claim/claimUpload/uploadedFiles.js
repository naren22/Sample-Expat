"use strict";
use(function(){

 var upFiles= sling.getService(Packages.com.expatportal.core.service.UploadFiles);

 var filesString= upFiles(request,"ABC123");

 var filesJson =JSON.parse(filesString);

    return filesJson;

});
