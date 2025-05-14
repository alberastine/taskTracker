import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams } from "../../context/teamContext";
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from "flowbite-react";
import { UserContext } from "../../context/userContext";
import { Team } from "../../models/Team";
import { User } from "../../models/User";

import WidgetWrapper from "../WidgetWrapper";
import InviteUser from "./InviteUser";
import axios from "../../api/axios";

import "../../styles/components/TeamPage.css";

const TeamPage = () => {
  // State management
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: currentUser } = useContext(UserContext);

  // API calls
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
  }, [fetchAllUsers, fetchTeams]);

  // Render
  const visibleTeams = teams.filter(
    (team) => !team.invited_users.some((u) => u.user_id === currentUser?._id),
  );

  return (
    <WidgetWrapper>
      <header className="teams-header">
        <Button size="sm" className="team-options">
          + Create Team
        </Button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : visibleTeams.length === 0 ? (
        <p>You are not a member of any teams</p>
      ) : (
        <div className="teams-grid">
          {teams
            .filter(
              (team) =>
                !team.invited_users.some((u) => u.user_id === currentUser?._id),
            )
            .map((team) => (
              <div key={team._id} className="team-card">
                <div className="team-card-header">
                  <strong>{team.team_name}</strong>

                  <HiDotsHorizontal size={20} />
                </div>
                <div className="team-members">
                  <h4>
                    Team Members ({team.members_lists.length}/
                    {team.member_limit})
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
                                src={`http://localhost:5000${foundUser.profilePic}`}
                                alt={`${member.username}'s avatar`}
                                className="profile-pic"
                              />
                            ) : (
                              member.username.charAt(0).toUpperCase()
                            )}
                          </span>
                          <span className="member-name">{member.username}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <InviteUser selectedTeamId={team._id} />
                </div>
              </div>
            ))}
        </div>
      )}
    </WidgetWrapper>
  );
};

export default TeamPage;
