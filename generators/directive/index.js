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
      this.log(props);

    }.bind(this));
  },
  writing: function () {

    var properties = {
      name: this.props.name,
      description: this.props.description,
      lowerCase: this.props.name.toLowerCase(),
      camelCase: (this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)).replace(/(\s|[^A-Za-z0-9])+./, function(match){
        return match.slice(match.length-1, match.length).toUpperCase();
      }),
      controllerAs: this.props.name.toLowerCase().slice(0, 2),
      attribute: this.props.attribute,
      element: this.props.element,
      urlSafe: this.props.name.toLowerCase().replace(/[^A-Za-z0-9]+/, '-'),
      isolateScope: this.props.isolateScope,
      prefix: this.config.get('prefix')
    };

    //this.log(properties.prefix);

    if(properties.element) {

      this.fs.copyTpl(
        this.templatePath('directive/directive.js'),
        this.destinationPath('src/components/' + properties.urlSafe + '/' + properties.urlSafe + '.directive.js'),
        properties
      );

      this.fs.copyTpl(
        this.templatePath('directive/directive.html'),
        this.destinationPath('src/components/' + properties.urlSafe + '/' + properties.urlSafe + '.html'),
        properties
      );

      this.fs.copyTpl(
        this.templatePath('directive/directive.scss'),
        this.destinationPath('src/components/' + properties.urlSafe + '/' + properties.urlSafe + '.scss'),
        properties
      );

    }else{

      this.fs.copyTpl(
        this.templatePath('directiveAttribute/directive.js'),
        this.destinationPath('src/components/' + properties.urlSafe + '/' + properties.urlSafe + '.directive.js'),
        properties
      );

    }

    var yet = this;

    fs.readFile(yet.destinationPath('src/js/app.js'), 'utf-8', function(err, data){
      if (err) yet.log(err);

      var newValue = data.replace(/(\/\/!!D!!\/\/)/, '\''+properties.camelCase+'Directive\', \n\s\s\s\s\s\s//!!D!!//');

      fs.writeFile(yet.destinationPath('src/js/app.js'), newValue, 'utf-8', function (err) {
        if (err) yet.log(err);
        yet.log('Updated module dependencies')
      });
    });

  },
  install: function () {
    console.log('Your Directive is ready');
  }

});
