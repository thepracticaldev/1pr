
((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};

function toggleSidebar(){
	sidebar     = document.getElementById("sidebar");
	if (sidebar.style.display == 'none') {
		sidebar.style.display = 'block';
	} else if (sidebar.style.display == 'block') {
		sidebar.style.display = 'none';	
	}
	else {
		sidebar.style.display = 'block';
	}
}

var mainContent = document.querySelector('#main-content');
mainContent.onresize = function(){
	
	if ( mainContent.getComputedStyle(element).width > 720 && sidebar.style.display == 'none') {
		sidebar.style.display = 'block';
	}
		
};
