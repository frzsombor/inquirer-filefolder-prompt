'use strict';

var inquirer = require('inquirer');

inquirer.registerPrompt('filefolder', require('../inquirer-filefolder-prompt'));
inquirer.prompt({
  type: 'editor',
  name: 'file',
  message: 'Please select the file.',
  dialog: {
      type: 'OpenFileDialog',
      config: {
        win32: {
            title: 'Please select "DJI Assistant 2.exe"',
        }
        //...
      },
  },
  validate: function(file) {
    if (file.length === 0) {
      return 'No file selected.';
    }
    return true;
  }
}).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
});
