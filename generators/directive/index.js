'use strict';

/**
 * Generates a directive.
 */

var Generator  = require('yeoman-generator'),
    chalk      = require('chalk'),
    caseIt     = require('change-case'),
    fsp        = require('fs-promise');

module.exports = class extends Generator {
  // Prompting Queue
  prompting () {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of this directive?',
      validate: Boolean
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this directive.',
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
    },{
      type: 'input',
      name: 'controllerAs',
      message: 'Controller name?',
      default: 'vm',
      when: (answers) => {
        return answers.element;
      }
    }];

    return this.prompt(prompts)
      .then((answers) => {
        this.props            = answers;
        this.props.prefix     = this.config.get('prefix') ? this.config.get('prefix') : 'app';
        this.props.module     = caseIt.camelCase(`${this.props.prefix}-${this.props.name}-directive`);
        this.props.directive  = caseIt.camelCase(`${this.props.prefix}-${this.props.name}`);
        this.props.controller = caseIt.pascal(`${this.props.name}-ctrl`);
        this.props.urlSafe    = caseIt.paramCase(`${this.props.prefix}-${this.props.name}`);
      });
  }

  // Writing Queue
  writing () {
    const props    = this.props,
          appFile  = 'src/js/app.js',
          compFile = 'src/scss/styling/_components.scss';

    let p1, p2 = null;

    // create the directive files using the templates
    this.fs.copyTpl(
      this.templatePath('directive.js'),
      this.destinationPath(`src/directives/${props.urlSafe}/${props.urlSafe}.directive.js`),
      props
    );
    if (props.element) {
      this.fs.copyTpl(
        this.templatePath('directive.html'),
        this.destinationPath(`src/directives/${props.urlSafe}/${props.urlSafe}.html`),
        props
      );
      this.fs.copyTpl(
        this.templatePath('directive.scss'),
        this.destinationPath(`src/directives/${props.urlSafe}/${props.urlSafe}.scss`),
        props
      );
    }

    // update the app file with the new module dependency
    p1 = fsp
      .readFile(this.destinationPath(appFile), 'utf8')
      .then((data) => {
        let newFile = data.replace(/(\/\/!!D!!\/\/)/, `'${props.module}',\n      //!!D!!//`);

        return fsp.writeFile(this.destinationPath(appFile), newFile);
      })
      .then(() => {
         this.log(`   ${chalk.green('update')} ${appFile}`);
      });

    if (props.element) {
      // update the components sass file with the new component
      p2 = fsp
        .readFile(this.destinationPath(compFile), 'utf8')
        .then((data) => {
          let newFile = data.replace(/(\/\/!!D!!\/\/)/, `@import "../../directives/${props.urlSafe}/${props.urlSafe}";\n//!!D!!//`);

          return fsp.writeFile(this.destinationPath(compFile), newFile);
        })
        .then(() => {
          this.log(`   ${chalk.green('update')} ${compFile}`);
        });
      }

    // prevents end queue from executing until writing queue is done
    return Promise.all([p1, p2]);
  }

  // End Queue
  end () {
    this.log(chalk.green('Your directive is ready'));
  }
}
