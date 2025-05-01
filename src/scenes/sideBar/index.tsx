import { Sidebar } from "flowbite-react";
import { HiChartPie, HiInbox, HiUser } from "react-icons/hi";
import { FaRegCalendar } from "react-icons/fa";

import "../../styles/scenes/sideBar.css";

const SibeBar = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  return (
    <>
      <Sidebar className="h-screen">
        <Sidebar.Items>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Tracker
          </span>
          <Sidebar.ItemGroup>
            <Sidebar.Item icon={HiUser} onClick={() => setActiveWidget(0)}>
              Users
            </Sidebar.Item>
            <Sidebar.Item icon={HiChartPie} onClick={() => setActiveWidget(1)}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              icon={FaRegCalendar}
              onClick={() => setActiveWidget(2)}
            >
              Calendar
            </Sidebar.Item>
            <Sidebar.Collapse icon={HiInbox} label="Inbox">
              <Sidebar.Item>Deadlines</Sidebar.Item>
              <Sidebar.Item>message</Sidebar.Item>
            </Sidebar.Collapse>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default SibeBar;
