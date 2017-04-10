'use strict';

(function loadRepoIssues() {

	let done = window.registerAsyncScript('stats/issues');
	window.api('https://api.github.com/search/issues?q=type:issue%20state:open%20repo:thepracticaldev/1pr', function(err, issues) {
		done();

		document.getElementById('issues').getElementsByClassName('data')[0].textContent = issues.total_count;

	});

})();


(function loadRepoStats() {

	let done = window.registerAsyncScript('stats');
	window.api('https://api.github.com/repos/thepracticaldev/1pr', function(err, stats) {
		done();

		document.getElementById('forks').getElementsByClassName('data')[0].textContent = stats.forks_count;
		document.getElementById('stars').getElementsByClassName('data')[0].textContent = stats.stargazers_count;

	});

})();
