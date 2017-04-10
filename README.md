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

## Project structure
The project's structure is pretty simple.

- HTML files go in the root directory
- CSS goes in the `stylesheets/` directory
- Javascript goes in the `scripts/` directory
- Third-party libraries (CSS and JS) go in the `vendor/` directory, which is ignored by the linters (see **Testing** below).


## Coding standards
When contributing, please try to follow the coding standards so we have nice looking code that's easy to follow for everyone.

### Editorconfig

Where possible, use an editor (or a plugin for your editor) that supports [editorconfig](http://editorconfig.org/).

The editorconfig file should set your editor to the following settings automatically:

- UTF-8 charset
- Unix-style line breaks
- End file with a new line
- No trailing whitespace before a line break
- Use tabs for indentation

Tab width is not defined in the editorconfig, so each deveveloper can set their editor's tab width to what they're most comfortable with.

### Furthermore

- Add comments to your code where necessary. The project should be accessible for devs of all experience and skill levels. Better to have too many comments, than none at all.
- Whitespace is not the enemy! A couple of empty lines between blocks of code can really improve readability.

### For Javascript specifically

- Use semicolons (even through they're not strictly necessary). It's good practice!
- Use `let` and `const` where applicable, to keep the scope of your variables specific. Don't know what scope is or what `let` does? Check out [this article](https://medium.com/@MentallyFriendly/es6-an-idiots-guide-to-let-and-const-70be9691c389).
- Use `lowerCamelCase` for variable names (not `snake_case`)



## Testing
The project contains the files `.htmlhintrc`, `.csslintrc` and `.jshintrc` with configuration for the respective testing utilities.

To install the testing utilities locally, simply install [Node.js](https://nodejs.org/en/) and then use npm (bundled with Node.js) to install the utilities:

```Bash
# HTML validation
npm install --global htmlhint

# CSS linter
npm install --global csslint

# JSHint
npm install --global jshint
```


#### HTML validation

Run the HTML validator with:
```
htmlhint
```

- All tags should be lowercase
- Use double quotes for attributes
- No duplicate attributes
- HTML5 doctype on the first line
- Must have a title tag
- IDs must be unique
- Src and alt attribute required on images
- No scripts in the head (place them at the bottom of the body)
- No inline style attributes or javascript event handlers (e.g. `onclick=""`)


#### CSS validation

Run the CSS validator with:
```
csslint stylesheets
```

- No empty rules
- No duplicate properties with the same value
- Limit the amount of floats used
- Limit the amount of different font sizes used
- Don't use `!important`
- Don't use `outline: none` unless you have a `:focus` rule on the same element to replace the outline
- Don't use elements in the css when only a class name will suffice
- Don't use regex selectors
- Encourage the use of shorthand notation


#### JS validation

Run the Javascript validator with:
```
jshint scripts
```

- Always use strict mode
- Avoid using bitwise operators
- Always use curly brackets, even for a single line
- Compare values with `===` and `!==` for type safety
- Don't extend prototypes of native objects (e.g. `Array` or `Date`)
- Don't use the comma operator
- Avoid declaring variables that are already declared in a higher scope
- Avoid declaring variables and not using them
