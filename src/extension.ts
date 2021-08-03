// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import Timer from "./service/core";
import dailyReminder from "./service/dailyReminder";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "drink-tea-first" is now active!'
  );

  // 新建定时器实例
  const timerInstance: Timer = new Timer();
  // 添加每日提醒插件
  timerInstance.use(dailyReminder());
}

// this method is called when your extension is deactivated
export function deactivate() {}
