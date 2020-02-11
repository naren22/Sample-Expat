"use strict";
use(function () {
    var sectionOneMultiField; 
     var sectionTwoMultiField; 
     var copyRightSectionMultiField;
	sectionOneMultiField=resource.getChild("groupOneLinks");
	sectionTwoMultiField=resource.getChild("groupTwoLinks");
    copyRightSectionMultiField=resource.getChild("copyRightGroupLinks");
    return {
        listOne : sectionOneMultiField,
        listTwo : sectionTwoMultiField,
        listThree : copyRightSectionMultiField
    };

});