// Wrap everything inside a scoped function
(function loadContributors() {

	var incrementButton = document.getElementById("firebaseTestIncrement");
	var outputSpan = document.getElementById("firebaseTestOutput");
	var _count = 0;
	var provider = new firebase.auth.GithubAuthProvider();

	var setCount = function(val){
		_count = val;
		outputSpan.innerHTML =  _count;
	}
	setCount(0);

	var testIncrementRef = firebase.database().ref('testIncrement');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a GitHub Access Token. You can use it to access the GitHub API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		// ...

		testIncrementRef.once('value').then(function(initalSnapshot){

		}).catch(function(error){
			testIncrementRef.set(0);
		});
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
	// ...
	});

	firebase.auth().onAuthStateChanged(function(user) {
		var userSpan = document.getElementById("firebaseUser");
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			userSpan.innerHTML = displayName;
		} else {
			userSpan.innerHTML = "";
		}
	});


	testIncrementRef.on('value', function(snapshot) {
		setCount(snapshot.val());
	});

	var saveCount = function(val){
		return testIncrementRef.set(val);
	}

	incrementButton.onclick = function(ev){
		var newCount = _count + 1;
		setCount(newCount);
		saveCount(newCount);
	};


})();

