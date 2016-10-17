'use strict';
var yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of this view?',
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this view',
      default: 'description'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(props);

    }.bind(this));
  },
  writing: function () {

    var properties = {
      lowerCase: this.props.name.toLowerCase(),
      camelCase: this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1),
      controllerAs: this.props.name.slice(0, 2)
    };

    this.fs.template(
      this.templatePath('view/view.html'),
      this.destinationPath('src/views/'+props.name+'/'+props.name+'.html'),
      properties
    );
    this.fs.template(
      this.templatePath('view/view.js'),
      this.destinationPath('src/views/'+props.name+'/'+props.name+'.js'),
      properties
    );
    this.fs.template(
      this.templatePath('view/view.scss'),
      this.destinationPath('src/views/'+props.name+'/'+props.name+'.scss'),
      properties
    );

  },
  install: function () {
    console.log('Your view is ready!');
  };

});
