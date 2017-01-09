'use strict';

/**
 * Adds a method to a previously generated factory.
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
      name: 'factoryName',
      message: 'What is the name of the Factory?',
      validate: (answer) => {
        let prefix   = this.config.get('prefix') ? this.config.get('prefix') : 'app',
            filename = caseIt.paramCase(`${prefix}-${answer}`),
            filepath = this.destinationPath(`src/factories/${filename}/${filename}.factory.js`);

        if (this.fs.exists(filepath))
          return true;
        else
          return `Factory ${answer} does not exist.`;
      }
    }, {
      type: 'input',
      name: 'methodName',
      message: 'Name of this method?',
      validate: Boolean
    }, {
      type: 'input',
      name: 'methodDescription',
      message: 'Describe this method.',
      default: 'description'
    }];

    return this.prompt(prompts)
      .then((answers) => {
        this.props          = answers;
        this.props.prefix   = this.config.get('prefix') ? this.config.get('prefix') : 'app';
        this.props.filename = caseIt.paramCase(`${this.props.prefix}-${this.props.factoryName}`);
        this.props.filepath = `src/factories/${this.props.filename}/${this.props.filename}.factory.js`;
        this.props.method   = caseIt.camelCase(this.props.methodName);
      });
  }

  // Writing Queue
  writing () {
    const props = this.props;

    let p1 = null;

    // udpate the factory file with the new method
    p1 = fsp
      .readFile(this.destinationPath(props.filepath), 'utf8')
      .then((data) => {
        let newFile = data
          .replace(/(\/\/!!FC!!\/\/)/, `${props.method}: ${props.method},\n      //!!FC!!//`)
          .replace(/(\/\/!!FF!!\/\/)/, `/**\n     * ${props.methodDescription}\n     */\n    function ${props.method} {\n\n    }\n\n    //!!FF!!//`);

        return fsp.writeFile(this.destinationPath(props.filepath), newFile);
      })
      .then(() => {
        this.log(`   ${chalk.green('update')} ${props.filepath}`);
      });

    // prevents end qeuue from executing until writing queue is done
    return Promise.all([p1]);
  }

  // End Queue
  end () {
    this.log(chalk.green('Your factory method is ready'));
  }
}
