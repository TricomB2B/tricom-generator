'use strict';

/**
 * Generates a directive.
 */

var Generator  = require('yeoman-generator'),
    chalk      = require('chalk'),
    yosay      = require('yosay'),
    caseIt     = require('change-case'),
    fsp        = require('fs-promise');

module.exports = class extends Generator {
  // Prompting Queue
  prompting () {
    const prompts = [{
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
        this.opts            = answers;
        this.opts.lowerCase  = this.opts.name.toLowerCase();
        this.opts.prefix     = this.config.get('prefix') ? this.config.get('prefix') : 'app';
        this.opts.module     = caseIt.camelCase(`${this.opts.prefix}-${this.opts.name}-directive`);
        this.opts.directive  = caseIt.camelCase(`${this.opts.prefix}-${this.opts.name}`);
        this.opts.controller = caseIt.pascal(`${this.opts.name}-Ctrl`);
        this.opts.urlSafe    = caseIt.paramCase(`${this.opts.prefix}-${this.opts.name}`);
    });
  }

  // Writing Queue
  writing () {
    const opts     = this.opts,
          appFile  = 'src/js/app.js',
          compFile = 'src/scss/styling/_components.scss';

    let p1, p2 = null;

    // create the directive files using the templates
    if (opts.element) {
      this.fs.copyTpl(
        this.templatePath('directive.js'),
        this.destinationPath(`src/directives/${opts.urlSafe}/${opts.urlSafe}.directive.js`),
        opts
      );
      this.fs.copyTpl(
        this.templatePath('directive.html'),
        this.destinationPath(`src/directives/${opts.urlSafe}/${opts.urlSafe}.html`),
        opts
      );
      this.fs.copyTpl(
        this.templatePath('directive.scss'),
        this.destinationPath(`src/directives/${opts.urlSafe}/${opts.urlSafe}.scss`),
        opts
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('attr-directive.js'),
        this.destinationPath(`src/directives/${opts.urlSafe}/${opts.urlSafe}.directive.js`),
        opts
      );
    }

    // update the app file with the new module dependency
    p1 = fsp
      .readFile(this.destinationPath(appFile), 'utf8')
      .then((data) => {
        let newFile = data.replace(/(\/\/!!D!!\/\/)/, `'${opts.module}',\n\t\t\t//!!D!!//`);

        return fsp.writeFile(this.destinationPath(appFile), newFile);
      })
      .then(() => {
         this.log(`   ${chalk.green('update')} ${appFile}`);
      });

    if (opts.element) {
      // update the components sass file with the new component
      p2 = fsp
        .readFile(this.destinationPath(compFile), 'utf8')
        .then((data) => {
          let newFile = data.replace(/(\/\/!!D!!\/\/)/, `@import "../../directives/${opts.urlSafe}/${opts.urlSafe}";\n//!!D!!//`);

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
