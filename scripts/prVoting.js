// Wrap everything inside a scoped function
(function initPRVoting() {

	var incrementButton = document.getElementById("firebaseTestIncrement");
	var outputSpan = document.getElementById("firebaseTestOutput");
	outputSpan.innerHTML =  "loading counter value";

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

	incrementButton.onclick = function(mouseEvent){
		var newCount = _count + 1;
		setCount(newCount);
		saveCount(newCount);
	};


})();

