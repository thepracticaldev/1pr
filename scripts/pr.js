'use strict';

(function loadLastPr() {

	// Helper function to calculate difference between date and return the date in appropiate format.
	let getTime = function(merge_date) {

		let diff = new Date() - new Date(merge_date);

		let seconds = Math.round(diff/1000);
		if (seconds < 60) {
			return seconds + ' seconds ago';
		}

		let minutes = Math.round(seconds/60);
		if (minutes < 60) {
			return minutes + ' minutes ago';
		}

		let hours = Math.round(minutes/60);
		if (hours < 24) {
			return hours + ' hours ago';
		}

		let days = Math.round(hours/24);
		return days + ' days ago';
	};

	// Helper function to limit the maximum number of characters of a string but not break up words
	let maxLength = function(str, maxLength) {

		// Don't do anything if the string is shorter
		if(str.length < maxLength){
			return str;
		}

		let words = str.split(' ');
		str = '';

		for(let i = 0; i < words.length; i++){

			str += words[i];

			if(str.length >= maxLength){
				str += '...';
				break;
			}

			str += ' ';
		}

		return str;

	};


	// Load last merged PR
	let done = window.registerAsyncScript('pr');
	window.api('https://api.github.com/repos/thepracticaldev/1pr/pulls?state=closed&sort=updated&direction=desc', function(err, pr_list) {
		done();

		if(err) {
			if(window.console){ window.console.error(err); }
			document.getElementById('last-pr').textContent = 'Could not load latest PR';
			document.getElementById('last-pr').className = 'error';
			return;
		}

		for(let i = 0; i < pr_list.length; i++) {

			if(pr_list[i].merged_at !== null) {
				let pr = pr_list[i];

				document.getElementById('last-pr').getElementsByClassName('pr-title')[0].innerHTML = '<a href="' + pr.html_url + '">' + maxLength(pr.title, 32) + '</a> <span>by <a href="' + pr.user.html_url + '">' + pr.user.login + '</a></span> <span>merged ' + getTime(pr.merged_at) + '</span>';
				break;
			}

		}

	});

})();
