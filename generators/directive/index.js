'use strict';

/**
 * Generates a directive.
 */

var Generator     = require('yeoman-generator'),
    chalk         = require('chalk'),
    caseIt        = require('change-case'),
    fsp           = require('fs-promise'),
    esprima       = require('esprima'),
    escodegen     = require('escodegen'),
    estools       = require('estools'),
    estree_walker = require('estree-walker');

let dupe = false;

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
        // let newFile = data.replace(/(\/\/!!D!!\/\/)/, `'${props.module}',\n      //!!D!!//`);

        let ranarr = [],
          fil = esprima.parse(data,  {
            comment: true,
            range: true,
            tokens: true,
            attachComment: true
          }),
          els = fil.body[0].expression.callee.body.body[1].expression.callee.object.callee.object.arguments[1].elements;

        for(let i = 0; i < els.length; i++){
          if(els[i].value == props.module){
            dupe = true;
            break;
          }
          ranarr.push(els[i]);
        }

        if(!dupe) {

          fil.body[0].expression.callee.body.body[1].expression.callee.object.callee.object.arguments[1].elements.push({
            type: 'Literal',
            value: `${props.module}`,
            raw: `'${props.module}'`
          });

          els.sort(function (a, b) {
            if (a.value < b.value)
              return -1;
            if (a.value > b.value)
              return 1;
            return 0;
          });

          fil.body[0].expression.callee.body.body[1].expression.callee.object.callee.object.arguments[1].elements = els;

          removeDuplicateComments(fil);

          let newFile = escodegen.generate(fil, {
            parse: fil,
            comment: true,
            tokens: true,
            format: {
              indent: {
                style: '  ',
                base: 0,
                adjustMultilineComment: true
              },
              newline: '\n',
              space: ' ',
              json: false,
              renumber: false,
              hexadecimal: false,
              quotes: 'single',
              escapeless: false,
              compact: false,
              parentheses: true,
              semicolons: true,
              safeConcatenation: false
            }
          });

          return fsp.writeFile(this.destinationPath(appFile), newFile);

        }

      })
      .then(() => {
        if(dupe)
          this.log(chalk.red('Duplicate Directive'));
        else
          this.log(`${chalk.green('update')} ${appFile}`);
      });

    if (props.element && !dupe) {

      // update the components sass file with the new component
      p2 = fsp
        .readFile(this.destinationPath(compFile), 'utf8')
        .then((data) => {

          if(!dupe) {
            let newFile = data.replace(/(\/\/!!D!!\/\/)/, `@import "../../directives/${props.urlSafe}/${props.urlSafe}";\n//!!D!!//`);
            return fsp.writeFile(this.destinationPath(compFile), newFile);
          }

        })
        .then(() => {
          if(!dupe)
            this.log(`${chalk.green('update')} ${compFile}`);
        });
      }

    // prevents end queue from executing until writing queue is done
    return Promise.all([p1, p2]);

  }

  // End Queue
  end () {
    if(dupe)
      this.log(chalk.red('Directive not created'));
    else
      this.log(chalk.green('Your directive is ready'));
  }
}


function removeDuplicateComments(ast) {
  // Some comments are duplicated as both the leadingComment for one node,
  // and the trailing comment for another. Every comment's range is unique,
  // so two comments with the same range are talking about the same comment.
  // So we'll just remove all trailing comments which are also a leading
  // comment somewhere.
  console.log('REMOVEDUPE');

  const rangesInLeadingComments = new Set();

  estree_walker.walk(ast, {
    enter: (node) => {
      for (let leadingComment of node.leadingComments || []) {
        rangesInLeadingComments.add(leadingComment.range.join(','));
      }
    }
  });
  estree_walker.walk(ast, {
    enter: (node) => {
      if (!node.trailingComments) {
        return;
      }
      node.trailingComments = node.trailingComments.filter((comment) => {
        return !rangesInLeadingComments.has(comment.range.join(','));
      });
    }
  });
}