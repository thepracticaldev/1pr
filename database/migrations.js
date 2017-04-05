(function prepareMigrations(){

	var migrationButton = document.getElementById("button-migrate");
	var appliedMigrationsList = document.getElementById("ul-migrations-applied");
	var availableMigrationsList = document.getElementById("ul-migrations-available");

	var self = this;
	self.migrationHistory = [];
	self.appliedMigrations = [];
	self.availableMigrations = [];
	const migrationHistoryRefName = "migrationHistory";
	var migrationHistoryRef = firebase.database().ref(migrationHistoryRefName);

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
				//Don't need to do anything explicitly.
				// migrationHistoryRef gets created when the first history item (this one) gets pushed
				//Still need to return a thenable object
				return Promise.resolve();
			}
		},
	];

	var applyMigration = function(migration){
		console.log("Applying migration", migration.name)
		return migration.doMigration().then(function(){
			console.log("Applied migration", migration.name)
			//Strip out function definition when pushing to database but add timestamp for reference
			migrationHistoryRef.push().set({
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

	migrationHistoryRef.on("value", function(migrationHistorySnapshot){
		var migration = {};
		var migrationHistoryItem = {};
		var found = false;
		//Handle no migration history node
		self.migrationHistory = migrationHistorySnapshot.val()
		if (self.migrationHistory === null){
			self.migrationHistory = {};
		}

		//Work out which of the above migrations are applied or waiting to be applied
		self.appliedMigrations = [];
		self.availableMigrations = [];

		for (var i = 0; i < migrations.length ; i++){
			migration = migrations[i];
			found = false;
			for(var k in self.migrationHistory)
			{
				migrationHistoryItem = self.migrationHistory[k];
				if (migrationHistoryItem.name === migration.name)
				{
					self.appliedMigrations.push(migrationHistoryItem);
					found = true;
					break;
				}
			}
			if (!found){
				self.availableMigrations.push(migration);
			}
		}

		if (self.availableMigrations.length > 0)
		{
			migrationButton.disabled = false;
			migrationButton.textContent = "Apply migrations";
		}
		else
		{
			migrationButton.disabled = true;
			migrationButton.textContent = "No migrations to apply";
		}

		populateMigrationList(appliedMigrationsList, self.appliedMigrations);
		populateMigrationList(availableMigrationsList, self.availableMigrations);

		//Refresh the apply migration click handler so it applys only the required migrations
		migrationButton.onclick = function(mouseEvent){
			//Empty promise to begin promise chain
			var promise = Promise.resolve();
			for (var i = 0; i < self.availableMigrations.length ; i++){
				migration = self.availableMigrations[i];
				promise = promise.then(applyMigration(migration));
			}
			//promise.error((error) => console.log(error));
		};
	}, function(error){
		console.log(error);
	});
})();
