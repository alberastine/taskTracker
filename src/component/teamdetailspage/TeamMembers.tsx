import { Divider, Empty, List, Typography } from "antd";

import { Team } from "../../models/Team";

const { Text } = Typography;

const TeamMembers = ({
  team,
}: {
  team: Team;
}) => {
  return (
    <div>
      <Divider orientation="left">Members</Divider>
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
