import { Document } from 'mongoose';

export interface IPost extends Document {
  readonly body: string;
  readonly postId: number;
  readonly title: string;
  readonly userId: number;
}
