import * as vscode from "vscode";

// 判断是否是函数
export function isFunction(fun: any) {
  return typeof fun === "function";
}

// 读取插件配置
export function getConfiguration() {
  return vscode.workspace.getConfiguration();
}
