// Wrap everything inside a scoped function
(function loadVoting() {

	// Helper function; shorthand for document.getElementById (because that gets pretty annoying if you have to write it a bunch)
	let el = function(id) { return document.getElementById(id); }

	window.api('https://api.github.com/repos/thepracticaldev/1pr/pulls', function(err, pullRequests){

		// Log and display any errors
		if(err !== null){
			console.error(err);
			el('pull-requests').className = 'error';
			el('pull-requests').textContent = 'Could not load pull requests';
			return;
		}

		// Append each pull request to the pull requests element
		for(let i = 0; i < pullRequests.length; i++){

		/*

<p>
    <strong><a href="{{html_url}}">{{title}}</a></strong>
    <br />
    <small>submitted by: {{user.login}}</small>
    <br />
    <span class="g-plusone" data-href="{{html_url}}"></span>
</p>

		*/
            let pullRequest = document.createElement('p');
            let pullRequestHeading = document.createElement('strong');
            let pullRequestLink = document.createElement('a');
            pullRequestLink.href = pullRequests[i].html_url;
            pullRequestLink.textContent = pullRequests[i].title;

            pullRequestHeading.appendChild(pullRequestLink);
            pullRequest.appendChild(pullRequestHeading);

            let pullRequestLineBreak1 = document.createElement('br');
            pullRequest.appendChild(pullRequestLineBreak1);

            let pullRequestSubmittedBy = document.createElement('small');
            pullRequestSubmittedBy.textContent = 'submitted by: ' + pullRequests[i].user.login;
            pullRequest.appendChild(pullRequestSubmittedBy);

            let pullRequestLineBreak2 = document.createElement('br');
            pullRequest.appendChild(pullRequestLineBreak2);

            let pullRequestGooglePlus = document.createElement('span');
            pullRequestGooglePlus.className = 'g-plusone';
            pullRequestGooglePlus.setAttribute('data-href', pullRequests[i].html_url);
            pullRequest.appendChild(pullRequestGooglePlus);

			el('pull-requests-container').appendChild(pullRequest);

            gapi.plusone.go();
		}

	});

})();
