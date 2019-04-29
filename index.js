'use strict';

var chalk = require('chalk');
var Base = require('inquirer/lib/prompts/base');
var observe = require('inquirer/lib/utils/events');
var FileFolderDialogs = require('file-folder-dialogs');
var { Subject } = require('rxjs');

class FileFolderPrompt extends Base {
  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */

  _run(cb) {
    this.done = cb;

    this.dialogResult = new Subject();

    // Open dialog on "line" (Enter Key)
    var events = observe(this.rl);
    this.lineSubscription = events.line.subscribe(this.openDialog.bind(this));

    // Trigger Validation when editor closes
    var validation = this.handleSubmitEvents(this.dialogResult);
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));

    // Prevents default from being printed on screen (can look weird with multiple lines)
    this.currentText = this.opt.default;
    this.opt.default = null;

    // Initialize CTA
    this.messageCTA = this.opt.messageCTA || 'Press <enter> to open dialog.';

    // Initialize the dialog
    var dialogType = this.opt.dialog.type || 'OpenFileDialog';
    var dialogConfig = this.opt.dialog.config || {};
    this.dialog = new FileFolderDialogs[dialogType]();

    // Init
    this.render();

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {FileFolderPrompt} self
   */

  render(error) {
    var bottomContent = '';
    var message = this.getQuestion();

    if (this.status === 'answered') {
      message += chalk.dim('Selected');
    } else {
      message += chalk.dim(this.messageCTA);
    }

    if (error) {
      bottomContent = chalk.red('>> ') + error;
    }

    this.screen.render(message, bottomContent);
  }

  /**
   * Launch dialog on user press enter
   */

  openDialog() {
    var message = this.getQuestion() + chalk.dim(this.messageCTA + ' Waiting...');
    this.screen.render(message, '');

    // Pause Readline to prevent stdin and stdout from being modified while the editor is showing
    this.rl.pause();
    this.dialog.open(this.endDialog.bind(this));
  }

  endDialog(error, result) {
    this.rl.resume();
    if (error) {
      this.dialogResult.error(error);
    } else {
      this.dialogResult.next(result);
    }
  }

  onEnd(state) {
    this.dialogResult.unsubscribe();
    this.lineSubscription.unsubscribe();
    this.answer = state.value;
    this.status = 'answered';
    // Re-render prompt
    this.render();
    this.screen.done();
    this.done(this.answer);
  }

  onError(state) {
    this.render(state.isValid);
  }
}

module.exports = FileFolderPrompt;
