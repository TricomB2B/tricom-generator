'use strict';
var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    yosay     = require('yosay'),
    mkdirp    = require('mkdirp'),
    copydir   = require('copy-dir');

module.exports = class extends Generator {
  prompting () {
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
      name: 'prefix',
      message: 'Global prefix (e.g. app = app-directive-name)',
      default: 'app'
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
    mkdirp.sync(this.destinationPath('src/views/home'));
    mkdirp.sync(this.destinationPath('src/js'));

    this.fs.copy(getTemplate('.gitkeep'), this.destinationPath('img/.gitkeep'));
    this.fs.copy(getTemplate('.gitkeep'), this.destinationPath('src/directives/.gitkeep'));
    this.fs.copy(getTemplate('.gitkeep'), this.destinationPath('src/factories/.gitkeep'));
    this.fs.copy(getTemplate('.gitkeep'), this.destinationPath('src/filters/.gitkeep'));
    this.fs.copy(getTemplate('.gitkeep'), this.destinationPath('src/views/.gitkeep'));
    this.fs.copy(getTemplate('js/helpers.js'), this.destinationPath('src/js/helpers.js'));
    this.fs.copy(getTemplate('js/modernizr.js'), this.destinationPath('src/js/modernizr.js'));
    this.fs.copy(getTemplate('view/view.html'), this.destinationPath('src/views/home/home.html'));
    this.fs.copy(getTemplate('view/view.js'), this.destinationPath('src/views/home/home.js'));
    this.fs.copy(getTemplate('view/view.scss'), this.destinationPath('src/views/home/home.scss'));

    copydir.sync(getTemplate('scss'), this.destinationPath('src/scss/'));

    this.fs.copy(getTemplate('.htaccess'), this.destinationPath('.htaccess'));
    this.fs.copy(getTemplate('editorconfig.txt'), this.destinationPath('.editorconfig'));
    this.fs.copy(getTemplate('.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(getTemplate('data.json'), this.destinationPath('data.json'));
    this.fs.copy(getTemplate('gulpfile.babel.js'), this.destinationPath('gulpfile.babel.js'));
    this.fs.copy(getTemplate('readme.md'), this.destinationPath('readme.md'));
    this.fs.copy(getTemplate('js/data-factory.js'), this.destinationPath('src/factories/'+properties.prefixedName+'data/'+properties.prefixedName+'data.factory.js'));

    this.fs.copy(getTemplate('gitignore.txt'), this.destinationPath('.gitignore'));

    this.fs.copyTpl(
      getTemplate('index.html'),
      this.destinationPath('index.html'),
      properties
    );
    this.fs.copyTpl(
      getTemplate('js/app.js'),
      this.destinationPath('src/js/app.js'),
      properties
    );
    this.fs.copyTpl(
      getTemplate('package.json'),
      this.destinationPath('package.json'),
      properties
    );
  }

  install () {
    this.yarnInstall();
  }

  end () {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', '"Initial Commit"']);
    this.log(chalk.green('Your app is ready. Build something awesome!'));
    this.spawnCommand('gulp', ['vendors']);
    this.spawnCommand('gulp');
  }

  config () {
    this.config.set('prefix', this.props.prefix.replace(/(\s|[^A-Za-z0-9])+/g, ''));
    this.config.save();
  }
}
