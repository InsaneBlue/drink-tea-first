import * as vscode from "vscode";
import * as dayjs from "dayjs";
import { getConfiguration } from "./utils";

function dailyReminder() {
  // 读取默认任务配置
  let defaultTask: Array<any> = getConfiguration("drink.daily.task", []);
  // 读取默认提示日配置
  let defaultDay: Array<number> = getConfiguration("drink.daily.day", []);

  // 监听配置修改
  vscode.workspace.onDidChangeConfiguration((event) => {
    const isAffect: boolean = event.affectsConfiguration("drink.daily");

    // 更新配置
    if (isAffect) {
      defaultTask = getConfiguration("drink.daily.task", []);
      defaultDay = getConfiguration("drink.daily.day", []);
    }
  });

  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    const task = defaultTask.reduce((acc: any, cur: any) => {
      const { time } = cur;
      const str = `${dayjs(triggerTimeTs).format("YYYY-MM-DD")} ${time}`;
      const taskTimeTs = +new Date(str);

      // 不在预设日期范围内不提示
      const curDay = dayjs(triggerTimeTs).day();
      const isInRemindDay = defaultDay.includes(curDay);

      if (!isInRemindDay) {
        return;
      }

      // 当任务时间在当前时间间隔中时，在加入任务队列
      if (
        taskTimeTs >= triggerTimeTs &&
        taskTimeTs < triggerTimeTs + interval
      ) {
        acc.push({
          ...cur,
          time: str,
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
