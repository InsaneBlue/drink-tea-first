import * as dayjs from "dayjs";
import { getConfiguration } from "./utils";
import * as vscode from "vscode";

function dailyReminder() {
  // 读取默认任务配置
  const defaultTask = getConfiguration().get("drink.daily.task", []);
  // 读取默认提示日配置
  const defaultDay: any = vscode.workspace
    .getConfiguration()
    .get("drink.daily.day", []);

  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    const task = defaultTask.reduce((acc: any, cur: any) => {
      const { activeTime } = cur;
      const str = `${dayjs(triggerTimeTs).format("YYYY-MM-DD")} ${activeTime}`;
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
          activeTime: str,
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
