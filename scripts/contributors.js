// Wrap everything inside a scoped function
(function loadContributors() {

	// Helper function; shorthand for document.getElementById (because that gets pretty annoying if you have to write it a bunch)
	function el(id){ return document.getElementById(id); }

	// Create HTTP request
	let request = new XMLHttpRequest();

	// Attach a handler for when the request is completed
	request.onreadystatechange = function onStateChange() {

		/* Instead of checking if the request is ready and putting everything below inside the if
		   I simply return out of the handler whenever the request isn't ready yet.
		   This makes for cleaner code and less nesting imo. */
		if(request.readyState !== 4 || request.status !== 200){
			return;
		}


		// Attempt to parse the JSON response data (in a try/catch in case the JSON is malformed)
		try {
			contributors = JSON.parse(request.responseText);

		} catch (err) {
			console.error(err);
			el('contributors').className = 'error';
			el('contributors').textContent = 'Could not load contributors';

		}


		// Append each contributor to the footer
		for(let i = 0; i < contributors.length; i++){

			// Link to contributor's profile
			let contributor = document.createElement('a');
			contributor.href = contributors[i].html_url; // URL of profile page
			contributor.title = contributors[i].login; // Username
			contributor.target = '_blank';

			// Contributor's avatar
			let avatar = document.createElement('img');
			avatar.src = contributors[i].avatar_url;

			// Append to contributors element
			contributor.appendChild(avatar);
			el('contributors').appendChild(contributor);

		}
	}

	// Send the request
	request.open('GET', 'https://api.github.com/repos/thepracticaldev/1pr/contributors', true);
	request.send(null);

	// If you hit the API rate limit, add the following before sending the request (add in your own username and api token)
	// request.setRequestHeader('Authorization', 'Basic ' + btoa('username:personal api token'));

})();
