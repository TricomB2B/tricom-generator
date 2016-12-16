# boilerplate
TricomB2B's starting point for hybrid apps and web-app development

## To Begin
* Run `npm install`
* Change the app name in `index.html` and `app.js` files
* Add dependencies to `package.json`
* Build your app!
* When your app is ready to make its final push, make sure to edit the `.gitignore` file and remove `css`, `js`, `fonts`, and `views` directories.
    
## Structure
* For directives/factories/etc simply create a folder with your component name inside of `/src/components`
* Create a js file depending on component type; e.g. `my-component.directive.js`, if necessary create `.html` and `.scss` files with the same name
* For unit tests, build your component and then make a file in the same directory labelled `my-component.test.js`
* Unit tests are run with [Jasmine](http://jasmine.github.io/) and `gulp`

## Styling
* Update the settings in `/src/scss/_settings.scss` to edit settings, after that you can add custom components or add packages through `npm` and import them into the `app.scss` file. *(Don't forget to add dependencies to the `package.json` file!)*
* `gulp` uses autoprefixer, so vendor prefixes are not neccesary

## Gulp commands
* `gulp` runs all commands except `test`
* `gulp serve` starts a local server through browsersync, starts watch
* `gulp build` guns all available processes and proxies a URL
* `gulp vendors` compiles all vendor files
* `gulp test` runs all unit tests and initiates watch
* `gulp test-once` runs all unit tests one time
