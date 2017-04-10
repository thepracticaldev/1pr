'use strict';


((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};

(function() {

	// Toggles the sidebar display on mobile
	let toggleSidebar = function() {

		// Get sidebar element
		let sidebar = document.getElementById("sidebar");


		if (sidebar.style.display === 'none') {
			sidebar.style.display = 'block';

		} else if(sidebar.style.display === 'block') {
			sidebar.style.display = 'none';

		} else {
			sidebar.style.display = 'block';

		}
	};

	// Attach event listener to menu button
	document.getElementById('menu-button').addEventListener('click', toggleSidebar, false);
})();
