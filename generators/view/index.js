'use strict';

/**
 * Generates a view.
 */

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    caseIt    = require('change-case'),
    fsp       = require('fs-promise');

module.exports = class extends Generator {
  // Prompting Queue
  prompting () {
    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of this view?',
      validate: Boolean
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this view.',
      default: 'description'
    }, {
      type: 'confirm',
      name: 'stateParams',
      message: 'Does this state utilize a parameter?'
    }, {
      type: 'input',
      name: 'url',
      message: 'What is the url?',
      validate: Boolean
    }, {
      type: 'input',
      name: 'state',
      message: 'What is the state name?',
      validate: Boolean
    }, {
      type: 'input',
      name: 'controllerAs',
      message: 'Controller Name?',
      default: 'vm'
    }];

    return this.prompt(prompts)
      .then((answers) => {
        this.props            = answers;
        this.props.module     = caseIt.camelCase(`${this.props.name}-view`);
        this.props.config     = caseIt.pascal(`${this.props.name}-config`);
        this.props.controller = caseIt.pascal(`${this.props.name}-ctrl`);
        this.props.urlSafe    = caseIt.paramCase(`${this.props.name}`);
        this.props.params     = [];
      });
  }

  // Writing Queue
  writing () {
    const props    = this.props,
          appFile  = 'src/js/app.js',
          viewFile = 'src/scss/styling/_views.scss';
          //viewTpl  = (props.stateParams) ? 'param-view.js' : 'view.js';

    let p1, p2 = null;

    if (props.stateParams) {
      let matches  = props.url.match(/:[A-Za-z0-9]+/g),
          params   = matches.map(s => s.slice(1));

      props.params = params;
    }

    // create the view files using the templates
    this.fs.copyTpl(
      this.templatePath('view.js'),
      this.destinationPath(`src/views/${props.urlSafe}/${props.urlSafe}.js`),
      props
    );
    this.fs.copyTpl(
      this.templatePath('view.html'),
      this.destinationPath(`src/views/${props.urlSafe}/${props.urlSafe}.html`),
      props
    );
    this.fs.copyTpl(
      this.templatePath('view.scss'),
      this.destinationPath(`src/views/${props.urlSafe}/${props.urlSafe}.scss`),
      props
    );

    p1 = fsp
      .readFile(this.destinationPath(appFile), 'utf8')
      .then((data) => {
        let newFile = data.replace(/(\/\/!!V!!\/\/)/, `'${props.module}',\n      //!!V!!//`);

        return fsp.writeFile(this.destinationPath(appFile), newFile);
      })
      .then(() => {
        this.log(`   ${chalk.green('update')} ${appFile}`);
      });

    p2 = fsp
      .readFile(this.destinationPath(viewFile), 'utf8')
      .then((data) => {
        let newFile = data.replace(/(\/\/!!V!!\/\/)/, `@import "../../views/${props.urlSafe}/${props.urlSafe}";\n//!!V!!//`);

        return fsp.writeFile(this.destinationPath(viewFile), newFile);
      })
      .then(() => {
        this.log(`   ${chalk.green('update')} ${viewFile}`);
      });

    // prevents end queue from executing until writing queue is done
    return Promise.all([p1, p2]);
  }

  // End Queue
  end () {
    this.log(chalk.green('Your view is ready'));
  }
}
