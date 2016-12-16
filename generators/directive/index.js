'use strict';
var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	yosay = require('yosay'),
	fs = require('fs');

module.exports = yeoman.Base.extend({
	prompting: function () {

		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'What is the name of this directive?',
		}, {
			type: 'input',
			name: 'description',
			message: 'Describe this directive',
			default: 'description'
		}, {
			type: 'confirm',
			name: 'attribute',
			message: 'Is this directive an attribute?'
		}, {
			type: 'confirm',
			name: 'element',
			message: 'Is this directive an element?'
		}, {
			type: 'confirm',
			name: 'isolateScope',
			message: 'Isolate Scope?'
		}];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;

		}.bind(this));
	},
	writing: function () {

		var gen = this,
			properties = {
				name: this.props.name,
				description: this.props.description,
				lowerCase: this.props.name.toLowerCase(),
				camelCase: (this.props.name.charAt(0).toUpperCase() + this.props.name.toLowerCase().slice(1)).replace(/(\s|[^A-Za-z0-9])+./g, function(match){
					return match.slice(match.length-1, match.length).toUpperCase();
				}).replace(/[^A-Za-z0-9]+$/, ""),
				controllerAs: this.props.name.toLowerCase().slice(0, 3),
				attribute: this.props.attribute,
				element: this.props.element,
				urlSafe: this.props.name.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-').replace(/[^A-Za-z0-9]+$/, ""),
				isolateScope: this.props.isolateScope,
				prefix: this.config.get('prefix') ? this.config.get('prefix') : 'app'
			};

		function getTemplate(template){
			return gen.templatePath(`../../../templates/${template}`);
		}

		if(properties.element) {

			this.fs.copyTpl(
				getTemplate('directive/directive.js'),
				this.destinationPath('src/directives/' + properties.prefix + '-' + properties.urlSafe + '/' + properties.prefix + '-' + properties.urlSafe + '.directive.js'),
				properties
			);

			this.fs.copyTpl(
				getTemplate('directive/directive.html'),
				this.destinationPath('src/directives/' + properties.prefix + '-' + properties.urlSafe + '/' + properties.prefix + '-' + properties.urlSafe + '.html'),
				properties
			);

			this.fs.copyTpl(
				getTemplate('directive/directive.scss'),
				this.destinationPath('src/directives/' + properties.prefix + '-' + properties.urlSafe + '/' + properties.prefix + '-' + properties.urlSafe + '.scss'),
				properties
			);

		}else{

			this.fs.copyTpl(
				getTemplate('directiveAttribute/directive.js'),
				this.destinationPath(`src/directives/${properties.prefix}-${properties.urlSafe}/${properties.prefix}-${properties.urlSafe}.directive.js`),
				properties
			);

		}

		var yet = this;

		fs.readFile(yet.destinationPath('src/js/app.js'), 'utf-8', function(err, data){
			if (err) yet.log(err);

			var newValue = data.replace(/(\/\/!!D!!\/\/)/, '\''+properties.prefix + properties.camelCase+'Directive\', \n\t\t\t//!!D!!//');

			fs.writeFile(yet.destinationPath('src/js/app.js'), newValue, 'utf-8', function (err) {
				if (err) yet.log(err);
				yet.log('Updated module dependencies')
			});
		});

		// matches module('app', [
		//	'test',
		// 	'tester2'
		// ]);

		// \.module\('app', \[(\n\s.+)+\]\)

		// [
		//	'test',
		// 	'tester2'
		// ]

		// \[(\n\s.+)+\]

		fs.readFile(yet.destinationPath('src/scss/styling/_components.scss'), 'utf-8', function(err, data){
			if (err) yet.log(err);

			var newValue = data.replace(/(\/\/!!D!!\/\/)/, '@import "../../directives/'+properties.prefix + '-' + properties.urlSafe + '/'+properties.prefix + '-' + properties.urlSafe + '; \n//!!D!!//');

			fs.writeFile(yet.destinationPath('src/scss/styling/_components.scss'), newValue, 'utf-8', function (err) {
				if (err) yet.log(err);
				yet.log('Injected styling into components file');
			});
		});

	},
	install: function () {
		this.log(chalk.green('Your directive is ready'));
		this.spawnCommand('gulp', ['watch']);
	}

});
