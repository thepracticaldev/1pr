
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
