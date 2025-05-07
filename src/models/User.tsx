export interface Task {
    id: string;
    taskName: string;
    dateStarted: string;
    deadline: string;
    status: string;
  }
  
  export interface Event {
    title: string;
    date: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    gmail: string;
    password: string;
    tasks: Task[];
    events: Event[];
    profilePic: string;
    coverPic: string;
  }
  