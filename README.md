# inquirer-filefolder-prompt

**BETA VERSION! UNDER DEVELOPEMENT!**

File/folder prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js).  
Based on [file-folder-dialogs](https://github.com/frzsombor/file-folder-dialogs).

## Installation

```
npm install --save inquirer-filefolder-prompt
```

## Usage

This prompt is anonymous, meaning you can register this prompt with the type name you please:

```javascript
inquirer.registerPrompt('filefolder', require('inquirer-filefolder-prompt'));
inquirer.prompt({
  type: 'filefolder',
  ...
})
```

Change `name: 'file'` to whatever you might prefer.

### Options

Coming soon...


#### Example

```javascript
inquirer.registerPrompt('filefolder', require('inquirer-filefolder-prompt'));
inquirer.prompt({
  type: 'filefolder',
  name: 'file',
  message: 'Please select the file.',
  dialog: {
      type: 'OpenFileDialog',
      config: {
          'title': 'Open',
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
```

See also the [examples](https://github.com/frzsombor/inquirer-filefolder-prompt/blob/master/examples/) folder.

## License

MIT © [Zsombor Franczia](https://github.com/frzsombor/)
