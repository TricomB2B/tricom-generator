'use strict';

/**
 * Generates a factory.
 */

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    caseIt    = require('change-case'),
    fsp       = require('fs-promise');

module.exports = class extends Generator {
  // Prompting Queue
  prompting () {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of this Factory?',
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe this factory and make it sound sexy.',
      default: 'description'
    }];

    return this.prompt(prompts)
      .then((answers) => {
        this.props         = answers;
        this.props.prefix  = this.config.get('prefix') ? this.config.get('prefix') : 'app';
        this.props.module  = caseIt.camelCase(`${this.props.prefix}-${this.props.name}-factory`);
        this.props.factory = caseIt.pascal(`${this.props.name}-factory`);
        this.props.urlSafe = caseIt.paramCase(`${this.props.prefix}-${this.props.name}`);
      });
  }

  // Writing Queue
  writing () {
    const props   = this.props,
          appFile = 'src/js/app.js';

    let p1 = null;

    // create the factory file using the template
    this.fs.copyTpl(
      this.templatePath('factory.js'),
      this.destinationPath(`src/factories/${props.urlSafe}/${props.urlSafe}.factory.js`),
      props
    );

    // update the app file with the new module dependency
    p1 = fsp
      .readFile(this.destinationPath(appFile), 'utf8')
      .then((data) => {
        let newFile = data.replace(/(\/\/!!F!!\/\/)/, `'${props.module}',\n      //!!F!!//`);

        return fsp.writeFile(this.destinationPath(appFile), newFile);
      })
      .then(() => {
        this.log(`   ${chalk.green('update')} ${appFile}`);
      });

    // prevents end queue from executing until writing queue is done
    return Promise.all([p1]);
  }

  // End Queue
  end () {
    this.log(chalk.green('Your factory is ready'));
  }
}
