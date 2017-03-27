// Wrap everything inside a scoped function
(function loadLastPr() {

	// Helper function; shorthand for document.getElementById (because that gets pretty annoying if you have to write it a bunch)
	function el(id){ return document.getElementById(id); }

	// helper function to calculate difference between date and return the date in appropiate format.
	function get_time(merge_date)
	{
		let diff = new Date() - new Date(merge_date);
		let seconds = Math.round(diff/1000);
		let minutes = Math.round(seconds/60);
		let hours = Math.round(minutes/60);
		let days = Math.round(hours/24);
		if (seconds < 60)
			return seconds + " seconds ago";
		if (minutes < 60)
			return minutes + " minutes ago";
		if (hours < 24)
			return hours + " hours ago";
		return days + " days ago";

	}

	// Create HTTP request
	let request = new XMLHttpRequest();

	// Attach a handler for when the request is completed
	request.onreadystatechange = function onStateChange() {

		/* Instead of checking if the request is ready and putting everything below inside the if
		   I simply return out of the handler whenever the request isn't ready yet.
		   This makes for cleaner code and less nesting imo. */
		if(request.readyState !== 4){
			return;

		}else if(request.status !== 200){
			console.error(request.responseText);
			return;

		}


		// Attempt to parse the JSON response data (in a try/catch in case the JSON is malformed)
		try {
			pr_list = JSON.parse(request.responseText);

		} catch (err) {
			console.error(err);
			return;

		}

		for (let i=0; i < pr_list.length; i++)
		{
			if (pr_list[i].merged_at != null)
			{
				let lastpr = document.createElement('h4');
				lastpr.innerHTML = "Last <a href='"+pr_list[i].html_url+"'>PR</a> by <a href='"+pr_list[i].user.html_url+"'>" +pr_list[i].user.login+ "</a> merged " + get_time(pr_list[i].merged_at);
				el('lastpr-container').appendChild(lastpr);
				 break;
			}
		}
	}

	// Send the request
	request.open('GET', 'https://api.github.com/repos/thepracticaldev/1pr/pulls?state=closed', true);
	request.send(null);


})();
