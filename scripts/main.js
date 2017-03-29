
((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};

(function() {

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

	document.getElementById('menu-button').addEventListener('click', toggleSidebar, false);
})();
