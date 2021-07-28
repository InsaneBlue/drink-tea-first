import * as dayjs from "dayjs";

// 默认任务
// 15点饮茶 19点下班
const defaultTask = [
  {
    activeTime: "09:00:00",
    message: "喂！三点几啦，饮茶先啦！",
  },
  {
    activeTime: "19:00:00",
    message: "喂！朋友！差不多七点多啦，喝杯茶happy下，下班啦！",
  },
];

function dailyReminder() {
  // 初始化生命周期
  function onBeforeCreate(timer: any) {
    timer.addTask(defaultTask, "daily");
  }

  return {
    onBeforeCreate,
  };
}

export default dailyReminder;
