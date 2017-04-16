'use strict';

(function() {

	let done = window.registerAsyncScript('pr-counter');
	window.api('https://api.github.com/search/issues?q=type:pr%20state:open%20repo:thepracticaldev/1pr', function(err, openPRs){

		document.getElementById('pr-count').textContent = openPRs.total_count;
		done();

	});

})();
