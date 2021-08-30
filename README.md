# drink-tea-first

每日提醒插件，支持每日提醒，循环提醒功能，可自定义配置提醒任务

Remind you to do something

## Features

### Daily Reminder

每日提醒，默认添加 2 项任务，可配置任务时间和内容，每周任务提示天数

### Loop Reminder

循环提醒，默认添加 2 项提醒，可配置提醒任务，支持提醒文案、起止时间段、单个循环时间长度配置

## Extension Settings

- 每日提醒

  - `drink.daily.day`: 每周每日提醒生效天数，0-6 分别表示周日到周六

  - `drink.daily.task`: 配置每日提醒任务，任务触发前 1 秒仍可更改

  - task 示例

    ```json
    {
      "drink.daily.task": [
        {
          "time": "15:00:00", // 提醒时间
          "message": "亲，三点啦，先喝杯茶歇一歇啦～" // 提醒文案
        }
      ]
    }
    ```

- 循环提醒

  - `drink.loop.day`: 循环任务生效天数，0-6 分别表示周日到周六

  - `drink.loop.task`: 配置循环提醒任务

  - task 示例

    ```json
    {
      "drink.daily.task": [
        {
          "timeRange": [9, 18], // 提醒时间段
          "loop": 60, // 循环时间，单位分钟
          "message": "亲，记得喝水哦～" // 提醒文案
        }
      ]
    }
    ```

- 日期提醒

  - `drink.date.task`: 日期提醒任务

  - `drink.date.taskRemindTime`: 日期提醒时间

  - `drink.date.holiday`: 节假日提醒

  - `drink.date.holidayRemindTime`: 节假日提醒时间

  - 示例

    ```json
    {
      "drink.date.task": {
        "type": "array",
        "description": "日期提醒",
        "default": [
          {
            "date": "10-10",
            "name": "周年纪念日"
          }
        ]
      },
      "drink.date.taskRemindTime": {
        "type": "array",
        "description": "日期提醒时间点",
        "default": ["10:00:00", "15:00:00"]
      }
    }
    ```

## Known Issues

- 每日提醒目前暂不支持取消任务，任务会在提示时间的前 1 秒被推入任务队列，进入队列后无法取消

## Release Notes

详见更改日志
