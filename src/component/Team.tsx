import { useEffect, useState } from "react";
import { getUserTeams } from "../context/teamContext";
import { Team } from "../models/Team";
import axios from "../api/axios";

import { HiDotsHorizontal } from "react-icons/hi";

import "../styles/components/TeamPage.css";
import { Button } from "flowbite-react";

const TeamPage = () => {
  const [allUsers, setAllUsers] = useState<
    { _id: string; username: string; profilePic?: string }[]
  >([]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUser = async () => {
    try {
      const res = await axios.get("/allUserInfo");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const teamsData = await getUserTeams();
      setTeams(teamsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch teams");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUser();
    fetchTeams();
  }, []);

  return (
    <div className="teams-container">
      <header className="teams-header">
        <Button size="sm" className="team-options">+ Create Team</Button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : teams.length === 0 ? (
        <p>You are not a member of any teams</p>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team._id} className="team-card">
              <div className="team-card-header">
                <h3>{team.team_name}</h3>
                <Button size="sm" color="gray" pill className="team-options">
                  <HiDotsHorizontal  size={20}/>
                </Button>
              </div>
              <div className="team-members">
                <h4>Team Members ({team.members_lists.length})</h4>
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
                <Button size="sm" className="team-options w-full">
                  + Invite Member
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
