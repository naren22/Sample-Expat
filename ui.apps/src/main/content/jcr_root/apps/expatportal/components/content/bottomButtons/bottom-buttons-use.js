"use strict";
use(function () {
    var cardOneMultiField; 
     var cardTwoMultiField; 
     var cardThreeMultiField;
	cardOneMultiField=resource.getChild("cardOnebuttons");
	cardTwoMultiField=resource.getChild("cardTwobuttons");
    cardThreeMultiField=resource.getChild("cardThreebuttons");
    return {
        listOne : cardOneMultiField,
        listTwo : cardTwoMultiField,
        listThree : cardThreeMultiField
    };

});