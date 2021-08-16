import * as vscode from "vscode";
import * as dayjs from "dayjs";

// 判断是否是函数
export function isFunction(fun: any): boolean {
  return typeof fun === "function";
}

// 读取插件配置
export function getConfiguration(section: string, defaultValue: any): any {
  return vscode.workspace.getConfiguration().get(section, defaultValue);
}

export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

// 将时间字符串格式化为dayjs对象
export function transTimeToDate(timeString: String) {
  const str = `${dayjs().format("YYYY-MM-DD")} ${timeString}`;
  return dayjs(str, "YYYY-MM-DD HH:mm:ss");
}
