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
      message: 'What is the name of this Factory?',
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this Factory',
      default: 'description'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;

    }.bind(this));
  },
  writing: function () {

    var gen = this,
        getTemplate = function(template){
            return gen.templatePath(`../../../templates/${template}`);
        },
        properties = {
            description: this.props.description,
            lowerCase: this.props.name.toLowerCase().replace(/[^A-Za-z0-9]+/g, ''),
            camelCase: (this.props.name.charAt(0).toUpperCase() + this.props.name.toLowerCase().slice(1)).replace(/(\s|[^A-Za-z0-9])+./g, function(match){
            return match.slice(match.length-1, match.length).toUpperCase();
            }).replace(/[^A-Za-z0-9]+$/, ""),
            urlSafe: this.props.name.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-').replace(/[^A-Za-z0-9]+$/, ""),
            prefix: this.config.get('prefix') ? this.config.get('prefix') + '-' : 'app' +'-'
        };

    this.fs.copyTpl(
      getTemplate('factory.js'),
      this.destinationPath('src/factories/'+ properties.prefix + properties.urlSafe +'/'+ properties.prefix + properties.urlSafe +'.factory.js'),
      properties
    );

    var yet = this;

    fs.readFile(yet.destinationPath('src/js/app.js'), 'utf-8', function(err, data){
      if (err) yet.log(err);

      var newValue = data.replace(/(\/\/!!F!!\/\/)/, '\''+properties.camelCase+'Factory\', \n\t\t\t//!!F!!//')
        .replace(/(\/\/!!FAI!!\/\/)/, properties.lowerCase+': function('+properties.camelCase+'Factory){\n\t\t\t\t\t\treturn '+properties.camelCase+'Factory.initialize().$promise\n\t\t\t\t\t}, \n\t\t\t\t\t//!!FI!!//');

      fs.writeFile(yet.destinationPath('src/js/app.js'), newValue, 'utf-8', function (err) {
        if (err) yet.log(err);
        yet.log('Updated module dependencies')
      });
    });

  },
  install: function () {
	  this.log(chalk.green('Your Factory is ready'));
  }

});
