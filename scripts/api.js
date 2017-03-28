/* Shared API "get" function
   window.api(requestUrl, callback)
   requestUrl: The URL that you want to request
   callback:   A function that takes two parameters: (err, responseData)
               `err` will be a JS error, or a number in case of a non-200 response code
               If err is null, `responseData` will contain the parsed JSON response
   */
(function defineAPI() {

	// This function uses "node.js style" error-first callback
	window.api = function(requestUrl, callback) {


		// Create HTTP request
		let request = new XMLHttpRequest();

		// Attach a handler for when the request is completed
		request.onreadystatechange = function onStateChange() {

			// Initialise variable
			let responseData = {};

			/* Instead of checking if the request is ready and putting everything below inside the if
			   I simply return out of the handler whenever the request isn't ready yet.
			   This makes for cleaner code and less nesting imo. */
			if(request.readyState !== 4){
				return;

			}else if(request.status !== 200){
				callback(request.status);
				return;

			}

			// Attempt to parse the JSON response data (in a try/catch in case the JSON is malformed)
			try {
				responseData = JSON.parse(request.responseText);

			} catch (err) {
				callback(err);
				return;

			}

			// If we've made it this far, the request was successful and we can just pass the response data to the callback
			callback(null, responseData);

		}

		// Send the request
		request.open('GET', requestUrl, true);
		request.send(null);

		// If you hit the API rate limit, add the following before sending the request (add in your own username and api token)
		// request.setRequestHeader('Authorization', 'Basic ' + btoa('username:personal api token'));
	}

})();
