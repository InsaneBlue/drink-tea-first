import * as vscode from "vscode";
import { isFunction } from "./utils";

interface Options {}

interface Task {
  activeTime: string;
  message: string;
  hasChecked?: boolean;
}

const hooks: Array<string> = [
  "onBeforeCreate",
  "onCreated",
  "onBeforeRemind",
  "onReminded",
  "onBeforeUpdate",
  "onUpdated",
];

export default class Timer {
  // task queue
  queue: Array<Task>;
  // hooks
  hooks: any;
  // options
  options: Options;
  // interval id
  intervalObj: any;

  constructor(options: Options) {
    this.options = options;
    // init task queue
    this.queue = [];

    // init hooks array
    this.hooks = hooks.reduce((acc: Record<string, any>, cur: string) => {
      acc[cur] = [];
      return acc;
    }, {});

    // 等待插件注册
    setImmediate(() => this.create());
  }

  // 注册插件
  use(plugin: any) {
    for (let key in plugin) {
      if (hooks.includes(key)) {
        this.hooks[key].push(plugin[key]);
      }
    }
  }

  // 初始化
  create() {
    this.flushHooks("onBeforeCreate");
    console.log("fffffffff");

    this.intervalObj = setInterval(() => {
      this.flushHooks("onBeforeRemind");

      this.intervalHandler();

      this.flushHooks("onReminded");

      this.shouldUpdate();
    }, 1000);

    this.flushHooks("onCreated");
  }

  // 定时器任务处理
  intervalHandler() {
    const curTime = +new Date();
    const task = this.checkTask(curTime, 1000 * 60);

    task.forEach((t: Task) => {
      const { message, activeTime } = t;
      const millisecond = +new Date(activeTime) - +new Date();
      t.hasChecked = true;

      setTimeout(() => {
        vscode.window.showInformationMessage(message);
      }, millisecond);
    });

    // 筛掉已经处理的任务
    this.queue = this.queue.filter((q) => !q.hasChecked);
  }

  // 检测是否零点，需要更新每日任务
  shouldUpdate() {
    this.flushHooks("onBeforeUpdate");

    const curTs = +new Date();
    console.log()

    this.flushHooks("onUpdated");
  }

  // 检查指定时间段内是否有任务
  checkTask(curTimestamp: number, period: number) {
    return this.queue.filter((q: Task) => {
      const { activeTime } = q;
      const activeTimestamp = +new Date(activeTime);
      return (
        activeTimestamp > curTimestamp &&
        activeTimestamp < curTimestamp + period
      );
    });
  }

  // 处理所有生命周期回调
  flushHooks(hookName: string = "") {
    this.hooks[hookName].forEach((h: any) => {
      if (isFunction(h)) {
        h(this);
      }
    });
  }
}
