'use strict';

(function() {

	// CONFIG - How long the loading animation should run for
	let animationDelay = 320;

	// This function will load the assets for the page
	// Scripts are defined in window.loadScripts
	let loadAssets = function(loadComplete) {


		// Create a circular progress bar
		let loading = new window.ProgressBar.Circle(
			document.getElementById('loader'),
			{
				strokeWidth: 2,
				easing: 'easeInOut',
				duration: animationDelay,
				color: 'rgba(255, 255, 255, 0.6)',
				trailColor: 'rgba(255, 255, 255, 0.25)',
				trailWidth: 1,
				svgStyle: null
			}
		);



		// Allow asynchronous scripts (i.e. scripts making API calls) to register on the progress bar as well
		let asyncScripts = [];
		let registerAsyncScript = function(scriptName){
			asyncScripts.push(scriptName);
			let done = function() {
				asyncScripts.splice(asyncScripts.indexOf(scriptName), 1);
				checkIfLoaded();
			};
			return done;
		};
		window.registerAsyncScript = registerAsyncScript;


		// Check if everything has been loaded
		let checkIfLoaded = function() {

			// Stop the currently running animation (if any) and animate towards the new progress value
			loading.stop();
			loading.animate(loadIndex / (window.assets.length + asyncScripts.length));

			// Check if we're done loading
			if(loadIndex >= window.assets.length && asyncScripts.length === 0){
				loadComplete();

			// Otherwise just return false
			}else{
				return false;
			}
		};



		// Asynchronously loads a script and calls callback when the script is loaded
		let loadScript = function(src, callback) {

			// Create a new script element
			let script = document.createElement('script');

			// Set the src attribute
			script.src = src;

			// Attach an 'onload' handler
			script.onload = callback;

			// Append the script to the body so it actually starts loading
			document.body.appendChild(script);
		};

		// Asynchronously loads a stylesheet and calls callback when the script is loaded
		let loadStylesheet = function(src, callback) {

			// Create a new link element
			let stylesheet = document.createElement('link');

			// Set the attributes
			stylesheet.rel = 'stylesheet';
			stylesheet.href = src;

			// Attach an 'onload' handler
			stylesheet.onload = callback;

			// Append the stylesheet to the body so it actually starts loading
			document.body.appendChild(stylesheet);
		};



		// Keep track of where we are in the loading process
		let loadIndex = 0;

		// This function will load all scripts from the scrips array asynchronously one after the other and, once they're loaded, call the provided callback function.
		let load = function() {

			// Get asset
			let asset = window.assets[loadIndex];

			// This function will be called when the asset is loaded
			let done = function() {

				// Increase the loading index
				loadIndex++;

				// If we've loaded all the scripts, call the callback function
				if(loadIndex >= window.assets.length){
					checkIfLoaded();
					return;
				}

				// Otherwise, continue loading (and pass the callback through so it can be called from the last iteration)
				load();
			};

			// Figure out if it's a script or a stylesheet
			if(asset.substr(-3) === '.js'){
				loadScript(asset, done);

			}else if(asset.substr(-4) === '.css'){
				loadStylesheet(asset, done);

			}else if(asset.substr(0, 3) === 'js:'){
				loadScript(asset.substr(3), done);

			}else if(asset.substr(0, 4) === 'css:'){
				loadStylesheet(asset.substr(4), done);

			}else{
				if(window.console){ window.console.error('Unknown asset type:', asset); }
				done();

			}

		};


		// Start loading
		load();

	};

	// Start by loading the progress bar lib, which we need to show a pretty loading bar while we're loading the other stuff
	let progressBarScript = document.createElement('script');
	progressBarScript.src = 'vendor/progressbar.min.js';
	progressBarScript.onload = loadAssets.bind(null, function() {
		setTimeout(function() {
			document.body.className = 'loaded';
		}, animationDelay);
	});
	document.body.appendChild(progressBarScript);

})();
