
((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};

function toggleSidebar(){
	sidebar = document.getElementById("sidebar");
	if (sidebar.className == 'closed') {
		sidebar.className = 'open';

	} else if (sidebar.className == 'open') {
		sidebar.className = 'closed';

	} else {
		sidebar.className = 'open';
	}
}

function showElement(element){
	//Removes first instance of hidden in className
	// so element can be hidden multiple times and still
	// stay hidden when shown fewer times.
	hiddenClassName = /\b(hidden)\b/
	element.className = element.className.replace(hiddenClassName, "");
}

function hideElement(element){
	//Extend the className rather than use classList so that
	//element can be hidden multiple times
	element.className = element.className + " hidden";
}

function showManyElements(arrayOfElements){
	arrayOfElements.forEach(el => showElement(el));
}

function hideManyElements(arrayOfElements){
	arrayOfElements.forEach(el => hideElement(el));
}
