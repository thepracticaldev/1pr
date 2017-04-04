(function prepareMigrations(){

	var migrationButton = document.getElementById("button-migrate");
	var appliedMigrationsList = document.getElementById("ul-migrations-applied");
	var availableMigrationsList = document.getElementById("ul-migrations-available");

	var self = this;
	self.migrationHistory = [];
	self.appliedMigrations = [];
	self.availableMigrations = [];
	const migrationHistoryRef = "migrationHistory";

	var migrations = [
		//Define migrations here, in the order they should be applied.
		//migrations are objects with the following properties:
		//  name - a short unique identifying string
		//  description - go into more detail about what it does for reference
		//  doMigration - a function that adds, updates or deletes nodes from the database
		//                (assuming that the database has had all previous migrations applied
		//                and has been used by regular users since).
		//                Takes no input
		//                Returns a promise to act upon after the migration
		//Don't forget to also adjust the firebaserules.json as required.
		{
			name: "Initial migration",
			description: "Added migration system.  Requires 'admins' node defined in database populated with an array of user ids",
			doMigration: function(){
				//Set up the empty migration history node
				return firebase.database().ref(migrationHistoryRef).set(self.migrationHistory);
			}
		},
	];

	var applyMigration = function(migration){
		return migration.doMigration().then(function(){
			//Strip out function definition when pushing to database but add timestamp for reference
			self.migrationHistory.push({
				name: migration.name,
				description: migration.description,
				timestamp: new Date().toUTCString()
			});
		});
	}

	var populateMigrationList = function(listElement, migrations){
		var migration = {};
		var li = null;
		var nameSpan = null;
		var descriptionSpan = null;
		var timestampSpan = null;
		listElement.innerHTML = "";

		if (migrations.length === 0){
			li = document.createElement("li");
			li.appendChild(document.createTextNode("No Migrations"));
			listElement.appendChild(li);
		}
		else{
			for (var i = 0; i < migrations.length ; i++){
				migration = migrations[i];
				li = document.createElement("li");
				nameSpan = document.createElement("span");
				nameSpan.appendChild(document.createTextNode(migration.name));
				li.appendChild(nameSpan);
				descriptionSpan = document.createElement("span");
				descriptionSpan.appendChild(document.createTextNode(migration.description));
				li.appendChild(descriptionSpan);
				if(migration.timestamp !== undefined){
					timestampSpan = document.createElement("span");
					timestampSpan.appendChild(document.createTextNode(migration.timestamp));
					li.appendChild(timestampSpan);
				}
				listElement.appendChild(li);
			}
		}

	}

	firebase.database().ref(migrationHistoryRef).on("value", function(migrationHistorySnapshot){
		var migration = {};
		var migrationHistoryItem = {};

		//Handle no migration history node
		self.migrationHistory = migrationHistorySnapshot.val()
		if (self.migrationHistory === null){
			self.migrationHistory = [];
		}

		//Work out which of the above migrations are applied or waiting to be applied
		self.appliedMigrations = [];
		self.availableMigrations = [];

		for (var i = 0; i < migrations.length ; i++){
			migration = migrations[i];
			migrationHistoryItem = self.migrationHistory.find(function(historyItem){return historyItem.name === migration.name});
			if (migrationHistoryItem === undefined){
				self.availableMigrations.push(migration);
			}
			else{
				self.appliedMigrations.push(migrationHistoryItem);
			}
		}

		populateMigrationList(appliedMigrationsList, self.appliedMigrations);
		populateMigrationList(availableMigrationsList, self.availableMigrations);

		//Refresh the apply migration click handler so it applys only the required migrations
		migrationButton.onclick = function(mouseEvent){
			//Empty promise to begin promise chain
			var promise = Promise.resolve();
			for (var i = 0; i < self.availableMigrations.length ; i++){
				migration = migrations[i];
				promise = promise.then(applyMigration(migration));
			}
			promise.then(() => firebase.database().ref(migrationHistoryRef).set(self.migrationHistory),(error) => console.log(error));
		};
	}, function(error){
		console.log(error);
	});
})();
