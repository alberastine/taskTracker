import { Button, Modal, Typography } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { getUserTeams, sendTeamInvitation } from "../../context/teamContext";
import { UserContext } from "../../context/userContext";
import { User } from "../../models/User";
import { Team } from "../../models/Team";

import axios from "../../api/axios";

const InviteUser = ({ selectedTeamId, onTeamUpdated, }: { selectedTeamId: string, onTeamUpdated?: () => void; }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const { user: currentUser } = useContext(UserContext);

  const fetchAllUsers = useCallback(async () => {
    try {
      const { data } = await axios.get<User[]>("/allUserInfo");
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const teamsData = await getUserTeams();
      setTeams(teamsData);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchTeams()]).catch((err) =>
      console.error("Failed to initialize data:", err),
    );
  }, [fetchAllUsers, fetchTeams]);

  const handleInviteMember = async (teamId: string, userId: string) => {
    try {
      await sendTeamInvitation(teamId, userId);
      setIsInviteModalOpen(false);
      setInviteError(null);
      await fetchTeams();
      onTeamUpdated?.();
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
    }
  };

  const handleModalClose = () => {
    setIsInviteModalOpen(false);
    setSelectedTeam(null);
    setInviteError(null);
  };

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
            style={{
              backgroundColor: "rgb(14 116 144)",
              color: "white",
              border: "none",
            }}
            onClick={() =>
              selectedTeam &&
              handleTeamRequest("accept", selectedTeam, user._id)
            }
          >
            Accept
          </Button>
          <Button
            style={{
              backgroundColor: "rgb(220, 20, 60)",
              color: "white",
              border: "none",
            }}
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
          style={{
            backgroundColor: "rgb(14 116 144)",
            color: "white",
            border: "none",
          }}
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

  const selectedTeamData = teams.find((t) => t._id === selectedTeam);

  return (
    <div>
      <Button
        className="team-options w-full"
        style={{
          backgroundColor: "rgb(14 116 144)",
          color: "white",
          border: "none",
        }}
        onClick={() => {
          setSelectedTeam(selectedTeamId);
          setIsInviteModalOpen(true);
        }}
      >
        + Invite Member
      </Button>

      <Modal open={isInviteModalOpen} onCancel={handleModalClose} footer={null}>
        <Typography>Invite Team Member</Typography>

        {inviteError && <div className="mb-4 text-red-500">{inviteError}</div>}
        <div className="space-y-4">
          {allUsers
            .filter(
              (user) =>
                !selectedTeamData?.members_lists.some(
                  (member) => member.user_id === user._id,
                ) && selectedTeamData?.leader_id !== user._id,
            )
            .map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderAvatar(user)}
                  <span>{user.username}</span>
                </div>
                <div className="flex gap-2">
                  {renderTeamMemberActions(user, selectedTeamData)}
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default InviteUser;
