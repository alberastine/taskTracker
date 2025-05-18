import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams } from "../../context/teamContext";
import { UserContext } from "../../context/userContext";
import { Team } from "../../models/Team";
import { User } from "../../models/User";

import WidgetWrapper from "../WidgetWrapper";
import InviteUser from "./InviteUser";
import axios from "../../api/axios";

import "../../styles/components/TeamPage.css";
import CreateTeam from "./CreateTeam";
import { Button, Empty } from "antd";

const TeamPage = ({
  setActiveWidget,
  setSelectedTeamId,
}: {
  setActiveWidget: (key: number) => void;
  setSelectedTeamId: (teamId: string) => void;
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: currentUser } = useContext(UserContext);

  const fetchAllUsers = useCallback(async () => {
    try {
      const { data } = await axios.get<User[]>("/allUserInfo");
      setAllUsers(data);
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
            <div key={team._id} className="team-card">
              <div className="team-card-header">
                <strong>{team.team_name}</strong>
                <Button
                  className="team-options"
                  onClick={() => {
                    setSelectedTeamId(team._id);
                    setActiveWidget(5);
                  }}
                >
                  View Team
                </Button>
              </div>
              <div className="team-members">
                <h4>
                  Team Members ({team.members_lists.length}/{team.member_limit})
                </h4>
                <ul className="members-list">
                  {team.members_lists.map((member) => {
                    const foundUser = allUsers.find(
                      (user) => user._id === member.user_id,
                    );
                    return (
                      <li key={member.user_id} className="member-item">
                        <span className="member-avatar">
                          {foundUser?.profilePic ? (
                            <img
                              src={`http://localhost:5000${foundUser?.profilePic ?? ""}`}
                              alt={`${member.username}'s avatar`}
                              className="profile-pic"
                            />
                          ) : (
                            member.username.charAt(0).toUpperCase()
                          )}
                        </span>
                        <span className="member-name">
                          {foundUser?.username ?? member.username}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {team.members_lists.length >= team.member_limit ? (
                  <Button
                    className="team-options w-full"
                    disabled
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Team limit reached
                  </Button>
                ) : (
                  <InviteUser selectedTeamId={team._id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

export default TeamPage;
