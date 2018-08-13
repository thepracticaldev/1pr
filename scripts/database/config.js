/* globals firebase */
"use strict";

//Please overide this with the config for your test firebase project
var config = {
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	storageBucket: "",
	messagingSenderId: ""
};
firebase.initializeApp(config);
