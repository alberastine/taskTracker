import { useCallback, useContext, useEffect, useState } from "react";
import { Team } from "../../models/Team";
import { getUserTeams, respondToInvitation } from "../../context/teamContext";
import { UserContext } from "../../context/userContext";
import { Button, Empty, message, Typography } from "antd";

import WidgetWrapper from "../WidgetWrapper";

import "../../styles/components/Notification.css";
import { Spinner } from "flowbite-react";

const Notification = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const [loadingAction, setLoadingAction] = useState<{
    teamId: string;
    action: "accept" | "decline";
  } | null>(null);

  const { user: currentUser } = useContext(UserContext);

  const fetchTeams = useCallback(async () => {
    try {
      const teamsData = await getUserTeams();
      setTeams(teamsData);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchTeams()]).catch((err) =>
      console.error("Failed to initialize data:", err),
    );
  }, [fetchTeams]);

  if (!currentUser) {
    return <div>User not found</div>;
  }

  const handleResponse = async (teamId: string, accept: boolean) => {
    setLoadingAction({ teamId, action: accept ? "accept" : "decline" });

    const delay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await delay;
      await respondToInvitation(teamId, accept);

      setTeams((prev) =>
        prev.filter(
          (team) =>
            !team.invited_users.some((u) => u.user_id === currentUser?._id),
        ),
      );
      message.success("Invitation response sent successfully");
      await delay;
      message.success("You are now a member of the team");
    } catch (error) {
      console.error("Error responding to invitation", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const invitations = teams.filter((team) =>
    team.invited_users.some((u) => u.user_id === currentUser?._id),
  );

  return (
    <WidgetWrapper>
      <div>
        {invitations.length === 0 ? (
          <Empty description="No notification at this time." />
        ) : (
          invitations.map((team) => (
            <div key={team._id} className="child-notification">
              <Typography>
                You have been invited to the team
                <strong> "{team.team_name}"</strong>
              </Typography>
              <div className=" flex gap-3">
                <Button
                  onClick={() => handleResponse(team._id, true)}
                  disabled={!!loadingAction}
                  style={{
                    backgroundColor: "rgb(14 116 144)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Accept
                  {loadingAction?.teamId === team._id &&
                    loadingAction?.action === "accept" && (
                      <Spinner size="sm" className="ml-2" />
                    )}
                </Button>
                <Button
                  onClick={() => handleResponse(team._id, false)}
                  disabled={!!loadingAction}
                  style={{
                    backgroundColor: "rgb(220, 20, 60)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Decline
                  {loadingAction?.teamId === team._id &&
                    loadingAction?.action === "decline" && (
                      <Spinner size="sm" className="ml-2" />
                    )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </WidgetWrapper>
  );
};
export default Notification;
