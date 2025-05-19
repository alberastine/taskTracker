import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams } from "../../context/teamContext";
import { UserContext } from "../../context/userContext";
import { Team } from "../../models/Team";
import { User } from "../../models/User";

import WidgetWrapper from "../WidgetWrapper";
import axios from "../../api/axios";

import "../../styles/components/TeamPage.css";
import CreateTeam from "./CreateTeam";
import { Empty, Popover, Button } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";

const TeamPage = ({
  setActiveWidget,
  setSelectedTeamId,
}: {
  setActiveWidget: (key: number) => void;
  setSelectedTeamId: (teamId: string) => void;
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamColors, setTeamColors] = useState<{ [teamId: string]: string }>(
    () => {
      const saved = localStorage.getItem("teamColors");
      return saved ? JSON.parse(saved) : {};
    },
  );

  const { user: currentUser } = useContext(UserContext);

  const fetchAllUsers = useCallback(async () => {
    try {
      await axios.get<User[]>("/allUserInfo");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users");
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const teamsData = await getUserTeams();
      setTeams(teamsData);
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchTeams()]).catch((err) =>
      console.error("Failed to initialize data:", err),
    );
  }, [fetchTeams, fetchAllUsers]);

  useEffect(() => {
    const savedColors = localStorage.getItem("teamColors");
    if (savedColors) {
      setTeamColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teamColors", JSON.stringify(teamColors));
  }, [teamColors]);

  const changeTeamColor = (teamId: string, color: string) => {
    setTeamColors((prev) => ({ ...prev, [teamId]: color }));
  };

  const visibleTeams = teams.filter(
    (team) => !team.invited_users.some((u) => u.user_id === currentUser?._id),
  );

  return (
    <WidgetWrapper>
      <header className="teams-header">
        <CreateTeam onTeamCreated={fetchTeams} />
      </header>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : visibleTeams.length === 0 ? (
        <Empty description="You are not a member of any teams" />
      ) : (
        <div className="teams-grid">
          {visibleTeams.map((team) => (
            <div
              key={team._id}
              className="team-card"
              onClick={() => {
                setSelectedTeamId(team._id);
                setActiveWidget(5);
              }}
              style={{
                cursor: "pointer",
                backgroundColor: teamColors[team._id] || "#ffffff",
                position: "relative",
              }}
            >
              <Popover
                content={
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <input
                      type="color"
                      value={teamColors[team._id] || "#ffffff"}
                      onChange={(e) => {
                        changeTeamColor(team._id, e.target.value);
                      }}
                    />
                  </div>
                }
                title="Pick a background color"
                trigger="click"
              >
                <Button
                  shape="circle"
                  icon={<BgColorsOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popover>

              <div className="team-card-header">
                <strong>{team.team_name}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

export default TeamPage;
