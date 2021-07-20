import * as dayjs from "dayjs";

// 默认任务
// 15点饮茶 19点下班
const defaultTask = [
  {
    activeTime: "15:00:00",
    message: "喂！三点几啦，饮茶先啦！",
  },
  {
    activeTime: "19:00:00",
    message: "喂！朋友！差不多七点多啦，喝杯茶happy下，下班啦！",
  },
];

function dailyReminder() {
  // 给每日时间添加具体日期
  const mapTime = (time: string) => {
    return `${dayjs().format("YYYY-MM-DD")} ${time}`;
  };

  // 初始化时添加默认任务
  function onBeforeCreate(timer: any) {
    const task = defaultTask.map((t) => {
      const activeTime = mapTime(t.activeTime);
      return {
        ...t,
        activeTime,
      };
    });
    timer.queue = [...timer.queue, ...task];
  }

  return {
    onBeforeCreate,
  };
}

export default dailyReminder;
