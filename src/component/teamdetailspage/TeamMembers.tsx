import { Button, Divider, Empty, List, Typography } from "antd";

import { Team } from "../../models/Team";
import InviteUser from "../teampage/InviteUser";

const { Text } = Typography;

const TeamMembers = ({ team }: { team: Team }) => {
  return (
    <div>
      <Divider orientation="left">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Text>Members</Text>
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
      </Divider>
      {team.members_lists.length > 0 ? (
        <List
          bordered
          dataSource={team.members_lists}
          renderItem={(member) => (
            <List.Item>
              <Text>{member.username}</Text>
              <Text type="secondary"> (ID: {member.user_id})</Text>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No members" />
      )}
    </div>
  );
};

export default TeamMembers;
