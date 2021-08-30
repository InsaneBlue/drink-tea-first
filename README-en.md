# drink-tea-first

A remind extension including daily reminder and loop reminder, which can remind you to do something.

## Features

### Daily Reminder

2 tasks are added by default, custom configs in setting json are also supported.

### Loop Reminder

2 tasks are added by default, custom configs in setting json are also supported.

## Extension Settings

- daily reminder

  - `drink.daily.day`: task activate days, 0-6 stand for Sunday to Saturday

  - `drink.daily.task`: daily task, can be changed before task activates

  - example

    ```json
    {
      "drink.daily.task": [
        {
          "time": "15:00:00", // task time
          "message": "亲，三点啦，先喝杯茶歇一歇啦～" // task text
        }
      ]
    }
    ```

- loop reminder

  - `drink.loop.day`: task activate days, 0-6 stand for Sunday to Saturday

  - `drink.loop.task`: loop task, can be changed before task activates

  - example

    ```json
    {
      "drink.daily.task": [
        {
          "timeRange": [9, 18], // time range of task
          "loop": 60, // loop interval time
          "message": "亲，记得喝水哦～" // task text
        }
      ]
    }
    ```

- date reminder

  - `drink.date.task`: date task

  - `drink.date.taskRemindTime`: date task activate time

  - `drink.date.holiday`: holiday task

  - `drink.date.holidayRemindTime`: holiday task activate time

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

- cancel task is not supported now. Tasks will be push into queue 1 sec before the activate time comes, then they can not be canceled.

## Release Notes

more details in changelog
