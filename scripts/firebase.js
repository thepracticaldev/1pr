// Wrap everything inside a scoped function
(function firebaseInit() {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBTsOTB3XvmDdU6RcO1DlOOV-govpkDs4E",
		authDomain: "onepr-453d8.firebaseapp.com",
		databaseURL: "https://onepr-453d8.firebaseio.com",
		storageBucket: "onepr-453d8.appspot.com",
		messagingSenderId: "240320654850"
	};
	firebase.initializeApp(config);

	var logInButton = document.getElementById("login-button");
	var logOutButton = document.getElementById("logout-button");
	var userSpan = document.getElementById("firebaseUser");

	//Set up response to log in and log out
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			userSpan.innerHTML = "Logged in as " + displayName;
			logInButton.setAttribute("style", "display: none");
			logOutButton.setAttribute("style", "display: inline-block");
		} else {
			userSpan.innerHTML = "";
			logInButton.setAttribute("style", "display: inline-block");
			logOutButton.setAttribute("style", "display: None");
		}
	});


	//Test stuff
	var incrementButton = document.getElementById("firebaseTestIncrement");
	var outputSpan = document.getElementById("firebaseTestOutput");
	var _count = 0;

	var setCount = function(val){
		_count = val;
		outputSpan.innerHTML =  _count;
	}

	var testIncrementRef = firebase.database().ref('testIncrement');


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


var firebaseLogin = function(mouseEvent){
	var provider = new firebase.auth.GithubAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}

var firebaseLogout = function(mouseEvent){
	firebase.auth().signOut();
}
