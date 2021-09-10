import * as vscode from "vscode";
import * as dayjs from "dayjs";

import { isFunction } from "./utils";
import { REMIND_LATER, CLOSE, LATER_MINUTE } from "./constants";

interface Options {
  interval?: number;
}

interface Task {
  id: string;
  time: number;
  message: string;
  hasChecked?: boolean;
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
      const { time, message } = t;
      return {
        ...t,
        id: `${time}-${message}`,
      };
    });

    this.queue = [...this.queue, ...taskArr];
  }

  // 注册插件
  public use(plugin: any) {
    for (let key in plugin) {
      if (hooks.includes(key) && isFunction(plugin[key])) {
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
      const { message, time } = t;
      const millisecond = time - +new Date();
      t.hasChecked = true;

      setTimeout(async () => {
        try {
          const res = await vscode.window.showInformationMessage(
            message,
            REMIND_LATER,
            CLOSE
          );
          // 点击稍后提醒，延迟一定时间再次弹出任务
          if (res === REMIND_LATER) {
            this.remindLater(t);
          }
        } catch (e) {
          console.log("showInformationMessage error", e);
        }
      }, millisecond);
    });

    // 筛掉已经处理的任务
    this.queue = this.queue.filter((q) => !q.hasChecked);
  }

  // 检查指定时间段内是否有任务
  checkTask(curTimestamp: number, period: number) {
    return this.queue.filter((q: Task) => {
      const { time } = q;
      return time > curTimestamp && time < curTimestamp + period;
    });
  }

  // 处理所有生命周期回调
  flushHooks(hookName: string = "", params?: any): void {
    this.hooks[hookName].forEach((h: any) => {
      if (isFunction(h)) {
        h(this, params);
      }
    });
  }

  // 一段时候再次提醒
  remindLater(task: Task): void {
    const { time } = task;

    this.addTask([
      {
        ...task,
        time: +dayjs(time).add(LATER_MINUTE, "m"),
        hasChecked: false,
      },
    ]);
  }
}
