export interface ITask {
  taskId: string;
  projectId: string;
  projectName: string;
  description: string;
  beginTime: string;
  endTime: string;
  totalTaskTime: number;
}

export interface IProject {
  name: string;
  color: string;
  projectHours: number;
  description?: string;
  userEmail:string;
}

export interface IUserInfo {
  email: string;
  password: string;
  username: string;
}