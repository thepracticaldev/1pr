
((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};


function toggleSidebar(){

  sidebar     = document.getElementById("sidebar"),
  mainContent = document.getElementById("main-content");

	if (sidebar.style.display == 'none') {
		sidebar.style.display = 'block';
		mainContent.style.marginLeft = "200px";
	} else {
		sidebar.style.removeProperty('display');
		mainContent.style.marginLeft = "0px";
	}
	
}
