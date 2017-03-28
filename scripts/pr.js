// Wrap everything inside a scoped function
(function loadLastPr() {

	// Helper function; shorthand for document.getElementById (because that gets pretty annoying if you have to write it a bunch)
	let el = function(id) { return document.getElementById(id); }

	// Helper function to calculate difference between date and return the date in appropiate format.
	let getTime = function(merge_date) {

		let diff = new Date() - new Date(merge_date);

		let seconds = Math.round(diff/1000);
		if (seconds < 60)
			return seconds + " seconds ago";

		let minutes = Math.round(seconds/60);
		if (minutes < 60)
			return minutes + " minutes ago";

		let hours = Math.round(minutes/60);
		if (hours < 24)
			return hours + " hours ago";

		let days = Math.round(hours/24);
		return days + " days ago";
	}

	// Helper function to limit the maximum number of characters of a string but not break up words
	let maxLength = function(str, maxLength) {

		// Don't do anything if the string is shorter
		if(str.length < maxLength){
			return str;
		}

		let words = str.split(' ');
		let totalLength = 0;

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

	}


	// Load last merged PR
	window.api('https://api.github.com/repos/thepracticaldev/1pr/pulls?state=closed', function(err, pr_list) {

		if(err) {
			console.error(err);
			el('pr-container').textContent = 'Could not load latest PR';
			el('pr-container').className = 'error';
			return;
		}

		for(let i = 0; i < pr_list.length; i++) {

			if(pr_list[i].merged_at != null) {
				let pr = pr_list[i];

				el('pr-last').innerHTML = '<a href="' + pr.html_url + '">' + maxLength(pr.title, 50) + '</a> by <a href="' + pr.user.html_url + '">' + pr.user.login + '</a> merged ' + getTime(pr.merged_at);
				break;
			}

		}

		el('pr-container').style.display = 'block';
	});

})();
