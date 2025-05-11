import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams, sendTeamInvitation } from "../context/teamContext";
import { Team } from "../models/Team";
import axios from "../api/axios";
import { HiDotsHorizontal } from "react-icons/hi";
import { Modal, Button } from "flowbite-react";
import { UserContext } from "../context/userContext";
import "../styles/components/TeamPage.css";

// Types
interface User {
  _id: string;
  username: string;
  profilePic?: string;
}

interface TeamPageProps {}

const TeamPage: React.FC<TeamPageProps> = () => {
  // State management
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

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

  // Event handlers
  const handleInviteMember = async (teamId: string, userId: string) => {
    try {
      await sendTeamInvitation(teamId, userId);
      setIsInviteModalOpen(false);
      setInviteError(null);
      await fetchTeams();
    } catch (error) {
      setInviteError("Failed to send invitation");
    }
  };

  const handleTeamRequest = async (
    action: "accept" | "reject",
    teamId: string,
    userId: string,
  ) => {
    try {
      await axios.post(`/teams/${teamId}/${action}-request`, { userId });
      await fetchTeams();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      setError(`Failed to ${action} team request`);
    }
  };

  const handleModalClose = () => {
    setIsInviteModalOpen(false);
    setSelectedTeam(null);
    setInviteError(null);
  };

  // Render helpers
  const renderAvatar = (user: User) =>
    user.profilePic ? (
      <img
        src={`http://localhost:5000${user.profilePic}`}
        alt={`${user.username}'s avatar`}
        className="size-8 rounded-full"
      />
    ) : (
      <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
        {user.username.charAt(0).toUpperCase()}
      </div>
    );

  const renderTeamMemberActions = (user: User, teamData: Team | undefined) => {
    const isTeamLeader = teamData?.leader_id === currentUser?._id;
    const hasJoinRequest = teamData?.join_requests?.some(
      (request) => request.user_id === user._id,
    );
    const isInvited = teamData?.invited_users?.some(
      (invitedUser) => invitedUser.user_id === user._id,
    );

    if (isInvited) return <span className="text-gray-500">Invited</span>;

    if (isTeamLeader && hasJoinRequest) {
      return (
        <>
          <Button
            size="sm"
            onClick={() =>
              selectedTeam &&
              handleTeamRequest("accept", selectedTeam, user._id)
            }
          >
            Accept
          </Button>
          <Button
            size="sm"
            color="failure"
            onClick={() =>
              selectedTeam &&
              handleTeamRequest("reject", selectedTeam, user._id)
            }
          >
            Reject
          </Button>
        </>
      );
    }

    if (!hasJoinRequest && !isInvited) {
      return (
        <Button
          size="sm"
          onClick={() =>
            selectedTeam && handleInviteMember(selectedTeam, user._id)
          }
        >
          Invite
        </Button>
      );
    }

    if (!isTeamLeader) return <span className="text-gray-500">Requested</span>;

    return null;
  };

  return (
    <div className="teams-container">
      <header className="teams-header">
        <Button size="sm" className="team-options">
          + Create Team
        </Button>
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
                <HiDotsHorizontal size={20} />
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
                <Button
                  size="sm"
                  className="team-options w-full"
                  onClick={() => {
                    setSelectedTeam(team._id);
                    setIsInviteModalOpen(true);
                  }}
                >
                  + Invite Member
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={isInviteModalOpen} onClose={handleModalClose}>
        <Modal.Header>Invite Team Member</Modal.Header>
        <Modal.Body>
          {inviteError && (
            <div className="mb-4 text-red-500">{inviteError}</div>
          )}
          <div className="space-y-4">
            {allUsers
              .filter(
                (user) =>
                  !teams
                    .find((t) => t._id === selectedTeam)
                    ?.members_lists.some(
                      (member) => member.user_id === user._id,
                    ) &&
                  teams.find((t) => t._id === selectedTeam)?.leader_id !==
                    user._id,
              )
              .map((user) => {
                const selectedTeamData = teams.find(
                  (t) => t._id === selectedTeam,
                );

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {renderAvatar(user)}
                      <span>{user.username}</span>
                    </div>
                    <div className="flex gap-2">
                      {renderTeamMemberActions(user, selectedTeamData)}
                    </div>
                  </div>
                );
              })}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeamPage;
