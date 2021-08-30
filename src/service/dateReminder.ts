import * as vscode from "vscode";
import * as dayjs from "dayjs";
import { getConfiguration, transTimeToDate } from "./utils";
import { DATE_TASK, DATE_HOLIDAY } from "./constants";

function dateReminder() {
  // 读取默认任务配置
  let taskConf: Array<any> = getConfiguration(DATE_TASK, []);
  // 节假日配置
  let holidayConf: Array<any> = getConfiguration(DATE_HOLIDAY, [])
  // 待执行任务
  let dateTask: Array<any> = mapTask(taskConf);

  // 监听配置修改
  vscode.workspace.onDidChangeConfiguration((event) => {
    const isAffect: boolean = event.affectsConfiguration("drink.daily");

    // 配置是否有更新
    if (isAffect) {
      taskConf = getConfiguration(DATE_TASK, []);
      holidayConf = getConfiguration(DATE_HOLIDAY, []);

      dateTask = mapTask(taskConf);
    }
  });

  // 将配置转换为待执行的任务
  function mapTask(taskConf: Array<any>): Array<any> {
    const task: Array<any> = [];

    taskConf.forEach((t) => {
      const { timeRange: [start, end] = [], loop = 60, message = "" } = t;

      const startTimeObj = transTimeToDate(start);
      const endTimeObj = transTimeToDate(end);
      let begin = startTimeObj;

      if (message && loop > 0) {
        // 当前时间点在结束时间之前，且在开始时间之后，需要添加一个任务到队列中
        while (
          (endTimeObj.isAfter(begin) || endTimeObj.isSame(begin)) &&
          (startTimeObj.isBefore(begin) || startTimeObj.isSame(begin))
        ) {
          task.push({
            message,
            time: begin.format("HH:mm:ss"),
          });
          begin = begin.add(loop, "m");
        }
      }
    });

    return task;
  }

  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    const task = dateTask.reduce((acc: any, cur: any) => {

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
          time,
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

export default dateReminder;
