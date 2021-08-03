import * as dayjs from "dayjs";

// 默认任务
// 15点饮茶 19点下班
const defaultTask = [
  {
    activeTime: "09:00:00",
    message: "喂！三点几啦，饮茶先啦！",
  },
  {
    activeTime: "14:45:00",
    message: "喂！快三点啦，看看基金股票啦！",
  },
  {
    activeTime: "19:00:00",
    message: "喂！朋友！差不多七点多啦，喝杯茶happy下，下班啦！",
  },
];

function dailyReminder() {
  // 定时器触发前检查是否需要插入任务
  function onTimerTrigger(timer: any, params: any) {
    const { triggerTimeTs } = params;
    const {
      options: { interval },
    } = timer;

    const task = defaultTask.reduce((acc: any, cur) => {
      const { activeTime } = cur;
      const str = `${dayjs(triggerTimeTs).format("YYYY-MM-DD")} ${activeTime}`;
      const taskTimeTs = +new Date(str);

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
