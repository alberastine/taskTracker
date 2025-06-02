import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiUser,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaRegCalendar } from "react-icons/fa";

import "@/styles/scenes/sideBar.css";

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
            <Sidebar.Item
              icon={HiUser}
              onClick={() => setActiveWidget(0)}
              style={{ cursor: "pointer" }}
            >
              Profile
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiChartPie}
              onClick={() => setActiveWidget(1)}
              style={{ cursor: "pointer" }}
            >
              Task table
            </Sidebar.Item>
            <Sidebar.Item
              icon={FaRegCalendar}
              onClick={() => setActiveWidget(2)}
              style={{ cursor: "pointer" }}
            >
              Calendar
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineUserGroup}
              onClick={() => setActiveWidget(3)}
              style={{ cursor: "pointer" }}
            >
              My Team
            </Sidebar.Item>
            <Sidebar.Collapse
              icon={HiInbox}
              label="Inbox"
              style={{ cursor: "pointer" }}
            >
              <Sidebar.Item style={{ cursor: "pointer" }}>
                Deadlines
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => setActiveWidget(4)}
                style={{ cursor: "pointer" }}
              >
                Notification
              </Sidebar.Item>
            </Sidebar.Collapse>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default SibeBar;
