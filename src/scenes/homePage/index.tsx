import SibeBar from "../sideBar";
import NavBar from "../navBar";
import TaskList from "@/component/taskpage/TaskList";
import Calendar from "@/component/Calendar";
import TeamPage from "@/component/teampage/Team";
import TeamDetailsPage from "@/component/teamdetailspage/TeamDetails";
import UserProfile from "@/component/userpage/UserProfile";
import Notification from "@/component/notificationspage/Notification";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HOME_ACTIVE_WIDGET_KEY = "homeActiveWidget";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTeamId, setSelectedTeamIdState] = useState<string | null>(
    () => {
      return sessionStorage.getItem("selectedTeamId");
    },
  );

  const [activeWidget, setActiveWidgetState] = useState<number>(() => {
    const saved = sessionStorage.getItem(HOME_ACTIVE_WIDGET_KEY);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return !isNaN(parsed) ? parsed : 0;
  });

  // Handle reset from login only once
  useEffect(() => {
    if (location.state?.resetHomeWidget) {
      sessionStorage.setItem(HOME_ACTIVE_WIDGET_KEY, "0");
      setActiveWidgetState(0);
      // Clear the state so it doesn't persist on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Sync to sessionStorage when activeWidget changes
  useEffect(() => {
    sessionStorage.setItem(HOME_ACTIVE_WIDGET_KEY, activeWidget.toString());
  }, [activeWidget]);

  const setActiveWidget = (key: number) => {
    setActiveWidgetState(key);
  };

  const setSelectedTeamId = (id: string | null) => {
    setSelectedTeamIdState(id);
    if (id) {
      sessionStorage.setItem("selectedTeamId", id);
    } else {
      sessionStorage.removeItem("selectedTeamId");
    }
  };

  const renderWidget = (key: number) => {
    switch (key) {
      case 0:
        return <UserProfile setActiveWidget={setActiveWidget} />;
      case 1:
        return <TaskList />;
      case 2:
        return <Calendar />;
      case 3:
        return (
          <TeamPage
            key={selectedTeamId}
            setActiveWidget={setActiveWidget}
            setSelectedTeamId={setSelectedTeamId}
          />
        );
      case 4:
        return <Notification />;
      case 5:
        return (
          <TeamDetailsPage
            key={selectedTeamId}
            teamId={selectedTeamId}
            setActiveWidget={setActiveWidget}
          />
        );
      default:
        return <UserProfile setActiveWidget={setActiveWidget} />;
    }
  };

  return (
    <div>
      <div className="display-flex">
        <div className="sticky top-0 z-10">
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

          <div className="sm:ml-64">
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
