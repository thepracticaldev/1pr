/* exported utils */
"use strict";

//Useful side-wide utilities
var utils = {
	showElement: function (element){
		//Removes first instance of hidden in className
		// so element can be hidden multiple times and still
		// stay hidden when shown fewer times.
		var hiddenClassName = /\b(hidden)\b/;
		element.className = element.className.replace(hiddenClassName, "");
	},

	hideElement: function(element){
		//Extend the className rather than use classList so that
		//element can be hidden multiple times
		element.className = element.className + " hidden";
	},

	showManyElements: function(arrayOfElements){
		arrayOfElements.forEach(el => this.showElement(el));
	},

	hideManyElements: function(arrayOfElements){
		arrayOfElements.forEach(el => this.hideElement(el));
	}
};
