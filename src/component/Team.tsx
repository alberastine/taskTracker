import { useEffect, useState } from "react";
import { getUserTeams } from "../context/teamContext";
import { Team } from "../models/Team";
import "../styles/components/TeamPage.css";

const TeamPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchTeams();
  }, []);

  return (
    <div className="teams-container">
      <header className="teams-header">
        <h1>My Teams</h1>
        <button className="create-team-btn">+ Create New Team</button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : teams.length === 0 ? (
        <div className="empty-state">
          <img src="/empty-team.svg" alt="No teams" />
          <p>You are not a member of any teams</p>
          <button className="create-team-btn">Create Your First Team</button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team._id} className="team-card">
              <div className="team-card-header">
                <h3>{team.team_name}</h3>
                <button >⚙️</button>
              </div>
              <div className="team-members">
                <h4>Team Members ({team.members_lists.length})</h4>
                <ul className="members-list">
                  {team.members_lists.map((member) => (
                    <li key={member.user_id} className="member-item">
                      <span className="member-avatar">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                      <span className="member-name">{member.username}</span>
                    </li>
                  ))}
                </ul>
                <button className="invite-member-btn">+ Invite Member</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
