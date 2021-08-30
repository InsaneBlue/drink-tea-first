import * as vscode from "vscode";
import * as dayjs from "dayjs";
import { getConfiguration, transTimeToDate } from "./utils";
import {
  DATE_TASK,
  DATE_HOLIDAY,
  DATE_HOLIDAY_REMIND_TIME,
  DATE_TASK_REMIND_TIME,
  DATE_COUNTDOWN,
} from "./constants";

function dateReminder() {
  // 读取日期任务配置
  let taskConf: Array<any> = [];
  // 日期提醒时间点
  let taskTimeConf: Array<String> = [];
  // 节假日配置
  let holidayConf: Array<any> = [];
  // 假日提示时间
  let holidayTimeConf: Array<String> = [];

  getConf();

  // 监听配置修改
  vscode.workspace.onDidChangeConfiguration((event) => {
    const isAffect: boolean = event.affectsConfiguration("drink.daily");

    // 配置是否有更新
    if (isAffect) {
      getConf();
    }
  });

  // 读取配置的任务
  function getConf() {
    // 读取日期任务配置
    taskConf = getConfiguration(DATE_TASK, []);
    // 日期提醒时间点
    taskTimeConf = getConfiguration(DATE_TASK_REMIND_TIME, []);
    // 节假日配置
    holidayConf = getConfiguration(DATE_HOLIDAY, []);
    // 假日提示时间
    holidayTimeConf = getConfiguration(DATE_HOLIDAY_REMIND_TIME, []);
  }

  // 判断是否是提醒日
  function isRemindDate(date: String) {
    const res = {
      leftDay: 0,
      shouldRemind: false,
    };
    const curTime = dayjs();
    const dateTime = dayjs(`${curTime.year()}-${date}`);

    DATE_COUNTDOWN.forEach((c) => {
      if (dateTime.isSame(curTime.add(c, "day"), 'day')) {
        res.leftDay = c;
        res.shouldRemind = true;
      }
    });
    return res;
  }

  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    // 处理节假日提醒
    // 当前时间是否是配置的提醒时间点范围内
    const holidayTime = holidayTimeConf.find((t) => {
      const ts = +transTimeToDate(t);
      return ts >= triggerTimeTs && ts < triggerTimeTs + interval;
    });

    const holidayTask = holidayConf.reduce((acc: any, cur: any) => {
      const { date, name } = cur;
      // 是否是可提示日期
      const { shouldRemind, leftDay } = isRemindDate(date);

      if (shouldRemind && holidayTime) {
        const text =
          leftDay === 0
            ? `亲，今天就是 ${name} 啦`
            : `亲，距离 ${name} 还剩 ${leftDay} 天`;
        acc.push({
          message: text,
          time: +transTimeToDate(holidayTime),
        });
      }
      return acc;
    }, []);

    if (holidayTask && holidayTask.length > 0) {
      timer.addTask(holidayTask);
    }

    // 处理配置的日期提醒
    const taskTime = taskTimeConf.find((t) => {
      const ts = +transTimeToDate(t);
      return ts >= triggerTimeTs && ts < triggerTimeTs + interval;
    });

    const dateTask = taskConf.reduce((acc: any, cur: any) => {
      const { date, name } = cur;
      // 是否是可提示日期
      const { shouldRemind, leftDay } = isRemindDate(date);

      if (shouldRemind && taskTime) {
        const text =
          leftDay === 0
            ? `亲，今天就是 ${name} 啦`
            : `亲，距离 ${name} 还剩 ${leftDay} 天`;
        acc.push({
          message: text,
          time: +transTimeToDate(taskTime),
        });
      }
      return acc;
    }, []);

    if (dateTask && dateTask.length > 0) {
      timer.addTask(dateTask);
    }
  }

  return {
    onTimerTrigger,
  };
}

export default dateReminder;
