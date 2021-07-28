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
  "onBeforeRemind",
  "onReminded",
  "onBeforeUpdate",
  "onUpdated",
];

export default class Timer {
  // task queue
  queue: Array<Task>;
  // daily task queue
  dailyQueue: Array<Task>;
  // hooks
  hooks: any;
  // options
  options: Options;
  // interval id
  intervalObj: any;

  constructor(options: Options) {
    // save options
    this.options = options;
    // init task queue
    this.queue = [];
    this.dailyQueue = [];

    // init hooks array
    this.hooks = hooks.reduce((acc: Record<string, any>, cur: string) => {
      acc[cur] = [];
      return acc;
    }, {});

    // 等待插件注册
    setImmediate(() => this.create());
  }

  // 添加任务到队列中
  public addTask(task: Array<any>, type: string) {
    const taskArr = task.map((t) => {
      const { activeTime, message } = t;
      return {
        ...t,
        id: `${+new Date(activeTime)}-${message}`,
      };
    });
    if (type === "daily") {
      this.dailyQueue = [...this.dailyQueue, ...taskArr];
    } else {
      this.queue = [...this.queue, ...taskArr];
    }
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
      options: { interval = 1000 * 60 },
    } = this;
    this.flushHooks("onBeforeCreate");

    this.intervalObj = setInterval(() => {
      this.flushHooks("onBeforeRemind");

      this.intervalHandler();

      this.flushHooks("onReminded");

      this.shouldUpdate();
    }, interval);

    this.flushHooks("onCreated");
  }

  // 定时器任务处理
  intervalHandler() {
    const curTime = +new Date();
    const task = this.checkTask(curTime, 1000 * 60);
    const dailyTask = this.checkDailyTask(curTime, 1000 * 60);

    [...task, ...dailyTask].forEach((t: Task) => {
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

  // 检测每日任务
  checkDailyTask(curTimestamp: number, period: number) {
    return this.dailyQueue.filter((q: Task) => {
      const { activeTime, isDaily } = q;
      const hour = dayjs().hour();
      const minute = dayjs().minute();
      const second = dayjs().second();
      const activeTimestamp = +new Date(activeTime);

      const [actHour, actMinute, actSecond] = activeTime.split(":");
      return (
        parseInt(actHour) === hour &&
        parseInt(actMinute) === minute &&
        parseInt(actSecond) === second
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
