import WidgetWrapper from "./WidgetWrapper";

import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import type { Dayjs } from "dayjs";
import { Card } from "flowbite-react";

import "../styles/components/Calendar.css";

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const TaskCalendar = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <WidgetWrapper>
      <div className="calendar-main-container">
        <div className="calenda-side-event">
          <Card
            className="max-w-sm"
            style={{
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Add Event
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Drag and drop to add event
            </p>
          </Card>
        </div>
        <div className="calendar-container">
          <Calendar cellRender={cellRender} />
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default TaskCalendar;
