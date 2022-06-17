import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop()
  body: string;

  @Prop()
  postId: number;

  @Prop()
  title: string;

  @Prop()
  userId: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
