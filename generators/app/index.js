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
      prefix: this.props.prefix,
      prefixedName: this.props.prefix+'-'
    };

    mkdirp.sync(this.destinationPath('img'));
    mkdirp.sync(this.destinationPath('src/scss/'));
    mkdirp.sync(this.destinationPath('src/components'));
    mkdirp.sync(this.destinationPath('src/views'));
    mkdirp.sync(this.destinationPath('src/js'));

    this.bulkDirectory(this.templatePath('static'), this.destinationPath('')); // Copies all files from static directory into root
    this.bulkDirectory(this.templatePath('scss'), this.destinationPath('src/scss/'));

    this.fs.copy(
      this.templatePath('.gitkeep'),
      this.destinationPath('img/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('.gitkeep'),
      this.destinationPath('src/components/.gitkeep')
    );
    this.fs.copy(
      this.templatePath('.gitkeep'),
      this.destinationPath('src/views/.gitkeep')
    );

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
    this.installDependencies({
      bower:false,
      callback: function () {
        console.log('Everything is ready!');
      }
    });
  }
});

/*
generators.Base.extend({
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.makeView = function(){

      this.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of this view?',
        default: this.props.prefix + '-' + this.props.name
      }, {
        type: 'input',
        name: 'description',
        message: 'Describe this view',
        default: 'description'
      }]).then(function (props) {

        props.lowerCase = props.name.toLowerCase();
        props.camelCase = props.name.charAt(0).toUpperCase() + props.name.slice(1);
        props.controllerAs = props.name.slice(0, 2);

        this.fs.template(
          this.templatePath('view/view.html'),
          this.destinationPath('src/views/'+props.name+'/'+props.name+'.html'),
          props
        );
        this.fs.template(
          this.templatePath('view/view.js'),
          this.destinationPath('src/views/'+props.name+'/'+props.name+'.js'),
          props
        );
        this.fs.template(
          this.templatePath('view/view.scss'),
          this.destinationPath('src/views/'+props.name+'/'+props.name+'.scss'),
          props
        );

      });

    }
  }
});
*/
