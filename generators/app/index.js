'use strict';

/**
 * Generates the core angular application.
 */

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    yosay     = require('yosay'),
    caseIt    = require('change-case'),
    mkdirp    = require('mkdirp');

module.exports = class extends Generator {
  // Initializing Queue
  initializing () {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the ${chalk.red('TricomB2B')} Angular generator!`));
  }

  // Prompting Queue
  prompting () {
    const prompts = [{
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
    }];

    return this.prompt(prompts)
      .then((answers) => {
        this.props         = answers;
        this.props.prefix  = caseIt.paramCase(this.props.prefix);
        this.props.appName = caseIt.paramCase(this.props.name);
      });
  }

  // Configuration Queue
  configuring () {
    this.config.set('prefix', this.props.prefix);
    this.config.save();
  }

  // Writing Queue
  writing () {
    const props = this.props;

    mkdirp.sync(this.destinationPath('img'));
    mkdirp.sync(this.destinationPath('src/scss/'));
    mkdirp.sync(this.destinationPath('src/directives'));
    mkdirp.sync(this.destinationPath('src/factories'));
    mkdirp.sync(this.destinationPath('src/filters'));
    mkdirp.sync(this.destinationPath('src/views'));
    mkdirp.sync(this.destinationPath('src/views/home'));
    mkdirp.sync(this.destinationPath('src/js'));

    this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('img/.gitkeep'));
    this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/directives/.gitkeep'));
    this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/factories/.gitkeep'));
    this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/filters/.gitkeep'));
    this.fs.copy(this.templatePath('.gitkeep'), this.destinationPath('src/views/.gitkeep'));

    this.fs.copy(this.templatePath('.htaccess'), this.destinationPath('.htaccess'));
    this.fs.copy(this.templatePath('editorconfig.txt'), this.destinationPath('.editorconfig'));
    this.fs.copy(this.templatePath('gitignore.txt'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('data.json'), this.destinationPath('data.json'));
    this.fs.copy(this.templatePath('gulpfile.babel.js'), this.destinationPath('gulpfile.babel.js'));
    this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('readme.md'), this.destinationPath('readme.md'));
    this.fs.copy(this.templatePath('LICENSE'), this.destinationPath('LICENSE'));

    this.fs.copy(this.templatePath('js/modernizr.js'), this.destinationPath('src/js/modernizr.js'));
    this.fs.copy(this.templatePath('scss/**/*'), this.destinationPath('src/scss'));
    this.fs.copy(this.templatePath('view/view.html'), this.destinationPath('src/views/home/home.html'));
    this.fs.copy(this.templatePath('view/view.js'), this.destinationPath('src/views/home/home.js'));
    this.fs.copy(this.templatePath('view/view.scss'), this.destinationPath('src/views/home/home.scss'));

    this.fs.copy(this.templatePath('js/data-factory.js'), this.destinationPath(`src/factories/${props.prefix}-data/${props.prefix}-data.factory.js`));

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      props
    );
    this.fs.copyTpl(
      this.templatePath('js/app.js'),
      this.destinationPath('src/js/app.js'),
      props
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      props
    );
  }

  // Install Queue
  install () {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true,
      callback: () => {
        this.spawnCommandSync('gulp', ['build']);
      }
    });
  }

  // End Queue
  end () {
    this.log(chalk.green('Your Angular app is ready. Build something awesome!'));
  }
}
