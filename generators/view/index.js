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
      message: 'What is the name of this view?',
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this view',
      default: 'description'
    }, {
      type: 'input',
      name: 'url',
      message: 'View url'
    }, {
      type: 'input',
      name: 'state',
      message: 'View State'
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
      url: this.props.url,
      state: this.props.state,
      lowerCase: this.props.name.toLowerCase(),
      camelCase: this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1),
      controllerAs: this.props.name.toLowerCase().slice(0, 2)
    };

    //this.log('prefix: ' + generator.config.get('prefix'));

    this.fs.copyTpl(
      this.templatePath('view/view.html'),
      this.destinationPath('src/views/'+properties.name+'/'+properties.name+'.html'),
      properties
    );
    this.fs.copyTpl(
      this.templatePath('view/view.js'),
      this.destinationPath('src/views/'+properties.name+'/'+properties.name+'.js'),
      properties
    );
    this.fs.copyTpl(
      this.templatePath('view/view.scss'),
      this.destinationPath('src/views/'+properties.name+'/'+properties.name+'.scss'),
      properties
    );

    var yet = this;

    fs.readFile(yet.destinationPath('src/js/app.js'), 'utf-8', function(err, data){
      if (err) yet.log(err);

      var newValue = data.replace(/(\/\/~%~\/\/)/, '\t"'+properties.camelCase+'View", \n\t\t//~%~//');

      fs.writeFile(yet.destinationPath('src/js/app.js'), newValue, 'utf-8', function (err) {
        if (err) yet.log(err);
        yet.log('Updated module dependencies')
      });
    });

  },
  install: function () {
    console.log('Your view is ready');
  }

});
