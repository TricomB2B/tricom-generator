'use strict';
var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	yosay = require('yosay'),
	mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({
	prompting: function () {
		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the ' + chalk.red('TricomB2B') + ' generator!'
		));

		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'What is the name of your app?',
			default: this.appname
		}, {
			type: 'input',
			name: 'description',
			message: 'Description',
			default: this.appname
		}, {
			type: 'input',
			name: 'primaryColor',
			message: 'Primary Color',
			default: '#353535'
		}, {
			type: 'input',
			name: 'prefix',
			message: 'Global prefix (e.g. app = app-directive-name)',
			default: 'app'
		}];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
			this.log(props);

		}.bind(this));
	},
	writing: function () {

		var properties = {
			name: this.props.name,
			description: this.props.description,
			primaryColor: this.props.primaryColor,
			prefix: this.props.prefix.toLowerCase(),
			prefixedName: this.props.prefix.toLowerCase()+'-'
		};

		mkdirp.sync(this.destinationPath('img'));
		mkdirp.sync(this.destinationPath('src/scss/'));
		mkdirp.sync(this.destinationPath('src/directives'));
		mkdirp.sync(this.destinationPath('src/factories'));
		mkdirp.sync(this.destinationPath('src/filters'));
		mkdirp.sync(this.destinationPath('src/views'));
		mkdirp.sync(this.destinationPath('src/views/Home'));
		mkdirp.sync(this.destinationPath('src/js'));

		this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('img/.gitkeep'));
		this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/directives/.gitkeep'));
		this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/factories/.gitkeep'));
		this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/filters/.gitkeep'));
		this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/views/.gitkeep'));
		this.fs.copy(this.templatePath('js/helpers.js'), this.destinationPath('src/js/helpers.js'));
		this.fs.copy(this.templatePath('js/modernizr.js'), this.destinationPath('src/js/modernizr.js'));
		this.fs.copy(this.templatePath('view/view.html'), this.destinationPath('src/views/Home/Home.html'));
		this.fs.copy(this.templatePath('view/view.js'), this.destinationPath('src/views/Home/Home.js'));
		this.fs.copy(this.templatePath('view/view.scss'), this.destinationPath('src/views/Home/Home.scss'));

		this.directory('scss', 'src/scss/');

		this.fs.copy(this.templatePath('.htaccess'), this.destinationPath('.htaccess'));
		this.fs.copy(this.templatePath('editorconfig.txt'), this.destinationPath('.editorconfig'));
		this.fs.copy(this.templatePath('data.json'), this.destinationPath('data.json'));
		this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
		this.fs.copy(this.templatePath('readme.md'), this.destinationPath('readme.md'));
		this.fs.copy(this.templatePath('js/data-factory.js'), this.destinationPath('src/factories/'+properties.prefixedName+'data/'+properties.prefixedName+'data.factory.js'));

		this.fs.copy(this.templatePath('gitignore.txt'), this.destinationPath('.gitignore'));

		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath('index.html'),
			properties
		);
		this.fs.copyTpl(
			this.templatePath('js/app.js'),
			this.destinationPath('src/js/app.js'),
			properties
		);
		this.fs.copyTpl(
			this.templatePath('package.json'),
			this.destinationPath('package.json'),
			properties
		);
	},
	install: function () {
		var gen = this;
		this.installDependencies({
			bower:false,
			callback: function () {
				gen.log(chalk.green('Your app is ready. Build something awesome!'));
				gen.spawnCommand('gulp', ['vendors']);
				gen.spawnCommand('gulp');
			}
		});
	},
	config: function(){

		this.config.set('prefix', this.props.prefix.replace(/(\s|[^A-Za-z0-9])+/g, ''));
		this.config.save();

	}
});
