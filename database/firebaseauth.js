// Wrap everything inside a scoped function
(function firebaseAuth() {

	var signInButton = document.getElementById("button-sign-in");
	var signOutButton = document.getElementById("button-sign-out");
	var adminButton = document.getElementById("button-admin");
	var userSpan = document.getElementById("span-firebase-user");

	var signedInControls = document.querySelectorAll(".signed-in");
	var signedOutControls = document.querySelectorAll(".signed-out");
	var signedInAdminControls = document.querySelectorAll(".signed-in-admin");

	//Set up response to log in and log out
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			firebase.database().ref("admins/" + user.uid).once('value').then(function(adminSnapshot){
				var admins = adminSnapshot.val();
				if (admins !== null){
					showManyElements(signedInAdminControls);
				}
			});
			var displayName = user.displayName;
			userSpan.innerHTML = "Logged in as " + displayName;
			showManyElements(signedInControls);
			hideManyElements(signedOutControls);
		} else {
			userSpan.innerHTML = "";
			showManyElements(signedOutControls);
			hideManyElements(signedInControls);
			hideManyElements(signedInAdminControls);
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
