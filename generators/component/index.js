'use strict';

var Generator = require('yeoman-generator'),
    chalk     = require('chalk'),
    yosay     = require('yosay'),
    download  = require('download-git-repo'),
    path      = require('path'),
    fs        = require('fs');

module.exports = class extends Generator {
  prompting () {
    var prompts = [{
      type: 'input',
      name: 'component',
      message: 'Which ngTricomB2B component would you like to import?'
    }, {
      type: 'input',
      name: 'dir',
      message: 'Where would you like to install?',
      default: 'components'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing () {
    const repo  = 'ngTricomB2B/' + this.props.component,
      dest      = path.join('src', this.props.dir, this.props.component),
      appFile   = 'src/js/app.js',
      compFile  = 'src/scss/styling/_components.scss';

    let p1, p2 = null;

    download(repo, dest, function (err) {
      if (err) return;
      console.log('success');
    });

    // update the app file with the new module dependency
    // p1 = fsp
    //   .readFile(this.destinationPath(appFile), 'utf8')
    //   .then((data) => {
    //
    //     let newFile = data.replace(/(\/\/!!C!!\/\/)/, `'${this.props.component}',\n      //!!C!!//`);
    //     return fsp.writeFile(this.destinationPath(appFile), newFile);
    //
    //   })
    //   .then(() => {
    //     this.log(`${chalk.green('update')} ${appFile}`);
    //   });
    //
    // if (props.element) {
    //   // update the components sass file with the new component
    //   p2 = fsp
    //     .readFile(this.destinationPath(compFile), 'utf8')
    //     .then((data) => {
    //
    //       let newFile = data.replace(/(\/\/!!D!!\/\/)/, `@import "../../components/${this.props.component}/${this.props.component}";\n//!!D!!//`);
    //       return fsp.writeFile(this.destinationPath(compFile), newFile);
    //
    //     })
    //     .then(() => {
    //       this.log(`${chalk.green('update')} ${compFile}`);
    //     });
    // }

    // prevents end queue from executing until writing queue is done
    // return Promise.all([p1, p2]);
  }
}
