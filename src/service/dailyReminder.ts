import * as vscode from "vscode";
import * as dayjs from "dayjs";
import { getConfiguration, transTimeToDate } from "./utils";
import { DAILY_DAY, DAILY_TASK } from "./constants";

function dailyReminder() {
  // 读取默认任务配置
  let taskConf: Array<any> = getConfiguration(DAILY_TASK, []);
  // 读取默认提示日配置
  let dayConf: Array<number> = getConfiguration(DAILY_DAY, []);

  // 监听配置修改
  vscode.workspace.onDidChangeConfiguration((event) => {
    const isAffect: boolean = event.affectsConfiguration("drink.daily");

    // 配置是否有更新
    if (isAffect) {
      taskConf = getConfiguration(DAILY_TASK, []);
      dayConf = getConfiguration(DAILY_DAY, []);
    }
  });

  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    const task = taskConf.reduce((acc: any, cur: any) => {
      // 不在预设日期范围内不提示
      const curDay = dayjs().day();
      const isInRemindDay = dayConf.includes(curDay);

      if (!isInRemindDay) {
        return;
      }

      const { time } = cur;
      const timeObj = transTimeToDate(time);
      const taskTimeTs = +timeObj;

      // 当任务时间在当前时间间隔中时，在加入任务队列
      if (
        taskTimeTs >= triggerTimeTs &&
        taskTimeTs < triggerTimeTs + interval
      ) {
        acc.push({
          ...cur,
          time: taskTimeTs,
        });
      }
      return acc;
    }, []);

    if (task && task.length > 0) {
      timer.addTask(task);
    }
  }

  return {
    onTimerTrigger,
  };
}

export default dailyReminder;
