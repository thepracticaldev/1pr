/* globals firebase, utils */
"use strict";

// Wrap everything inside a scoped function
(function firebaseAuth() {

	var signInButton = document.getElementById("button-sign-in");
	var signOutButton = document.getElementById("button-sign-out");
	var userSpan = document.getElementById("firebase-user");

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
					utils.showManyElements(signedInAdminControls);
				}
			});
			var displayName = user.displayName;
			userSpan.innerHTML = "Logged in as " + displayName;
			utils.showManyElements(signedInControls);
			utils.hideManyElements(signedOutControls);
		} else {
			userSpan.innerHTML = "";
			utils.showManyElements(signedOutControls);
			utils.hideManyElements(signedInControls);
			utils.hideManyElements(signedInAdminControls);
		}
	});

	signInButton.onclick = function(){
		var provider = new firebase.auth.GithubAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	};

	signOutButton.onclick = function(){
		firebase.auth().signOut();
	};

})();
