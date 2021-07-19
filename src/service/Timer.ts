interface Options {
  teaTime: number;
}

export default class Timer {
  // midnight timestamp
  midnightTime: number;
  // tea timestamp
  teaTime: number;
  // current timestamp
  curTime: number;

  constructor(options: Options) {
    this.midnightTime = 0;
    this.teaTime = 0;
    this.curTime = +new Date();

    this.init(options);
  }

  init(options: Options) {
    const { teaTime = 3 } = options;

    this.midnightTime = this.getMidnightTime();
    this.teaTime = this.getHourTime(teaTime);
  }

  getMidnightTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  }

  getHourTime(hour: number) {
    const { midnightTime } = this;
    const millisecond: number = hour * 3600 * 1000;
    return midnightTime + millisecond;
  }
}
