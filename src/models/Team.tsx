export interface Team {
  _id: string;
  team_name: string;
  leader_id: string;
  member_limit: number;
  invited_users: Array<{
    user_id: string;
    username: string;
  }>;
  join_requests: Array<{
    user_id: string;
    username: string;
  }>;
  members_lists: Array<{
    user_id: string;
    username: string;
  }>;
    tasks: Array<{
        task_id: string;
        task_name: string;
        date_started: string;
        deadline: string;
        status: string;
    }>;
}
