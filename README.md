# 1pr
I will be accepting up to one pull request per day on this project.

View the result at [thepracticaldev.github.io/1pr](https://thepracticaldev.github.io/1pr/).

[![Build Status](https://travis-ci.org/thepracticaldev/1pr.svg?branch=master)](https://travis-ci.org/thepracticaldev/1pr) [![Gitter](https://badges.gitter.im/thepracticaldev/1pr.svg)](https://gitter.im/thepracticaldev/1pr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

## Project Journal

- [As one does at three o'clock in the morning, I started a funky side project.](https://dev.to/ben/as-one-does-at-three-oclock-in-the-morning-i-started-a-funky-side-project)
- [1pr Day 3: Added styles and a project contributor list](https://dev.to/ben/1pr-day-3-added-styles-and-a-project-contributor-list)
- [Having trouble integrating gitter into 1pr](https://dev.to/ben/having-trouble-integrating-gitter-into-1pr)


## How to contribute
- Fork the repository
- Add something awesome
- Create a pull request
- Hope you get picked


## Coding standards
When contributing, please try to follow the coding standards so we have nice looking code that's easy to follow for everyone.

#### Editorconfig
Where possible, use an editor (or a plugin for your editor) that supports [editorconfig](http://editorconfig.org/).

The editorconfig file should set your editor to the following settings automatically:
- UTF-8 charset
- Unix-style line breaks
- End file with a new line
- No trailing whitespace before a line break
- Use tabs for indentation

Tab width is not defined in the editorconfig, so each deveveloper can set their editor's tab width to what they're most comfortable with.

#### Furthermore:
- Add comments to your code where necessary. The project should be accessible for devs of all experience and skill levels. Better to have too many comments, than none at all.
- Whitespace is not the enemy! A couple of empty lines between blocks of code can really improve readability.

#### For Javascript specifically:
- Use semicolons (even through they're not strictly necessary). It's good practice!
- Use `let` and `const` where applicable, to keep the scope of your variables specific. Don't know what scope is or what `let` does? Check out [this article](https://medium.com/@MentallyFriendly/es6-an-idiots-guide-to-let-and-const-70be9691c389).
- Use `lowerCamelCase` for variable names (not `snake_case`)

## Storing Data
1pr is backed by a Firebase database.  This allows you to save and share data armed with just the knowledge of JSON rather than having to understand structuring a database or sql etc..

To set up a test database and add yourself as administrator:
1. create a Firebase account and project
1. replace the config details in `database\firebaseconfig.js` with the config details shown in the Firebase console
1. copy the contents of `Firebaserules.json` into the database rules section of the console
	- (Re-do this every time you pull new changes into your fork that change the rules file)
1. under the authentication section of the console, enable GitHub authentication (follow the instructions there)
1. (optionally add your github.io subdomain or other domains where you can access your site as an authorised OAuth redirect domain)
1. serve your files
1. navigate to your 1pr homepage
1. click the sign in button in the top right to sign in with GitHub and generate a database account for yourself
1. go to the users panel of the authentication section of the Firebase console and copy the `uid` for your newly-generated account
1. go to the data panel of the database section and:
	1. add a node named `admins` as a child of the root node
	1. click the plus to add a sub-node
	1. copy your `uid` into the name of that sub-node and add a value of true
	1. click add to save the changes
1. go back to your 1pr page and refresh.
1. click the newly-visible Manage Web App link
1. Click run migrations to apply all database changes to your Firebase database
	- (Re-run this every time you pull new changes into your fork that change the database)

To develop with the database:
- Use the documentation to find out how to save and load data
- By default the rules only allow administrators to edit the database, so make sure you've given yourself that role
	- This is important -  Firebase allows connections from localhost so (given the connection details are public) anyone could serve their own script that reads and writes to the database maliciously
- Make a new top-level node for each feature (unless it particularly makes sense not to)
- Remember to update the rules to allow non-admins to use your feature, though be restrictive rather than permissive
- Remember to test those rules using the simulator build into the rules interface
- Record the steps you take modifying the structure and data within the database in a migration:
	1. Open up `database\migrations.js`
	1. find the end of the `migrations` array
	1. add a new object, following the pattern of the existing migrations, i.e.
		- `name` - unique identifier for the migration
		- `description` - talk about what your changes do
		- `doMigration` - a function that returns a promise (or other thenable object) that enacts the data manipulation to achieve what you want to do
	1. test your migration by using the button on the admin page
		- there's no mechanism to roll back migrations yet, so testing multiple times requires deleting all but the `admins` node from the database and rerunning all migrations again

