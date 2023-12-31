import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProject, ITask } from '../types/types.index';

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  projects: IProject[];
  tasks: ITask[];
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  projects: {
    type: Array,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
