'use strict';

var yeoman   = require('yeoman-generator'),
		chalk    = require('chalk'),
		yosay    = require('yosay'),
		download = require('download-git-repo'),
		path     = require('path'),
		fs       = require('fs');

module.exports = yeoman.Base.extend({
	prompting: function () {
		var prompts = [{
			type: 'input',
			name: 'component',
			message: 'Which ngTricomB2B component would you like to import?'
		}, {
			type: 'input',
			name: 'dir',
			message: 'Where would you like to install?',
			default: 'components'
		}];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	},

	writing: function () {
		var repo = 'ngTricomB2B/' + this.props.component;
		var dest = path.join('src', this.props.dir, this.props.component);

		download(repo, dest, function (err) {
			if (err) return;
			console.log('success');
		});
	}
});
