import SibeBar from "../sideBar";
import NavBar from "../navBar";
import TaskList from "../../component/TaskList";
import Calendar from "../../component/Calendar";
import TeamPage from "../../component/Team";
import UserProfile from "../../component/userpage/UserProfile";
import { useState } from "react";

const HomePage = () => {
  const [activeWidget, setActiveWidget] = useState<number>(0);

  const renderWidget = (key: number) => {
    switch (key) {
      case 0:
        return <UserProfile setActiveWidget={setActiveWidget} />;
      case 1:
        return <TaskList />;
      case 2:
        return <Calendar />;
      case 3:
        return <TeamPage />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="display-flex">
        <div>
          <NavBar />
        </div>
        <div>
          <aside
            id="default-sidebar"
            className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
            aria-label="Sidebar"
          >
            <SibeBar setActiveWidget={setActiveWidget} />
          </aside>

          <div className=" sm:ml-64">
            <div className="rounded-lg dark:border-gray-700">
              <div>{renderWidget(activeWidget)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
