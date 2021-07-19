// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import Timer from "./service/Timer";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "drink-tea-first" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "drink-tea-first.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Drink Tea First!");
    }
  );

  context.subscriptions.push(disposable);

  const options: Object = {
    teaTime: 15,
  };
  const localTimer: Timer = new Timer(options);

  const teaTime: number = localTimer.teaTime - localTimer.curTime;

  console.log(localTimer, teaTime);
  setTimeout(() => {
    vscode.window.showInformationMessage("Drink Tea First at 3 PM !");
  }, teaTime);
}

// this method is called when your extension is deactivated
export function deactivate() {}
