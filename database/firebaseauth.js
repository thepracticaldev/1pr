// Wrap everything inside a scoped function
(function firebaseAuth() {

	var signedInNav = document.getElementById("nav-signed-in");
	var signInButton = document.getElementById("button-sign-in");
	var signedOutNav = document.getElementById("nav-signed-out");
	var signOutButton = document.getElementById("button-sign-out");
	var adminButton = document.getElementById("button-admin");
	var userSpan = document.getElementById("span-firebase-user");

	//Set up response to log in and log out
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			firebase.database().ref("admins/" + user.uid).once('value').then(function(adminSnapshot){
				var admins = adminSnapshot.val();
				if (admins !== null){
					showElement(adminButton);
				}
			});
			var displayName = user.displayName;
			userSpan.innerHTML = "Logged in as " + displayName;
			showElement(signedInNav);
			hideElement(signedOutNav);
		} else {
			userSpan.innerHTML = "";
			showElement(signedOutNav);
			hideElement(signedInNav);
			hideElement(adminButton);
		}
	});

	signInButton.onclick = function(mouseEvent){
		var provider = new firebase.auth.GithubAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	}

	signOutButton.onclick = function(mouseEvent){
		firebase.auth().signOut();
	}

})();
