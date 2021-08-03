import * as dayjs from "dayjs";
import * as vscode from "vscode";
import { isFunction } from "./utils";

interface Options {
  interval?: number;
}

interface Task {
  id: string;
  activeTime: string;
  message: string;
  hasChecked?: boolean;
  isDaily?: boolean;
}

const hooks: Array<string> = [
  "onBeforeCreate",
  "onCreated",
  "onTimerTrigger",
  "onTimerTriggered",
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

  constructor(options: Options = {}) {
    // save options
    this.options = Object.assign(
      {
        interval: 1000,
      },
      options
    );
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

  // 添加任务到队列中
  public addTask(task: Array<any>) {
    const taskArr = task.map((t) => {
      const { activeTime, message } = t;
      return {
        ...t,
        id: `${+new Date(activeTime)}-${message}`,
      };
    });

    this.queue = [...this.queue, ...taskArr];
  }

  // 注册插件
  public use(plugin: any) {
    for (let key in plugin) {
      if (hooks.includes(key)) {
        this.hooks[key].push(plugin[key]);
      }
    }
  }

  // 初始化
  create() {
    const {
      options: { interval },
    } = this;
    this.flushHooks("onBeforeCreate");

    this.intervalObj = setInterval(() => {
      const curTimeTs = +new Date();
      this.flushHooks("onTimerTrigger", {
        triggerTimeTs: curTimeTs,
      });

      this.intervalHandler(curTimeTs);

      this.flushHooks("onTimerTriggered");
    }, interval);

    this.flushHooks("onCreated");
  }

  // 定时器任务处理
  intervalHandler(curTime: number) {
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
  flushHooks(hookName: string = "", params?: any) {
    this.hooks[hookName].forEach((h: any) => {
      if (isFunction(h)) {
        h(this, params);
      }
    });
  }
}
