'use strict';


((window.gitter = {}).chat = {}).options = {
  room: 'thepracticaldev/1pr',
  useStyles: false
};


(function() {

	let sidebar = {
		isOpen: false,
		toggle: function() {
			if(sidebar.isOpen){
				sidebar.close();
			}else{
				sidebar.open();
			}
		},
		open: function() {
			sidebar.isOpen = true;
			document.getElementById('sidebar').className = 'open';
			document.getElementById('sidebar-overlay').className = 'open';
			document.getElementById('body-container').className = 'sidebar-open';
		},
		close: function() {
			sidebar.isOpen = false;
			document.getElementById('sidebar').className = '';
			document.getElementById('sidebar-overlay').className = '';
			document.getElementById('body-container').className = '';
		}
	};

	document.getElementById('sidebar-toggle').addEventListener('click', sidebar.toggle, false);
	document.getElementById('sidebar-close').addEventListener('click', sidebar.close, false);
	document.getElementById('sidebar-overlay').addEventListener('click', sidebar.close, false);

})();
