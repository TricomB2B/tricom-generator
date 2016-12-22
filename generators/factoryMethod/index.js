'use strict';

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    yosay     = require('yosay'),
    fs        = require('fs');

module.exports = class extends Generator {
  prompting () {

    var prompts = [{
      type: 'input',
      name: 'factoryName',
      message: 'What is the name of the Factory?',
    }, {
      type: 'input',
      name: 'methodName',
      message: 'What is the name of the Method',
    }, {
      type: 'input',
      name: 'methodDescription',
      message: 'Describe this method',
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;

    }.bind(this));
  }

  writing () {

    var properties = {
      description: this.props.methodDescription,
      factory: this.props.factoryName.toLowerCase(),
      method: this.props.methodName.replace(/(\s|[^A-Za-z0-9])+./g, function(match){
        return match.slice(match.length-1, match.length).toUpperCase();
      }).replace(/[^A-Za-z0-9]+$/, ""),
      prefix: this.config.get('prefix') ? this.config.get('prefix') + '-' : 'app' +'-',
    };

    if(properties.factory.slice(0, properties.prefix.length) === properties.prefix) {
      properties.fileName = properties.factory;
    }else{
      properties.fileName = properties.prefix + properties.factory;
    }

    //console.log(this.destinationPath('src/factories/'+properties.prefix + properties.factory));

    var yet = this;

    fs.readFile(yet.destinationPath('src/factories/'+properties.fileName+'/'+properties.fileName+'.factory.js'), 'utf-8', function(err, data){
      if (err) {
        yet.factoryFound = false;
      }else{
        yet.factoryFound = true;


        var newValue = data.replace(/(\/\/!!FC!!\/\/)/, properties.method + ': '+ properties.method +', \n\t\t\t//!!FC!!//').replace(/(\/\/!!FF!!\/\/)/, 'function '+properties.method+'(){\n\t\t\tconsole.log("'+properties.method+'")\n\t\t} \n\n\t\t//!!FF!!//');

        fs.writeFile(yet.destinationPath('src/factories/'+properties.fileName+'/'+properties.fileName+'.factory.js'), newValue, 'utf-8', function (err) {
          if (err) yet.log(err);
        });

      }

    });

    this.props.props = properties;

  }

  install () {
    if (this.factoryFound)
      this.log(chalk.green('Factory '+this.props.props.fileName+' updated!'));
    else
      this.log(chalk.red('Factory '+this.props.props.fileName+' not found.'));
  }

}
