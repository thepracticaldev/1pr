// Wrap everything inside a scoped function
(function loadContributors() {

	// Helper function; shorthand for document.getElementById (because that gets pretty annoying if you have to write it a bunch)
	let el = function(id) { return document.getElementById(id); }

	window.api('https://api.github.com/repos/thepracticaldev/1pr/contributors', function(err, contributors){

		// Log and display any errors
		if(err !== null){
			console.error(err);
			el('contributors').className = 'error';
			el('contributors').textContent = 'Could not load contributors';
			return;
		}


		// Append each contributor to the contributors element
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

		el('contributors-container').style.display = 'block';

	});

})();
