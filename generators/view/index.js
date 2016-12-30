'use strict';

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    yosay     = require('yosay'),
    fs        = require('fs');

module.exports = class extends Generator {
  prompting () {

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
      type: 'confirm',
      name: 'stateParams',
      message: 'Does this state utilize a parameter?'
    }, {
      type: 'input',
      name: 'url',
      message: 'View url'
    }, {
      type: 'input',
      name: 'state',
      message: 'View State'
    }, {
      type: 'input',
      name: 'controllerAs',
      message: 'Controller Name?',
      default: 'vm'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(props);

    }.bind(this));
  }

  writing () {

    var gen = this,
      getTemplate = function(template){
        return gen.templatePath(`../../../templates/${template}`);
      },
      properties = {
        name: this.props.name,
        description: this.props.description,
        url: this.props.url,
        state: this.props.state,
        lowerCase: this.props.name.toLowerCase(),
        camelCase: (this.props.name.charAt(0).toUpperCase() + this.props.name.toLowerCase().slice(1)).replace(/(\s|[^A-Za-z0-9])+./g, function(match){
          return match.slice(match.length-1, match.length).toUpperCase();
        }).replace(/[^A-Za-z0-9]+$/, ""),
        controllerAs: this.props.controllerAs,
        params: []
      };

    if(this.props.stateParams){
      var matches = properties.url.match(/:[A-Za-z0-9]+/g);

      if(matches && matches.length > 0){
        this.log(matches);
        for(var i = 0; i < matches.length; i++){
          var text = matches[i].replace(/:/, '');
          properties.params.push(text);
        }
        this.log(properties.params);
      }
    }

    this.fs.copyTpl(
      getTemplate('views/view.html'),
      this.destinationPath('src/views/'+properties.lowerCase+'/'+properties.lowerCase+'.html'),
      properties
    );
    this.fs.copyTpl(
      getTemplate('views/view.scss'),
      this.destinationPath('src/views/'+properties.lowerCase+'/'+properties.lowerCase+'.scss'),
      properties
    );

    if(this.props.stateParams){
      this.fs.copyTpl(
        getTemplate('viewParam/view.js'),
        this.destinationPath('src/views/'+properties.lowerCase+'/'+properties.lowerCase+'.js'),
        properties
      );
    }else{
      this.fs.copyTpl(
        getTemplate('views/view.js'),
        this.destinationPath('src/views/'+properties.lowerCase+'/'+properties.lowerCase+'.js'),
        properties
      );
    }

    var yet = this;

    fs.readFile(yet.destinationPath('src/js/app.js'), 'utf-8', function(err, data){
      if (err) yet.log(err);

      var newValue = data.replace(/(\/\/!!V!!\/\/)/, '\''+properties.camelCase+'View\', \n\t\t\t//!!V!!//');

      fs.writeFile(yet.destinationPath('src/js/app.js'), newValue, 'utf-8', function (err) {
        if (err) yet.log(err);
        yet.log('Updated module dependencies')
      });
    });

    fs.readFile(yet.destinationPath('src/scss/styling/_views.scss'), 'utf-8', function(err, data){
      if (err) yet.log(err);

      var newValue = data.replace(/(\/\/!!V!!\/\/)/, '@import "../../views/'+properties.camelCase+'/'+properties.camelCase+'; \n//!!V!!//');

      fs.writeFile(yet.destinationPath('src/scss/styling/_views.scss'), newValue, 'utf-8', function (err) {
        if (err) yet.log(err);
        yet.log('Injected styling into views file');
      });
    });

  }

  install () {
    this.log(chalk.green('Your view is ready'));
  }

}
